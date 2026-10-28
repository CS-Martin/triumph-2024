import { v } from "convex/values";

export const SCHOOL_LEVEL = {
    UNDERGRADUATE: 0,
    GRADUATE_SCHOOL: 1,
} as const;

export type SchoolLevelId = (typeof SCHOOL_LEVEL)[keyof typeof SCHOOL_LEVEL];

export const schoolLevelValidator = v.union(v.literal(0), v.literal(1));

export const CSV_SCHOOL_LEVEL_TO_ID: Record<string, SchoolLevelId> = {
    "undergraduate": SCHOOL_LEVEL.UNDERGRADUATE,
    "Graduate School": SCHOOL_LEVEL.GRADUATE_SCHOOL,
};
