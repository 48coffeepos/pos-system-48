import { useQuery } from "@tanstack/react-query";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import type { InventoryItem } from "@/features/admin/inventory/components/AddInventoryItem";
import { AddInventoryItem } from "@/features/admin/inventory/components/AddInventoryItem";
import { InventoryList } from "@/features/admin/inventory/components/InventoryList";
import { getAllInventoryQueryOptions } from "@/features/admin/inventory/queryOptions";
import {
  RouteErrorBoundary,
  RoutePendingBoundary,
} from "@/components/route-boundaries";

export const Route = createFileRoute("/admin/inventory")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(getAllInventoryQueryOptions);
	},
	pendingComponent: RoutePendingBoundary,
	errorComponent: RouteErrorBoundary,
	component: AdminInventory,
});

function AdminInventory() {
	const { data: inventoryItems, isLoading, isError, error, refetch } = useQuery(
		getAllInventoryQueryOptions,
	);
	const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

	return (
		<div className="min-h-screen">
			<div className="grid gap-8 lg:grid-cols-[1fr_400px]">
				<div>
					{isError ? (
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
					) : isLoading ? (
						<div className="flex items-center justify-center py-24">
							<span className="h-5 w-5 animate-spin rounded-full border-2 border-(--deep-forest) border-t-transparent" />
						</div>
					) : (
						<InventoryList items={inventoryItems ?? []} onEdit={setEditingItem} />
					)}
				</div>

				<div className="lg:sticky lg:top-24 lg:self-start">
					<AddInventoryItem
						items={inventoryItems ?? []}
						editingItem={editingItem}
						onCancelEdit={() => setEditingItem(null)}
					/>
				</div>
			</div>
		</div>
	);
}
