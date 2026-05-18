import { mutationOptions } from "@tanstack/react-query";
import { auth } from "@/integrations/better-auth/auth";
import { authClient } from "@/integrations/better-auth/auth-client";
import type { ROLES } from "../auth/schemas/auth";
import type { CreateCashierInput } from "./schemas/admin";
import { createCashier } from "./server/createCashier";

export const setRoleMutationOptions = mutationOptions({
	// mutationFn: async ({ userId, role }: { userId: string; role: ROLES }) => {
	// const { data, error } = await auth.api.setRole({ body: { userId, role } });
	// if (error) throw new Error(error.message || "Failed to update role");
	// return data;
	// },
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
