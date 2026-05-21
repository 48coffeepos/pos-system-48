import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-form";
import { useAppForm } from "@/integrations/tanstack-form";
import { StaffHeader } from "@/features/staff/components/StaffHeader";
import { getOrdersQueryOptions } from "@/features/staff/orders/queryOptions";
import {
	defaultOrdersFilterValues,
	ordersFilterSchema,
} from "@/features/staff/schemas/ordersFilter";
import { OrdersList } from "./OrdersList";

export function OrdersScreen() {
	const { data: orders, isLoading, error } = useQuery(getOrdersQueryOptions);

	const filterForm = useAppForm({
		defaultValues: defaultOrdersFilterValues(),
		validators: {
			onChange: ordersFilterSchema,
		},
	});

	const filterValues = useStore(filterForm.store, (state) => state.values);

	if (error) {
		console.error("Failed to fetch orders:", error);
	}

	return (
		<div className="min-h-screen" style={{ background: "var(--warm-beige)" }}>
			<StaffHeader />
			<main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
				{isLoading ? (
					<div className="flex h-64 items-center justify-center rounded-2xl border border-(--light-gray) bg-(--pure-white)">
						<div className="flex flex-col items-center gap-3">
							<div className="size-8 animate-spin rounded-full border-4 border-(--deep-forest) border-t-transparent" />
							<p className="text-sm font-medium text-(--medium-gray)">
								Loading orders...
							</p>
						</div>
					</div>
				) : (
					<filterForm.AppForm>
						<OrdersList
							orders={(orders ?? []) as never[]}
							filterForm={filterForm}
							timeframe={filterValues.timeframe ?? "today"}
						/>
					</filterForm.AppForm>
				)}
			</main>
		</div>
	);
}
