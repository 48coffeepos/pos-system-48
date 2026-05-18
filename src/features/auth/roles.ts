export const ROLES = {
	admin: "admin",
	cashier: "cashier",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_VALUES = Object.values(ROLES) as RoleName[];
