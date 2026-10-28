import { defineSchema } from "convex/server";
import { audit_log } from "./audit/audit.model";
import { users } from "./users/user.model";

export default defineSchema({
    users,
    audit_log,
});
