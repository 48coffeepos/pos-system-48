import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { UserTable } from "@/features/admin/components/UserTable";
import { adminUsersQueryOptions } from "@/features/admin/queryOptions";

export const Route = createFileRoute("/admin/users")({
	loader: async ({ context }) => {
		await context.queryClient.prefetchQuery(adminUsersQueryOptions);
	},
	component: AdminUsersPage,
});

function AdminUsersPage() {
	const { data } = useSuspenseQuery(adminUsersQueryOptions);

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">User Management</h1>
			<UserTable users={data ?? []} />
		</div>
	);
}
