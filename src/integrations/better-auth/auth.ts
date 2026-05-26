import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins/admin";
import { username } from "better-auth/plugins/username";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { adminPluginConfig } from "@/features/auth/access";
import { prisma } from "../prisma/db";
export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [username(), admin(adminPluginConfig), tanstackStartCookies()],
	experimental: {
		joins: true,
	},
	trustedOrigins: [process.env.BETTER_AUTH_URL!],
});
