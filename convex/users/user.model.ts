import { defineTable } from "convex/server";
import { v } from "convex/values";
import { collegeValidator } from "../lib/colleges";
import { schoolLevelValidator } from "../lib/schoolLevels";

export const userFields = {
    // Stable public identifier (opaque; survives re-imports and deployment moves)
    uuid: v.string(),

    // Identity / Clerk link (set when the account is provisioned)
    clerk_id: v.optional(v.string()),
    username: v.optional(v.string()),
    is_active: v.boolean(),
    must_change_password: v.boolean(),

    // CSV columns
    first_name: v.string(),
    last_name: v.string(),
    middle_initial: v.optional(v.string()),
    suffix: v.optional(v.string()),
    school_level: schoolLevelValidator,
    program: v.string(),
    major: v.optional(v.string()),
    college: collegeValidator,
    has_toga: v.boolean(),
    write_up: v.optional(v.string()),
    achievements: v.array(v.string()),
    affiliations: v.array(v.string()),

    // Derived / app fields
    slug: v.string(),
    full_name: v.string(),
    toga_key: v.optional(v.string()),
    creative_key: v.optional(v.string()),
    is_published: v.boolean(),
};

export const users = defineTable(userFields)
    .index("by_uuid", ["uuid"])
    .index("by_clerk_id", ["clerk_id"])
    .index("by_username", ["username"])
    .index("by_college_slug", ["college", "slug"])
    .index("by_college_published", ["college", "is_published", "last_name", "first_name"])
    .searchIndex("search_full_name", {
        searchField: "full_name",
        filterFields: ["college", "is_published"],
    });
