import { z } from "zod";
import { ROLES } from "@/features/auth/schemas/auth";

const nameSchema = z.string().trim().min(1, "Name is required");
const usernameSchema = z.string().trim().min(1, "Username is required");
const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

export const CreateAccountSchema = z.object({
	email: z.email(),
	password: passwordSchema,
	name: nameSchema,
	username: usernameSchema,
	role: ROLES,
});

export const UpdateAccountSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
	name: nameSchema,
	password: passwordSchema.optional(),
});

export const CreateAccountFormSchema = CreateAccountSchema.extend({
	mode: z.literal("create"),
});

export const EditAccountFormSchema = z.object({
	mode: z.literal("edit"),
	userId: z.string().min(1, "User ID is required"),
	name: nameSchema,
	password: z.union([
		z.literal(""),
		passwordSchema,
	]),
});

export const AccountFormSchema = z.discriminatedUnion("mode", [
	CreateAccountFormSchema,
	EditAccountFormSchema,
]);

export type CreateAccountInput = z.input<typeof CreateAccountSchema>;
export type UpdateAccountInput = z.input<typeof UpdateAccountSchema>;
export type AccountFormInput = z.input<typeof AccountFormSchema>;
