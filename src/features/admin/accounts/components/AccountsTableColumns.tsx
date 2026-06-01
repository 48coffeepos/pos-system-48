import {
	CircleIcon,
	EnvelopeIcon,
	PencilSimpleIcon,
	ShieldCheckIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { AdminAccount } from "@/features/admin/accounts/types";
import { ROLES } from "@/features/auth/roles";

interface AccountsTableColumnsOptions {
	currentUserId?: string;
	isRemovingUser: boolean;
	onEdit: (account: AdminAccount) => void;
	onRequestDelete: (account: AdminAccount) => void;
}

function formatLastSeen(lastSeenAt: Date | null) {
	if (!lastSeenAt) {
		return "No active sessions yet";
	}

	return `Last seen ${new Intl.DateTimeFormat("en-PH", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(new Date(lastSeenAt))}`;
}

function getRoleLabel(role: string | null) {
	return role === ROLES.admin ? "Administrator" : "Staff";
}

export function getAccountsTableColumns({
	currentUserId,
	isRemovingUser,
	onEdit,
	onRequestDelete,
}: AccountsTableColumnsOptions): ColumnDef<AdminAccount>[] {
	return [
		{
			accessorKey: "name",
			header: "User",
			cell: ({ row }) => {
				const account = row.original;

				return (
					<div className="flex items-center gap-3">
						<div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
							{account.name.charAt(0).toUpperCase()}
						</div>
						<div className="flex min-w-0 flex-col gap-1">
							<div className="truncate font-medium">{account.name}</div>
							<div className="flex items-center gap-1 text-xs text-muted-foreground">
								<EnvelopeIcon />
								<span className="truncate">{account.email}</span>
							</div>
							<div className="text-xs text-muted-foreground">
								@{account.username ?? "no-username"}
							</div>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "role",
			header: "Role",
			meta: { className: "w-[1%] whitespace-nowrap" },
			cell: ({ row }) => (
				<div className="inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium text-muted-foreground">
					<ShieldCheckIcon />
					<span>{getRoleLabel(row.original.role)}</span>
				</div>
			),
		},
		{
			accessorKey: "isOnline",
			header: "Status",
			meta: { className: "w-[1%] whitespace-nowrap" },
			cell: ({ row }) => {
				const account = row.original;

				return (
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2 text-sm font-medium">
							<CircleIcon
								weight="fill"
								className={
									account.isOnline
										? "text-emerald-500"
										: "text-muted-foreground"
								}
							/>
							<span>{account.isOnline ? "Online" : "Offline"}</span>
						</div>
						<div className="text-xs text-muted-foreground">
							{formatLastSeen(account.lastSeenAt)}
						</div>
					</div>
				);
			},
		},
		{
			id: "actions",
			header: () => <div className="text-right">Actions</div>,
			meta: { className: "w-[1%] whitespace-nowrap" },
			cell: ({ row }) => {
				const account = row.original;
				const isSelf = account.id === currentUserId;

				return (
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={() => onEdit(account)}
							aria-label={`Edit ${account.name}`}
						>
							<PencilSimpleIcon />
						</Button>
						<Button
							type="button"
							variant="destructive"
							size="icon-sm"
							onClick={() => onRequestDelete(account)}
							disabled={isSelf || isRemovingUser}
							aria-label={`Delete ${account.name}`}
						>
							<TrashIcon />
						</Button>
					</div>
				);
			},
		},
	];
}
