import { defineTable } from "convex/server";
import { v } from "convex/values";

export const audit_log = defineTable({
    actor_clerk_id: v.string(),
    target_user_id: v.id("users"),
    action: v.string(),
    diff: v.optional(v.any()),
    at: v.number(),
}).index("by_target", ["target_user_id"]);
