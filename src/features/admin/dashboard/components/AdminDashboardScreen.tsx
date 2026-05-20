import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { PaymentMethodFilter } from "../constants";
import { getDashboardDataQueryOptions } from "../queryOptions";
import { formatPeso } from "../utils";
import { CupSalesBreakdown } from "./CupSalesBreakdown";
import { RevenueCard } from "./RevenueCard";

export function AdminDashboardScreen() {
	const { data } = useSuspenseQuery(getDashboardDataQueryOptions);
	const [selectedPayment, setSelectedPayment] =
		useState<PaymentMethodFilter>("all");
	const [showExportModal, setShowExportModal] = useState(false);

	const { revenue, cupSales, periodLabel } = data;

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
				onExportClick={() => setShowExportModal(true)}
			/>

			<CupSalesBreakdown
				cupSales={cupSales}
				selectedPayment={selectedPayment}
			/>

			{showExportModal && (
				<button
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
					onClick={() => setShowExportModal(false)}
				>
					<div className="card-white p-6 w-full max-w-sm mx-4">
						<h3 className="text-sm font-bold mb-4 text-(--near-black)">
							Export Options
						</h3>
						<p className="text-xs mb-4 text-(--medium-gray)">
							This is a preview. Export backend will be wired up soon.
						</p>
						<div className="flex gap-2 justify-end">
							<button
								type="button"
								onClick={() => setShowExportModal(false)}
								className="px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-(--off-white) text-(--dark-gray) border border-(--light-gray)"
							>
								Close
							</button>
							<button
								type="button"
								onClick={() => {
									alert(
										`Export triggered!\nRevenue: ${formatPeso(revenue.total)}\nOrders: ${revenue.totalOrders}`,
									);
									setShowExportModal(false);
								}}
								className="px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-(--deep-forest) text-white"
							>
								Export CSV
							</button>
						</div>
					</div>
				</button>
			)}
		</div>
	);
}
