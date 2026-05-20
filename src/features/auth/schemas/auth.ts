import { z } from "zod";
import { ROLE_VALUES } from "../roles";

export const ROLES = z.enum(ROLE_VALUES);

export type ROLES = z.infer<typeof ROLES>;
export const LogInSchema = z.discriminatedUnion("method", [
	z.object({
		method: z.literal("email"),
		email: z.email(),
		password: z.string().min(1, "Password is required"),
	}),
	z.object({
		method: z.literal("username"),
		username: z.string().min(1, "Username is required"),
		password: z.string().min(1, "Password is required"),
	}),
]);

export type LogInInput = z.infer<typeof LogInSchema>;

export const LogInFormSchema = z.object({
	identifier: z.string().min(1, "Email or username is required"),
	password: z.string().min(1, "Password is required"),
});
