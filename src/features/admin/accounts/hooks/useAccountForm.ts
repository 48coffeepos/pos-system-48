import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import adminUsersKeys from "@/features/admin/accounts/keys";
import {
	createAccountMutationOptions,
	updateAccountMutationOptions,
} from "@/features/admin/accounts/mutationOptions";
import {
	type AccountFormInput,
	AccountFormSchema,
} from "@/features/admin/accounts/schemas/admin";
import type { AdminAccount } from "@/features/admin/accounts/types";
import { ROLES } from "@/features/auth/roles";
import { useAppForm } from "@/integrations/tanstack-form";

interface UseAccountFormOptions {
	editingAccount: AdminAccount | null;
	onCompleted: () => void;
}

function getDefaultValues(
	editingAccount: AdminAccount | null,
): AccountFormInput {
	if (editingAccount !== null) {
		return {
			mode: "edit" as const,
			userId: editingAccount.id,
			name: editingAccount.name,
			password: "",
		};
	}

	return {
		mode: "create" as const,
		name: "",
		email: "",
		username: "",
		role: ROLES.cashier,
		password: "",
	};
}

export function useAccountForm({
	editingAccount,
	onCompleted,
}: UseAccountFormOptions) {
	const queryClient = useQueryClient();
	const createAccountMutation = useMutation(createAccountMutationOptions);
	const updateAccountMutation = useMutation(updateAccountMutationOptions);

	const form = useAppForm({
		defaultValues: getDefaultValues(editingAccount),
		validators: {
			onSubmit: AccountFormSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				if (value.mode === "edit") {
					await updateAccountMutation.mutateAsync({
						userId: value.userId,
						name: value.name,
						password: value.password || undefined,
					});

					toast.success(`Updated ${value.name}`);
				} else {
					const { mode, ...createInput } = value;

					await createAccountMutation.mutateAsync(createInput);
					toast.success(`Created ${createInput.name}'s account`);
				}

				await queryClient.invalidateQueries({
					queryKey: adminUsersKeys.accounts(),
				});
				form.reset();
				onCompleted();
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to save account",
				);
			}
		},
	});

	return {
		form,
		isEditing: Boolean(editingAccount),
		isPending:
			createAccountMutation.isPending || updateAccountMutation.isPending,
	};
}
