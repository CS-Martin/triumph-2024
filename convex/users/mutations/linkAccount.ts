import { v } from "convex/values";
import { MutationCtx } from "../../_generated/server";
import { collegeValidator } from "../../lib/colleges";
import { CollegeId } from "../../lib/colleges";

export const linkAccountArgs = {
    clerk_id: v.string(),
    username: v.optional(v.string()),
    college: collegeValidator,
    slug: v.string(),
};

export const linkAccountHandler = async (
    ctx: MutationCtx,
    args: { clerk_id: string; username?: string; college: CollegeId; slug: string },
) => {
    const user = await ctx.db
        .query("users")
        .withIndex("by_college_slug", (q) => q.eq("college", args.college).eq("slug", args.slug))
        .unique();
    if (!user) throw new Error(`No user at college ${args.college} slug ${args.slug}`);
    await ctx.db.patch(user._id, { clerk_id: args.clerk_id, username: args.username ?? args.slug });
    return user._id;
};
