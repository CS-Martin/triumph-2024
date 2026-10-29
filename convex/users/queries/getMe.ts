import { QueryCtx } from "../../_generated/server";

export const getMeHandler = async (ctx: QueryCtx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
        .unique();
    if (!user || !user.is_active) return null;
    return {
        _id: user._id,
        slug: user.slug,
        college: user.college,
        first_name: user.first_name,
        last_name: user.last_name,
        middle_initial: user.middle_initial,
        suffix: user.suffix,
        must_change_password: user.must_change_password,
    };
};
