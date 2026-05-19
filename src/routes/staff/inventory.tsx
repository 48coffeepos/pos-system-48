import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { StaffHeader } from "@/features/staff/components/StaffHeader";
import { Package } from "@phosphor-icons/react";
import { getInventoryQueryOptions } from "@/features/admin/inventory/queryOptions";
import { InventoryList } from "@/features/admin/inventory/components/InventoryList";

export const Route = createFileRoute("/staff/inventory")({
	component: StaffInventory,
});

function StaffInventory() {
	const { data: inventory, isLoading, error } = useQuery(getInventoryQueryOptions);

	if (error) {
		console.error("Failed to fetch inventory:", error);
	}

	return (
		<div className="min-h-screen" style={{ background: "var(--warm-beige)" }}>
			<StaffHeader />
			<main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in-up">
				<div className="mb-8 flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-(--deep-forest)">
						<Package weight="fill" className="size-5 text-(--pale-yellow)" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-(--deep-forest)">
							Inventory Tracking
						</h1>
						<p className="mt-0.5 text-sm text-(--medium-gray)">
							Monitor stock levels and cup supplies in real-time.
						</p>
					</div>
				</div>

				{isLoading ? (
					<div className="flex h-64 items-center justify-center rounded-2xl border border-(--light-gray) bg-(--pure-white)">
						<div className="flex flex-col items-center gap-3">
							<div className="size-8 animate-spin rounded-full border-4 border-(--deep-forest) border-t-transparent"></div>
							<p className="text-sm font-medium text-(--medium-gray)">
								Loading inventory items...
							</p>
						</div>
					</div>
				) : !inventory || inventory.length === 0 ? (
					<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-12 text-center shadow-sm">
						<Package className="mx-auto size-16 text-(--medium-gray)/30" />
						<h2 className="mt-4 text-lg font-bold text-(--deep-forest)">
							No inventory items found
						</h2>
						<p className="mt-1 text-sm text-(--medium-gray)">
							Seeded data is missing. Please run the seeder script.
						</p>
					</div>
				) : (
					<InventoryList items={inventory as any} />
				)}
			</main>
		</div>
	);
}
