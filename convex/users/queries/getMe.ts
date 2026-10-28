import { QueryCtx } from "../../_generated/server";
import { requireUser } from "../../lib/auth";

export const getMeHandler = async (ctx: QueryCtx) => {
    const user = await requireUser(ctx);
    return {
        _id: user._id,
        slug: user.slug,
        college: user.college,
        full_name: user.full_name,
        must_change_password: user.must_change_password,
    };
};
