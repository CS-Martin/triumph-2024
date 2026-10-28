import { Doc } from "../_generated/dataModel";

export const toPublicProfile = (user: Doc<"users">) => ({
    _id: user._id,
    slug: user.slug,
    first_name: user.first_name,
    last_name: user.last_name,
    middle_initial: user.middle_initial,
    suffix: user.suffix,
    full_name: user.full_name,
    school_level: user.school_level,
    program: user.program,
    major: user.major,
    college: user.college,
    has_toga: user.has_toga,
    write_up: user.write_up,
    achievements: user.achievements,
    affiliations: user.affiliations,
    toga_key: user.toga_key,
    creative_key: user.creative_key,
});

export type PublicProfile = ReturnType<typeof toPublicProfile>;
