import { v } from "convex/values";

export const COLLEGE = {
    COMPUTER_STUDIES: 0,
    BUSINESS_AND_ACCOUNTANCY: 1,
    EDUCATION: 2,
    GRADUATE_SCHOOL: 3,
    HUMANITIES_AND_SOCIAL_SCIENCE: 4,
    LAW: 5,
    NURSING: 6,
    SCIENCE_ENGINEERING_ARCHITECTURE: 7,
} as const;

export type CollegeId = (typeof COLLEGE)[keyof typeof COLLEGE];

export const collegeValidator = v.union(
    v.literal(0),
    v.literal(1),
    v.literal(2),
    v.literal(3),
    v.literal(4),
    v.literal(5),
    v.literal(6),
    v.literal(7),
);

export const COLLEGE_KEYS: Record<CollegeId, string> = {
    0: "computer-studies",
    1: "business-and-accountancy",
    2: "education",
    3: "graduate-school",
    4: "humanities-and-social-science",
    5: "law",
    6: "nursing",
    7: "science-engineering-architecture",
};

export const COLLEGE_ID_BY_KEY: Record<string, CollegeId> = Object.fromEntries(
    Object.entries(COLLEGE_KEYS).map(([id, key]) => [key, Number(id) as CollegeId]),
);

export const CSV_COLLEGE_TO_ID: Record<string, CollegeId> = {
    "Computer Studies": COLLEGE.COMPUTER_STUDIES,
    "Business and Accountancy": COLLEGE.BUSINESS_AND_ACCOUNTANCY,
    "Education": COLLEGE.EDUCATION,
    "Graduate School": COLLEGE.GRADUATE_SCHOOL,
    "Humanities and Social Sciences": COLLEGE.HUMANITIES_AND_SOCIAL_SCIENCE,
    "Law": COLLEGE.LAW,
    "Nursing": COLLEGE.NURSING,
    "Science, Engineering and Architecture": COLLEGE.SCIENCE_ENGINEERING_ARCHITECTURE,
};
