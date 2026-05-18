import { z } from "zod";
import { ROLES } from "@/features/auth/schemas/auth";

export const createUserSchema = z.object({
	email: z.email(),
	password: z.string().min(6, "Password must be at least 6 characters"),
	name: z.string().min(1, "Name is required"),
	username: z.string().min(1, "Username is required"),
	role: ROLES,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
