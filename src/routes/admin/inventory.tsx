import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import type { InventoryItem } from "@/features/admin/inventory/components/AddInventoryItem";
import { AddInventoryItem } from "@/features/admin/inventory/components/AddInventoryItem";
import { InventoryList } from "@/features/admin/inventory/components/InventoryList";
import { getAllInventoryQueryOptions } from "@/features/admin/inventory/queryOptions";

export const Route = createFileRoute("/admin/inventory")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(getAllInventoryQueryOptions);
	},
	component: AdminInventory,
});

function AdminInventory() {
	const { data: inventoryItems } = useSuspenseQuery(
		getAllInventoryQueryOptions,
	);
	const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

	return (
		<div className="min-h-screen">
			{/* Content Grid */}
			<div className="grid gap-8 lg:grid-cols-[1fr_400px]">
				{/* Inventory List Area */}
				<div>
					<InventoryList items={inventoryItems} onEdit={setEditingItem} />
				</div>

				{/* Add Inventory Card */}
				<div className="lg:sticky lg:top-24 lg:self-start">
					<AddInventoryItem
						items={inventoryItems}
						editingItem={editingItem}
						onCancelEdit={() => setEditingItem(null)}
					/>
				</div>
			</div>
		</div>
	);
}
