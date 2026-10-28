import { v } from "convex/values";
import { QueryCtx } from "../../_generated/server";
import { CollegeId, collegeValidator } from "../../lib/colleges";
import { requireUser } from "../../lib/auth";
import { toPublicProfile } from "../publicProfile";

export const searchArgs = { query: v.string(), college: v.optional(collegeValidator) };

export const searchHandler = async (ctx: QueryCtx, args: { query: string; college?: CollegeId }) => {
    await requireUser(ctx);
    const text = args.query.trim();
    if (!text) return [];
    const results = await ctx.db
        .query("users")
        .withSearchIndex("search_full_name", (q) => {
            const base = q.search("full_name", text).eq("is_published", true);
            return args.college === undefined ? base : base.eq("college", args.college);
        })
        .take(20);
    return results.map(toPublicProfile);
};
