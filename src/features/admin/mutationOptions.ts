import { mutationOptions } from "@tanstack/react-query";
import type { RoleName } from "@/features/auth/roles";
import { authClient } from "@/integrations/better-auth/auth-client";
import adminUsersKeys from "./keys";
import type { CreateCashierInput } from "./schemas/admin";
import { createCashier } from "./server/createCashier";

export const setRoleMutationOptions = mutationOptions({
	mutationFn: async ({ userId, role }: { userId: string; role: RoleName }) => {
		const { data, error } = await authClient.admin.setRole({ userId, role });
		if (error) throw new Error(error.message || "Failed to update role");
		return data;
	},
	onSuccess: async (_, __, ___, context) => {
		await context.client.invalidateQueries({ queryKey: adminUsersKeys.all });
	},
});

export const createCashierMutationOptions = mutationOptions({
	mutationFn: async (data: CreateCashierInput) => createCashier({ data }),
});

export const removeUserMutationOptions = mutationOptions({
	mutationFn: async (userId: string) => {
		const { data, error } = await authClient.admin.removeUser({ userId });
		if (error) throw new Error(error.message || "Failed to remove user");
		return data;
	},
});
