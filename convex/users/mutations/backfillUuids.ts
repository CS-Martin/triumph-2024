import { MutationCtx } from "../../_generated/server";

export const backfillUuidsHandler = async (ctx: MutationCtx) => {
    const users = await ctx.db.query("users").collect();
    let assigned = 0;
    for (const user of users) {
        if (!user.uuid) {
            await ctx.db.patch(user._id, { uuid: crypto.randomUUID() });
            assigned++;
        }
    }
    return { total: users.length, assigned };
};
