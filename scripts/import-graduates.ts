import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { CollegeId, CSV_COLLEGE_TO_ID } from "../convex/lib/colleges";
import { CSV_SCHOOL_LEVEL_TO_ID, SchoolLevelId } from "../convex/lib/schoolLevels";

// Usage: bun scripts/import-graduates.ts <csv> [--push] [--prod] [--skip-photos] [--overrides=file.json]
// Default is a dry run: it only writes .local/import-report.json and prints a summary.

type ImportRow = {
    first_name: string;
    last_name: string;
    middle_initial?: string;
    suffix?: string;
    school_level: SchoolLevelId;
    program: string;
    major?: string;
    college: CollegeId;
    has_toga: boolean;
    write_up?: string;
    achievements: string[];
    affiliations: string[];
    slug: string;
    full_name: string;
    toga_key?: string;
    creative_key?: string;
};

type Overrides = Record<string, { toga_key?: string; creative_key?: string }>;

const BATCH_SIZE = 50;
const REPORT_DIR = ".local";

const parseCsv = (text: string): string[][] => {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = "";
    let quoted = false;
    const src = text.replace(/^\uFEFF/, "");
    for (let i = 0; i < src.length; i++) {
        const c = src[i];
        if (quoted) {
            if (c === '"' && src[i + 1] === '"') {
                field += '"';
                i++;
            } else if (c === '"') quoted = false;
            else field += c;
        } else if (c === '"') quoted = true;
        else if (c === ",") {
            row.push(field);
            field = "";
        } else if (c === "\n" || c === "\r") {
            if (c === "\r" && src[i + 1] === "\n") i++;
            row.push(field);
            field = "";
            if (row.some((value) => value !== "")) rows.push(row);
            row = [];
        } else field += c;
    }
    row.push(field);
    if (row.some((value) => value !== "")) rows.push(row);
    return rows;
};

const fold = (value: string) =>
    value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();

