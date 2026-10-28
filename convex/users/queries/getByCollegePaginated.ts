import { PaginationOptions, paginationOptsValidator } from "convex/server";
import { QueryCtx } from "../../_generated/server";
import { CollegeId, collegeValidator } from "../../lib/colleges";
import { requireUser } from "../../lib/auth";
import { toPublicProfile } from "../publicProfile";

export const getByCollegePaginatedArgs = {
    college: collegeValidator,
    paginationOpts: paginationOptsValidator,
};

export const getByCollegePaginatedHandler = async (
    ctx: QueryCtx,
    args: { college: CollegeId; paginationOpts: PaginationOptions },
) => {
    await requireUser(ctx);
    const result = await ctx.db
        .query("users")
        .withIndex("by_college_published", (q) => q.eq("college", args.college).eq("is_published", true))
        .paginate(args.paginationOpts);
    return { ...result, page: result.page.map(toPublicProfile) };
};
