import { Infer, v } from "convex/values";
import { MutationCtx } from "../../_generated/server";
import { userFields } from "../user.model";

const importRow = v.object({
    first_name: userFields.first_name,
    last_name: userFields.last_name,
    middle_initial: userFields.middle_initial,
    suffix: userFields.suffix,
    school_level: userFields.school_level,
    program: userFields.program,
    major: userFields.major,
    college: userFields.college,
    has_toga: userFields.has_toga,
    write_up: userFields.write_up,
    achievements: userFields.achievements,
    affiliations: userFields.affiliations,
    slug: userFields.slug,
    full_name: userFields.full_name,
    toga_key: userFields.toga_key,
    creative_key: userFields.creative_key,
});

export const importBatchArgs = { rows: v.array(importRow) };

export const importBatchHandler = async (ctx: MutationCtx, args: { rows: Infer<typeof importRow>[] }) => {
    let inserted = 0;
    let updated = 0;
    for (const row of args.rows) {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_college_slug", (q) => q.eq("college", row.college).eq("slug", row.slug))
            .unique();
        if (existing) {
            await ctx.db.patch(existing._id, row);
            updated++;
        } else {
            await ctx.db.insert("users", { ...row, is_active: true, must_change_password: true, is_published: true });
            inserted++;
        }
    }
    return { inserted, updated };
};
