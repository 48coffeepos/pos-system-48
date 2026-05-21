import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-form";
import { Package } from "@phosphor-icons/react";
import { useAppForm } from "@/integrations/tanstack-form";
import { getAllInventoryQueryOptions } from "@/features/admin/inventory/queryOptions";
import { InventoryList } from "@/features/admin/inventory/components/InventoryList";
import { StaffHeader } from "@/features/staff/components/StaffHeader";
import { StaffFilterSearchField } from "@/features/staff/components/StaffFilterSearchField";
import { StaffTimeframeField } from "@/features/staff/components/StaffTimeframeField";
import {
	defaultInventoryFilterValues,
	inventoryFilterSchema,
} from "@/features/staff/schemas/inventoryFilter";

export function StaffInventoryScreen() {
	const { data: inventory, isLoading, error } = useQuery(
		getAllInventoryQueryOptions,
	);

	const filterForm = useAppForm({
		defaultValues: defaultInventoryFilterValues(),
		validators: {
			onChange: inventoryFilterSchema,
		},
	});

	const filterValues = useStore(filterForm.store, (state) => state.values);
	const timeframe = filterValues.timeframe ?? "today";
	const search = filterValues.search ?? "";

	const filteredItems = useMemo(() => {
		const items = inventory ?? [];
		const query = search.trim().toLowerCase();
		if (!query) return items;
		return items.filter((item) =>
			item.name.toLowerCase().includes(query),
		);
	}, [inventory, search]);

	if (error) {
		console.error("Failed to fetch inventory:", error);
	}

	return (
		<div className="min-h-screen" style={{ background: "var(--warm-beige)" }}>
			<StaffHeader />
			<main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in-up">
				{isLoading ? (
					<div className="flex h-64 items-center justify-center rounded-2xl border border-(--light-gray) bg-(--pure-white)">
						<div className="flex flex-col items-center gap-3">
							<div className="size-8 animate-spin rounded-full border-4 border-(--deep-forest) border-t-transparent" />
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
					<filterForm.AppForm>
						<div className="mb-6 flex flex-wrap items-center justify-end gap-3">
							<filterForm.AppField name="search">
								{() => (
									<StaffFilterSearchField placeholder="Search inventory..." />
								)}
							</filterForm.AppField>
							<filterForm.AppField name="timeframe">
								{() => <StaffTimeframeField />}
							</filterForm.AppField>
						</div>
						<InventoryList
							items={filteredItems as never[]}
							hideActions
							timeframe={timeframe}
						/>
					</filterForm.AppForm>
				)}
			</main>
		</div>
	);
}
