import { MutationCtx } from "../../_generated/server";
import { requireIdentity } from "../../lib/auth";

export const markPasswordChangedHandler = async (ctx: MutationCtx) => {
    const identity = await requireIdentity(ctx);
    const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
        .unique();
    if (!user || !user.is_active) throw new Error("Forbidden");
    if (user.must_change_password) await ctx.db.patch(user._id, { must_change_password: false });
};
