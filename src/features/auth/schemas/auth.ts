import { z } from "zod";

export const ROLES = z.enum(["admin", "user"]);

export type ROLES = z.infer<typeof ROLES>;
export const signInSchema = z.discriminatedUnion("method", [
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

export type SignInInput = z.infer<typeof signInSchema>;

export const signInFormSchema = z.object({
	identifier: z.string().min(1, "Email or username is required"),
	password: z.string().min(1, "Password is required"),
});
