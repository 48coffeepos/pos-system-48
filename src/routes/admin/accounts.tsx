import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AccountsManager } from "@/features/admin/components/accounts/AccountsManager";
import { adminAccountsQueryOptions } from "@/features/admin/queryOptions";

export const Route = createFileRoute("/admin/accounts")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(adminAccountsQueryOptions);
	},
	component: AdminUsersPage,
});

function AdminUsersPage() {
	const { data } = useSuspenseQuery(adminAccountsQueryOptions);

	return (
		<div className="flex flex-col gap-4">
			<AccountsManager users={data} />
		</div>
	);
}
