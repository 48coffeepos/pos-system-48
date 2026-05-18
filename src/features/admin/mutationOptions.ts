import { mutationOptions } from "@tanstack/react-query";
import adminUsersKeys from "./keys";
import type { CreateAccountInput, UpdateAccountInput } from "./schemas/admin";
import { createAccount } from "./server/createAccount";
import { removeAccount } from "./server/removeAccount";
import { updateAccount } from "./server/updateAccount";

export const createAccountMutationOptions = mutationOptions({
	mutationFn: async (data: CreateAccountInput) => createAccount({ data }),
	onSuccess: async (_data, _variables, _onMutateResult, context) => {
		await context.client.invalidateQueries({ queryKey: adminUsersKeys.accounts() });
	},
});

export const updateAccountMutationOptions = mutationOptions({
	mutationFn: async (data: UpdateAccountInput) => updateAccount({ data }),
	onSuccess: async (_data, _variables, _onMutateResult, context) => {
		await context.client.invalidateQueries({ queryKey: adminUsersKeys.accounts() });
	},
});

export const removeAccountMutationOptions = mutationOptions({
	mutationFn: async (userId: string) => removeAccount({ data: { userId } }),
	onSuccess: async (_data, _variables, _onMutateResult, context) => {
		await context.client.invalidateQueries({ queryKey: adminUsersKeys.accounts() });
	},
});
