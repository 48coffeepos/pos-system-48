import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/generated/prisma/browser";
export function getUserTableColumns({
	onToggleRole,
}: {
	onToggleRole: (user: User) => void;
}): ColumnDef<User>[] {
	return [
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "email",
			header: "Email",
		},
		{
			accessorKey: "username",
			header: "Username",
			cell: ({ getValue }) => getValue<string>() || "-",
		},
		{
			accessorKey: "role",
			header: "Role",
		},
		{
			accessorKey: "banned",
			header: "Status",
			cell: ({ getValue }) => (getValue() ? "Banned" : "Active"),
		},
		{
			id: "actions",
			header: "Actions",
			cell: function ActionsCell({ row }) {
				const user = row.original;

				return (
					<button
						type="button"
						className="rounded-md border px-3 py-1 text-sm transition hover:bg-muted"
						onClick={() => onToggleRole(user)}
					>
						{user.role === "admin" ? "Demote to User" : "Promote to Admin"}
					</button>
				);
			},
		},
	];
}
