import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { StaffHeader } from "@/features/staff/components/StaffHeader";
import { ClipboardText, Receipt } from "@phosphor-icons/react";
import { getOrdersQueryOptions } from "@/features/staff/orders/queryOptions";
import { OrdersList } from "@/features/staff/orders/components/OrdersList";

export const Route = createFileRoute("/staff/orders")({
	component: StaffOrders,
});

function StaffOrders() {
	const { data: orders, isLoading, error } = useQuery(getOrdersQueryOptions);

	if (error) {
		console.error("Failed to fetch orders:", error);
	}

	return (
		<div className="min-h-screen" style={{ background: "var(--warm-beige)" }}>
			<StaffHeader />
			<main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8 flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-(--deep-forest)">
						<ClipboardText
							weight="fill"
							className="size-5 text-(--pale-yellow)"
						/>
					</div>
					<div>
						<h1 className="text-2xl font-bold text-(--deep-forest)">
							Orders
						</h1>
						<p className="mt-0.5 text-sm text-(--medium-gray)">
							View and manage customer orders.
						</p>
					</div>
				</div>

				{isLoading ? (
					<div className="flex h-64 items-center justify-center rounded-2xl border border-(--light-gray) bg-(--pure-white)">
						<div className="flex flex-col items-center gap-3">
							<div className="size-8 animate-spin rounded-full border-4 border-(--deep-forest) border-t-transparent"></div>
							<p className="text-sm font-medium text-(--medium-gray)">
								Loading orders...
							</p>
						</div>
					</div>
				) : !orders || orders.length === 0 ? (
					<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-12 text-center shadow-sm">
						<Receipt className="mx-auto size-16 text-(--medium-gray)/30 animate-pulse" />
						<h2 className="mt-4 text-lg font-bold text-(--deep-forest)">
							No orders yet
						</h2>
						<p className="mt-1 text-sm text-(--medium-gray)">
							Place an order in the POS screen to get started.
						</p>
					</div>
				) : (
					<OrdersList orders={orders as any} />
				)}
			</main>
		</div>
	);
}
