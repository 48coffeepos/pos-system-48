import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { removeAccountMutationOptions } from "@/features/admin/accounts/mutationOptions";
import type { AdminAccount } from "@/features/admin/accounts/types";
import { sessionQueryOptions } from "@/features/auth/queryOptions";
import { AccountDeleteDialog } from "./AccountDeleteDialog";
import { AccountForm } from "./AccountForm";
import { AccountsTable } from "./AccountsTable";

interface AccountsManagerProps {
	users: AdminAccount[];
}

export function AccountsManager({ users }: AccountsManagerProps) {
	const { data: session } = useQuery(sessionQueryOptions);
	const currentUserId = session?.user?.id;
	const [editingAccount, setEditingAccount] = useState<AdminAccount | null>(
		null,
	);
	const [accountPendingDelete, setAccountPendingDelete] =
		useState<AdminAccount | null>(null);
	const removeMutation = useMutation(removeAccountMutationOptions);

	const handleDelete = async () => {
		if (!accountPendingDelete) {
			return;
		}

		try {
			await removeMutation.mutateAsync(accountPendingDelete.id);
			toast.success(`Deleted ${accountPendingDelete.name}'s account`);
			if (editingAccount?.id === accountPendingDelete.id) {
				setEditingAccount(null);
			}
			setAccountPendingDelete(null);
		} catch (error) {
			toast.error(
				(error as Error)?.message ?? "Failed to delete account",
			);
		}
	};

	return (
		<div>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<AccountsTable
					accounts={users}
					currentUserId={currentUserId}
					isRemovingUser={removeMutation.isPending}
					onEdit={setEditingAccount}
					onRequestDelete={setAccountPendingDelete}
				/>
				<AccountForm
					key={editingAccount?.id ?? "create-account"}
					editingAccount={editingAccount}
					onCancel={() => setEditingAccount(null)}
					onCompleted={() => setEditingAccount(null)}
				/>
			</div>
			<AccountDeleteDialog
				account={accountPendingDelete}
				open={Boolean(accountPendingDelete)}
				isPending={removeMutation.isPending}
				onOpenChange={(open) => {
					if (!open) {
						setAccountPendingDelete(null);
					}
				}}
				onConfirm={() => {
					void handleDelete();
				}}
			/>
		</div>
	);
}
