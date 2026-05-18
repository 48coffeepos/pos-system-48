import { mutationOptions } from "@tanstack/react-query";
import { authClient } from "@/integrations/better-auth/auth-client";
import type { ROLES } from "../auth/schemas/auth";

export const setRoleMutationOptions = mutationOptions({
	mutationFn: async ({ userId, role }: { userId: string; role: ROLES }) => {
		const { data, error } = await authClient.admin.setRole({ userId, role });
		if (error) throw new Error(error.message || "Failed to update role");
		return data;
	},
});

export const createUserMutationOptions = mutationOptions({
	mutationFn: async ({
		email,
		password,
		name,
		role,
	}: {
		email: string;
		password: string;
		name: string;
		role?: ROLES;
	}) => {
		const { data, error } = await authClient.admin.createUser({
			email,
			password,
			name,
			role: role ?? "user",
		});
		if (error) throw new Error(error.message || "Failed to create user");
		return data;
	},
});

export const removeUserMutationOptions = mutationOptions({
	mutationFn: async (userId: string) => {
		const { data, error } = await authClient.admin.removeUser({ userId });
		if (error) throw new Error(error.message || "Failed to remove user");
		return data;
	},
});
