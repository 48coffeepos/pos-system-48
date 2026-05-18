import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppForm } from "@/integrations/tanstack-form";
import adminUsersKeys from "@/features/admin/keys";
import {
	createAccountMutationOptions,
	updateAccountMutationOptions,
} from "@/features/admin/mutationOptions";
import {
	AccountFormSchema,
	CreateAccountSchema,
	EditAccountFormSchema,
} from "@/features/admin/schemas/admin";
import type { AdminAccount } from "@/features/admin/types";
import { ROLES } from "@/features/auth/roles";
import { toast } from "sonner";

interface UseAccountFormOptions {
	editingAccount: AdminAccount | null;
	onCompleted: () => void;
}

function getDefaultValues(editingAccount: AdminAccount | null) {
	return {
		name: editingAccount?.name ?? "",
		email: editingAccount?.email ?? "",
		username: editingAccount?.username ?? "",
		role:
			editingAccount?.role === ROLES.admin ? ROLES.admin : ROLES.cashier,
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
			onSubmit: editingAccount ? EditAccountFormSchema : AccountFormSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				if (editingAccount) {
					const parsed = EditAccountFormSchema.parse({
						name: value.name,
						password: value.password,
					});

					await updateAccountMutation.mutateAsync({
						userId: editingAccount.id,
						name: parsed.name,
						password: parsed.password || undefined,
					});

					toast.success(`Updated ${editingAccount.name}`);
				} else {
					const parsed = CreateAccountSchema.parse(value);

					await createAccountMutation.mutateAsync(parsed);
					toast.success(`Created ${parsed.name}'s account`);
				}

				await queryClient.invalidateQueries({
					queryKey: adminUsersKeys.accounts(),
				});
				form.reset();
				onCompleted();
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "Failed to save account",
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
