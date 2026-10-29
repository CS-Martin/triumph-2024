import { MutationCtx, QueryCtx } from "../_generated/server";

type Ctx = QueryCtx | MutationCtx;

export const requireIdentity = async (ctx: Ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    return identity;
};

export const requireUser = async (ctx: Ctx, opts: { allowPendingPassword?: boolean } = {}) => {
    const identity = await requireIdentity(ctx);
    const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
        .unique();
    if (!user || !user.is_active) throw new Error("Forbidden");
    if (user.must_change_password && !opts.allowPendingPassword) throw new Error("Password change required");
    return user;
};

export const requireAdmin = async (ctx: Ctx) => {
    const identity = await requireIdentity(ctx);
    const allowlist = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map((id: string) => id.trim());
    const isAdmin = identity.role === "admin" || allowlist.includes(identity.subject);
    if (!isAdmin) throw new Error("Forbidden");
    return identity;
};
