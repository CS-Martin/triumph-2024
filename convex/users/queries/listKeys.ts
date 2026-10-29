import { QueryCtx } from "../../_generated/server";

export const listKeysHandler = async (ctx: QueryCtx) => {
    const users = await ctx.db.query("users").collect();
    return users.map((u) => ({ college: u.college, slug: u.slug, uuid: u.uuid }));
};
