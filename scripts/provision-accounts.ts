import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { randomInt } from "node:crypto";
import { COLLEGE_KEYS } from "../convex/lib/colleges";

// Usage: bun scripts/provision-accounts.ts [--dry-run] [--push] [--prod]
// Default is --dry-run: prints planned usernames without touching Clerk.
// --push creates the Clerk accounts and links them in Convex.
// Requires CLERK_SECRET_KEY in .env.local.

const CLERK_API = "https://api.clerk.com/v1";
const BATCH_DELAY_MS = 250;

const run = (args: string[], input?: string) =>
    spawnSync("bunx", args, { encoding: "utf8", input });

const convexRun = <T>(fn: string, args: unknown, prod: boolean): T => {
    const result = run(
        ["convex", "run", ...(prod ? ["--prod"] : []), fn, JSON.stringify(args)],
    );
    if (result.status !== 0) throw new Error(`${fn} failed:\n${result.stderr}`);
    return JSON.parse(result.stdout.trim()) as T;
};

const fold = (value: string) =>
    value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();

const makeUsername = (first: string, last: string) =>
    fold(`${last}_${first}`).replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60);

const makePassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 16 }, () => chars[randomInt(chars.length)]).join("");
};

const clerkApi = (secret: string, method: string, path: string, body?: object) => {
    const res = run([
        "curl", "-sS", "-w", "\n%{http_code}", "-X", method,
        `${CLERK_API}${path}`,
        "-H", `Authorization: Bearer ${secret}`,
        "-H", "Content-Type: application/json",
        ...(body ? ["-d", JSON.stringify(body)] : []),
    ]);
    const out = res.stdout.trim();
    const code = Number(out.split("\n").pop());
    const text = out.slice(0, out.lastIndexOf("\n"));
    return { code, body: text };
};

const clerkCreateUser = (secret: string, user: {
    username: string;
    password: string;
    external_id: string;
    first_name: string;
    last_name: string;
}) =>
    clerkApi(secret, "POST", "/users", {
        username: user.username,
        password: user.password,
        external_id: user.external_id,
        first_name: user.first_name,
        last_name: user.last_name,
        public_metadata: { mustChangePassword: true },
    });

const clerkResetPassword = (secret: string, clerkId: string, password: string) =>
    clerkApi(secret, "PATCH", `/users/${clerkId}`, { password });

type UserRow = {
    uuid: string;
    slug: string;
    college: number;
    first_name: string;
    last_name: string;
    username?: string;
    clerk_id?: string;
};

const main = async () => {
    const args = process.argv.slice(2);
    const push = args.includes("--push");
    const prod = args.includes("--prod");

    // Pull current users via the listKeys internal query + a fetch of full docs is not needed:
    // listKeys gives college/slug/uuid; usernames/clerk_ids we get from a convex data dump.
    const data = run(["convex", "data", ...(prod ? ["--prod"] : []), "users", "--limit", "1000", "--format", "jsonLines"]);
    if (data.status !== 0) throw new Error(`convex data failed:\n${data.stderr}`);
    const users: UserRow[] = data.stdout
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((l) => JSON.parse(l));

    const unprovisioned = users.filter((u) => !u.clerk_id);
    console.log(`${users.length} users total, ${unprovisioned.length} need accounts`);

    const usernames = new Set<string>(users.filter((u) => u.username).map((u) => u.username!));
    const plan = unprovisioned.map((u) => {
        const base = makeUsername(u.first_name, u.last_name) || u.slug.replace(/-/g, "_").slice(0, 60);
        let username = base;
        for (let i = 2; usernames.has(username); i++) username = `${base}${i}`.slice(0, 63);
        usernames.add(username);
        return { ...u, username, password: makePassword() };
    });

    const dupe = plan.length - new Set(plan.map((p) => p.username)).size;
    console.log(`Planned: ${plan.length} accounts (${dupe} deduplicated usernames)`);
    for (const p of plan.slice(0, 10)) console.log(`  ${p.username}  <-  ${p.last_name}, ${p.first_name}`);
    if (plan.length > 10) console.log(`  … and ${plan.length - 10} more`);

    if (!push) {
        console.log("\nDry run only. Re-run with --push to create the accounts in Clerk.");
        return;
    }

    const secret = process.env.CLERK_SECRET_KEY;
    if (!secret) throw new Error("CLERK_SECRET_KEY not set");

    const credDir = ".local/credentials";
    if (!existsSync(credDir)) mkdirSync(credDir, { recursive: true });
    const header = "last_name,first_name,username,temp_password";
    const credFile = (college: number) =>
        `${credDir}/${COLLEGE_KEYS[college as keyof typeof COLLEGE_KEYS] ?? college}.csv`;
    const appendCred = (u: { college: number; last_name: string; first_name: string; username: string }, pw: string) => {
        const file = credFile(u.college);
        if (!existsSync(file)) writeFileSync(file, header + "\n");
        appendFileSync(file, `"${u.last_name}","${u.first_name}","${u.username}","${pw}"\n`);
    };
    const hasCred = (username: string | undefined) =>
        username !== undefined &&
        Object.values(COLLEGE_KEYS).some((key) => {
            const f = `${credDir}/${key}.csv`;
            return existsSync(f) && readFileSync(f, "utf8").includes(`"${username}"`);
        });

    let created = 0, failed = 0;
    for (const [i, p] of plan.entries()) {
        const { code, body } = clerkCreateUser(secret, {
            username: p.username,
            password: p.password,
            external_id: p.uuid,
            first_name: p.first_name,
            last_name: p.last_name,
        });
        if (code !== 200) {
            console.error(`✗ ${p.username}: HTTP ${code} ${body.slice(0, 200)}`);
            if (code === 403 && body.includes("user_quota_exceeded")) {
                console.error("Clerk user quota reached — stopping. Use a production instance for all 985.");
                break;
            }
            failed++;
            continue;
        }
        const clerkId = JSON.parse(body).id as string;
        convexRun("users/index:linkAccount", {
            clerk_id: clerkId,
            username: p.username,
            college: p.college,
            slug: p.slug,
        }, prod);
        appendCred(p, p.password);
        created++;
        if ((i + 1) % 50 === 0) console.log(`Progress: ${created} created, ${failed} failed`);
        await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
    console.log(`\nDone: ${created} created, ${failed} failed.`);

    if (args.includes("--reset-missing")) {
        let reset = 0;
        for (const u of users.filter((u) => u.clerk_id && u.username && !hasCred(u.username))) {
            const pw = makePassword();
            const { code, body } = clerkResetPassword(secret, u.clerk_id!, pw);
            if (code !== 200) {
                console.error(`✗ reset ${u.username}: HTTP ${code} ${body.slice(0, 150)}`);
                continue;
            }
            appendCred({ college: u.college, last_name: u.last_name, first_name: u.first_name, username: u.username! }, pw);
            reset++;
            await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
        }
        console.log(`Reset passwords for ${reset} provisioned users missing credentials.`);
    }
    console.log(`Credentials written to ${credDir}/ — gitignored, delete after distribution.`);
};

main().catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
});
