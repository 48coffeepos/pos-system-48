"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { ROLES } from "@/features/auth/roles";
import type { User } from "@/generated/prisma/browser";
import adminUsersKeys from "../keys";
import { setRoleMutationOptions } from "../mutationOptions";
import { getUserTableColumns } from "./UserTableColumns";

interface UserTableProps {
	users: User[];
}

function UserTable({ users }: UserTableProps) {
	const queryClient = useQueryClient();
	const roleMutation = useMutation(setRoleMutationOptions);

	const handleToggleRole = async (user: User) => {
		const newRole = user.role === ROLES.admin ? ROLES.cashier : ROLES.admin;
		await roleMutation.mutateAsync({ userId: user.id, role: newRole });
		queryClient.invalidateQueries({ queryKey: adminUsersKeys.all });
	};

	const columns = getUserTableColumns({ onToggleRole: handleToggleRole });

	return <DataTable columns={columns} data={users} />;
}

export { UserTable };
