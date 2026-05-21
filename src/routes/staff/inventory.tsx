import { PackageIcon } from "@phosphor-icons/react";
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
			{inventoryItems.length === 0 ? (
				<div className="flex h-64 items-center justify-center">
					<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-12 text-center shadow-sm">
						<PackageIcon className="mx-auto size-16 text-(--medium-gray)/30" />
						<h2 className="mt-4 text-lg font-bold text-(--deep-forest)">
							No inventory items found
						</h2>
						<p className="mt-1 text-sm text-(--medium-gray)">
							Seeded data is missing. Please run the seeder script.
						</p>
					</div>
				</div>
			) : (
				<InventoryList items={inventoryItems} />
			)}
		</div>
	);
}
