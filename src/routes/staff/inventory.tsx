import { useQuery } from "@tanstack/react-query";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Tab } from "@/features/admin/inventory/components/InventoryList";
import { InventoryList } from "@/features/admin/inventory/components/InventoryList";
import {
	getAllInventoryQueryOptions,
	getInventoryLogsQueryOptions,
} from "@/features/admin/inventory/queryOptions";
import { RoutePendingBoundary } from "@/components/route-boundaries";

export const Route = createFileRoute("/staff/inventory")({
	loader: async ({ context: { queryClient } }) => {
		await Promise.all([
			queryClient.ensureQueryData(getAllInventoryQueryOptions),
			queryClient.ensureQueryData(getInventoryLogsQueryOptions),
		]);
	},
	pendingComponent: RoutePendingBoundary,
	component: StaffInventory,
});

function StaffInventory() {
	const { data: inventoryItems, isLoading, isError, error, refetch } = useQuery(
		getAllInventoryQueryOptions,
	);
	const { data: inventoryLogs } = useQuery(getInventoryLogsQueryOptions);
	const [activeTab, setActiveTab] = useState<Tab>("storefront");

	if (isError) {
		return (
			<div className="min-h-screen">
				<main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-12">
						<div className="flex flex-col items-center justify-center gap-4 text-center">
							<WarningCircleIcon weight="fill" className="size-10 text-(--error)" />
							<div>
								<p className="text-base font-semibold text-(--deep-forest)">Failed to load inventory</p>
								<p className="mt-1 text-sm text-(--medium-gray)">
									{error?.message ?? "Something went wrong"}
								</p>
							</div>
							<Button onClick={() => refetch()} variant="outline" size="sm">
								Retry
							</Button>
						</div>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen" style={{ background: "var(--warm-beige)" }}>
			<main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
				{isLoading ? (
					<div className="flex items-center justify-center py-24">
						<span className="h-5 w-5 animate-spin rounded-full border-2 border-(--deep-forest) border-t-transparent" />
					</div>
				) : (
					<InventoryList
						items={inventoryItems ?? []}
						inventoryLogs={inventoryLogs ?? []}
						allowedTabs={["storefront", "logs"]}
						logsLocationFilter="STOREFRONT"
						actions="stock"
						activeTab={activeTab}
						onTabChange={setActiveTab}
						showFinancialColumns={false}
					/>
				)}
			</main>
		</div>
	);
}