const squash = (value: string) => fold(value).replace(/[^a-z0-9]/g, "");
const slugify = (value: string) => fold(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const clean = (value: string | undefined) => {
    const trimmed = (value ?? "").replace(/\s+/g, " ").trim();
    return trimmed === "" || trimmed.toLowerCase() === "none" ? undefined : trimmed;
};

const cleanName = (value: string | undefined, suffix: string | undefined) => {
    let name = (value ?? "").replace(/\s+/g, " ").trim();
    if (suffix) {
        const tail = new RegExp(`[,\\s]*${suffix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
        name = name.replace(tail, "");
    }
    return name.replace(/[,\s]+$/, "").trim();
};

const splitList = (value: string | undefined) =>
    (value ?? "")
        .split(/[\n|]|,(?![^(]*\))/)
        .map((item) => item.replace(/\s+/g, " ").trim())
        .filter((item) => item !== "" && item.toLowerCase() !== "none");

const listObjects = async (client: S3Client, bucket: string, prefix: string) => {
    const keys: string[] = [];
    let token: string | undefined;
    do {
        const page = await client.send(
            new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken: token }),
        );
        for (const item of page.Contents ?? []) if (item.Key) keys.push(item.Key);
        token = page.NextContinuationToken;
    } while (token);
    return keys;
};

const indexPhotos = (keys: string[], kind: "TOGA" | "CRE") => {
    const index = new Map<string, string[]>();
    for (const key of keys) {
        const file = key.split("/").pop() ?? "";
        if (!file.startsWith(`${kind}_`)) continue;
        const stem = squash(file.slice(kind.length + 1).replace(/\.[a-z0-9]+$/i, ""));
        index.set(stem, [...(index.get(stem) ?? []), key]);
    }
    return index;
};

const main = async () => {
    const args = process.argv.slice(2);
    const csvPath = args.find((arg) => !arg.startsWith("--"));
    if (!csvPath) throw new Error("Usage: bun scripts/import-graduates.ts <csv> [--push] [--prod] [--skip-photos]");
    const push = args.includes("--push");
    const prod = args.includes("--prod");
    const skipPhotos = args.includes("--skip-photos");
    if (push && skipPhotos) throw new Error("--push with --skip-photos would erase photo keys; refusing.");

    const overridesPath = args.find((arg) => arg.startsWith("--overrides="))?.slice("--overrides=".length);
    const overrides: Overrides = overridesPath ? JSON.parse(readFileSync(overridesPath, "utf8")) : {};

    const [header, ...records] = parseCsv(readFileSync(csvPath, "utf8"));
    const col = (name: string) => header.map((h) => h.trim()).indexOf(name);
    const cell = (record: string[], name: string) => record[col(name)];

    const problems: string[] = [];
    const rows: ImportRow[] = [];
    const slugsSeen = new Map<string, number>();

    records.forEach((record, i) => {
        const line = i + 2;
        const suffix = clean(cell(record, "suffix"));
        const first = cleanName(cell(record, "first_name"), suffix);
        const last = cleanName(cell(record, "last_name"), suffix);
        const middle = clean(cell(record, "middle_initial"));
        const college = CSV_COLLEGE_TO_ID[clean(cell(record, "college")) ?? ""];
        const level = CSV_SCHOOL_LEVEL_TO_ID[clean(cell(record, "school_level")) ?? ""];
        const program = clean(cell(record, "program"));
        if (!first || !last) return void problems.push(`line ${line}: missing name`);
        if (college === undefined) return void problems.push(`line ${line}: unknown college "${cell(record, "college")}"`);
        if (level === undefined) return void problems.push(`line ${line}: unknown school_level "${cell(record, "school_level")}"`);
        if (!program) return void problems.push(`line ${line}: missing program`);

        const base = slugify(`${last} ${first} ${middle ?? ""}`);
        const seenKey = `${college}/${base}`;
        const count = (slugsSeen.get(seenKey) ?? 0) + 1;
        slugsSeen.set(seenKey, count);

        rows.push({
            first_name: first,
            last_name: last,
            middle_initial: middle,
            suffix,
            school_level: level,
            program,
            major: clean(cell(record, "major")),
            college,
            has_toga: false,
            write_up: clean(cell(record, "write_up")),
            achievements: splitList(cell(record, "achievements")),
            affiliations: splitList(cell(record, "affiliations")),
            slug: count === 1 ? base : `${base}-${count}`,
            full_name: fold(`${first} ${middle ?? ""} ${last} ${suffix ?? ""}`).replace(/[^a-z0-9]+/g, " ").trim(),
        });
    });

    const report = {
        total_csv_rows: records.length,
        rows_ready: rows.length,
        problems,
        duplicate_slugs: [...slugsSeen].filter(([, n]) => n > 1).map(([key, n]) => ({ key, count: n })),
        toga_matched: 0,
        creative_matched: 0,
        missing_toga: [] as string[],
        missing_creative: [] as string[],
        ambiguous: [] as string[],
        unmatched_objects: [] as string[],
    };

    if (!skipPhotos) {
        const missingEnv = ["R2_BUCKET_NAME", "R2_ENDPOINT", "R2_ACCESS_KEY", "R2_SECRET_KEY"].filter((n) => !process.env[n]);
        if (missingEnv.length) throw new Error(`Missing env: ${missingEnv.join(", ")} (or pass --skip-photos for a dry run)`);
        const client = new S3Client({
            region: "auto",
            endpoint: process.env.R2_ENDPOINT,
            credentials: { accessKeyId: process.env.R2_ACCESS_KEY!, secretAccessKey: process.env.R2_SECRET_KEY! },
        });
        const bucket = process.env.R2_BUCKET_NAME!;
        const prefix = process.env.R2_PREFIX ?? "triumph-2024/";
        const keys = await listObjects(client, bucket, prefix);
        const toga = indexPhotos(keys, "TOGA");
        const creative = indexPhotos(keys, "CRE");
        const used = new Set<string>();

        const primaryCounts = new Map<string, number>();
        for (const row of rows) {
            const k = squash(`${row.last_name}${row.first_name}${row.middle_initial ?? ""}`);
            primaryCounts.set(k, (primaryCounts.get(k) ?? 0) + 1);
        }

        const match = (index: Map<string, string[]>, row: ImportRow) => {
            const l = squash(row.last_name);
            const f = squash(row.first_name);
            const m = squash(row.middle_initial ?? "");
            const s = squash(row.suffix ?? "");
            for (const candidate of [l + f + m + s, l + f + m, l + f + s, l + f]) {
                const found = index.get(candidate);
                if (found?.length === 1) return found[0];
                if (found && found.length > 1) return "ambiguous" as const;
            }
            return undefined;
        };

        for (const row of rows) {
            const id = `${row.college}/${row.slug}`;
            const label = `${id} (${row.last_name}, ${row.first_name})`;
            const override = overrides[id];
            const primary = squash(`${row.last_name}${row.first_name}${row.middle_initial ?? ""}`);
            const duplicate = (primaryCounts.get(primary) ?? 0) > 1;
            const resolve = (index: Map<string, string[]>, forced: string | undefined) => {
                if (forced) return forced;
                if (duplicate) return "ambiguous" as const;
                return match(index, row);
            };
            const t = resolve(toga, override?.toga_key);
            const c = resolve(creative, override?.creative_key);
            if (t === "ambiguous" || c === "ambiguous") report.ambiguous.push(label);
            if (typeof t === "string" && t !== "ambiguous") {
                row.toga_key = t;
                row.has_toga = true;
                used.add(t);
                report.toga_matched++;
            } else if (t === undefined) report.missing_toga.push(label);
            if (typeof c === "string" && c !== "ambiguous") {
                row.creative_key = c;
                used.add(c);
                report.creative_matched++;
            } else if (c === undefined) report.missing_creative.push(label);
        }
        report.unmatched_objects = keys.filter(
            (key) => /\/(TOGA|CRE)_/.test(key) && !used.has(key),
        );
    }

    if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR);
    writeFileSync(`${REPORT_DIR}/import-report.json`, JSON.stringify({ ...report, rows }, null, 2));
    console.log(
        JSON.stringify(
            {
                ...report,
                problems: report.problems.length,
                duplicate_slugs: report.duplicate_slugs.length,
                missing_toga: report.missing_toga.length,
                missing_creative: report.missing_creative.length,
                ambiguous: report.ambiguous.length,
                unmatched_objects: report.unmatched_objects.length,
            },
            null,
            2,
        ),
    );
    console.log(`Full report: ${REPORT_DIR}/import-report.json`);

    if (!push) return console.log("Dry run only. Re-run with --push to write to Convex.");
    if (problems.length) throw new Error("Fix CSV problems before pushing.");

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE);
        const result = spawnSync(
            "bunx",
            ["convex", "run", ...(prod ? ["--prod"] : []), "users/index:importBatch", JSON.stringify({ rows: batch })],
            { encoding: "utf8" },
        );
        if (result.status !== 0) throw new Error(`Batch at ${i} failed:\n${result.stderr}`);
        console.log(`Pushed ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length}`);
    }
};

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
