import { v } from "convex/values";
import { QueryCtx } from "../../_generated/server";
import { CollegeId, collegeValidator } from "../../lib/colleges";
import { requireUser } from "../../lib/auth";
import { toPublicProfile } from "../publicProfile";

export const getBySlugArgs = { college: collegeValidator, slug: v.string() };

export const getBySlugHandler = async (ctx: QueryCtx, args: { college: CollegeId; slug: string }) => {
    await requireUser(ctx);
    const user = await ctx.db
        .query("users")
        .withIndex("by_college_slug", (q) => q.eq("college", args.college).eq("slug", args.slug))
        .unique();
    return user && user.is_published ? toPublicProfile(user) : null;
};
