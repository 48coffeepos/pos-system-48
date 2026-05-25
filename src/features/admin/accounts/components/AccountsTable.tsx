import { UsersIcon } from "@phosphor-icons/react";
import { DataTable } from "@/components/ui/data-table";
import type { AdminAccount } from "@/features/admin/accounts/types";
import { getAccountsTableColumns } from "./AccountsTableColumns";

interface AccountsTableProps {
	accounts: AdminAccount[];
	currentUserId?: string;
	isRemovingUser: boolean;
	onEdit: (account: AdminAccount) => void;
	onRequestDelete: (account: AdminAccount) => void;
}

export function AccountsTable({
	accounts,
	currentUserId,
	isRemovingUser,
	onEdit,
	onRequestDelete,
}: AccountsTableProps) {
	const columns = getAccountsTableColumns({
		currentUserId,
		isRemovingUser,
		onEdit,
		onRequestDelete,
	});

	return (
		<section className="lg:col-span-2">
			<div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 shadow-xs">
				<div className="flex items-center justify-between gap-4">
					<div className="flex flex-col gap-1">
						<h2 className="text-lg font-semibold">Accounts</h2>
						<p className="text-sm text-muted-foreground">
							Manage staff and administrator access.
						</p>
					</div>
					<div className="inline-flex items-center gap-2 rounded-md border bg-muted px-3 py-2 text-sm font-medium text-muted-foreground">
						<UsersIcon />
						<span>{accounts.length} total</span>
					</div>
				</div>

				<DataTable columns={columns} data={accounts} />
			</div>
		</section>
	);
}
