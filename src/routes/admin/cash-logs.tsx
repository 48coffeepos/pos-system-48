import { createFileRoute } from "@tanstack/react-router";
import { AdminExpensesTable } from "@/features/admin/cash-logs/components/AdminExpensesTable";
import { getAdminExpensesQueryOptions } from "@/features/admin/cash-logs/queryOptions";

export const Route = createFileRoute("/admin/cash-logs")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(
			getAdminExpensesQueryOptions("today"),
		);
	},
	component: AdminCashLogs,
});

function AdminCashLogs() {
	return (
		<div className="min-h-screen">
			<main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
				<AdminExpensesTable />
			</main>
		</div>
	);
}
