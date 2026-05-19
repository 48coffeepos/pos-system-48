export const ROLES = {
	admin: "admin",
	staff: "staff",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_VALUES = Object.values(ROLES) as RoleName[];
