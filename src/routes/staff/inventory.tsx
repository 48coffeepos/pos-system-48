import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { InventoryList } from "@/features/admin/inventory/components/InventoryList";
import { getAllInventoryQueryOptions } from "@/features/admin/inventory/queryOptions";

export const Route = createFileRoute("/staff/inventory")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(getAllInventoryQueryOptions);
	},
	component: StaffInventory,
});

function StaffInventory() {
	const { data: inventoryItems } = useSuspenseQuery(
		getAllInventoryQueryOptions,
	);

	return (
		<div className="min-h-screen">
			<main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
				<InventoryList items={inventoryItems} hideActions />
			</main>
		</div>
	);
}
