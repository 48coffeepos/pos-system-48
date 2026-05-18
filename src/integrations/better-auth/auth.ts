import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAccessControl } from "better-auth/plugins/access";
import { admin } from "better-auth/plugins/admin";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";
import { username } from "better-auth/plugins/username";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { prisma } from "../prisma/db";

const statements = { ...defaultStatements } as const;

export const ac = createAccessControl(statements);

export const cashier = ac.newRole({
	// cashier permissions here
});

export const adminRole = ac.newRole({
	...adminAc.statements,
});
export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		username(),
		admin({
			ac,
			defaultRole: "cashier",
			roles: {
				cashier,
				admin: adminRole,
			},
		}),
		tanstackStartCookies(),
	],
	experimental: {
		joins: true,
	},
});
