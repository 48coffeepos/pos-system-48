import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { sessionQueryOptions } from "@/features/auth/queryOptions";
import type { PaymentMethodFilter } from "../constants";
import { getDashboardDataQueryOptions } from "../queryOptions";
import { CupSalesBreakdown } from "./CupSalesBreakdown";
import { DashboardReceiptDialog } from "./DashboardReceiptDialog";
import { RevenueCard } from "./RevenueCard";

export function AdminDashboardScreen() {
	const { data } = useSuspenseQuery(getDashboardDataQueryOptions);
	const { data: session } = useSuspenseQuery(sessionQueryOptions);
	const [selectedPayment, setSelectedPayment] =
		useState<PaymentMethodFilter>("all");
	const [receiptMode, setReceiptMode] = useState<
		"select" | "cups" | "revenue" | null
	>(null);

	const { revenue, cupSales, periodLabel } = data;
	const staffName = session?.user?.name ?? "Admin";

	return (
		<div className="space-y-5">
			<RevenueCard
				revenueByMethod={revenue.byMethod}
				ordersByMethod={revenue.ordersByMethod}
				totalRevenue={revenue.total}
				totalOrders={revenue.totalOrders}
				selectedPayment={selectedPayment}
				onPaymentChange={setSelectedPayment}
				periodLabel={periodLabel}
				onExportClick={() => setReceiptMode("select")}
			/>

			<CupSalesBreakdown
				cupSales={cupSales}
				selectedPayment={selectedPayment}
			/>

			{receiptMode === "select" && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
					onClick={() => setReceiptMode(null)}
				>
					<div
						className="card-white p-6 w-full max-w-sm mx-4"
						onClick={(event) => event.stopPropagation()}
					>
						<h3 className="text-sm font-bold mb-4 text-(--near-black)">
							Print Receipt
						</h3>
						<p className="text-xs mb-4 text-(--medium-gray)">
							Print a thermal receipt for today&apos;s data.
						</p>
						<div className="space-y-2">
							<button
								type="button"
								onClick={() => setReceiptMode("cups")}
								className="w-full px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-(--deep-forest) text-white"
							>
								Cups Sales Receipt
							</button>
							<button
								type="button"
								onClick={() => setReceiptMode("revenue")}
								className="w-full px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-(--off-white) text-(--dark-gray) border border-(--light-gray)"
							>
								Revenue Receipt
							</button>
						</div>
						<div className="mt-4 flex justify-end">
							<button
								type="button"
								onClick={() => setReceiptMode(null)}
								className="px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-transparent text-(--dark-gray)"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			<DashboardReceiptDialog
				open={receiptMode === "cups" || receiptMode === "revenue"}
				onClose={() => setReceiptMode(null)}
				mode={receiptMode === "select" ? null : receiptMode}
				staffName={staffName}
				periodLabel={periodLabel}
				cupSales={cupSales}
				revenueByMethod={revenue.byMethod}
			/>
		</div>
	);
}
