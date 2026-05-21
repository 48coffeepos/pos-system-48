import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { PaymentMethodFilter } from "../constants";
import { exportCupsSalesXlsx, exportRevenueXlsx } from "../exportDashboard";
import { getDashboardDataQueryOptions } from "../queryOptions";
import { CupSalesBreakdown } from "./CupSalesBreakdown";
import { RevenueCard } from "./RevenueCard";

export function AdminDashboardScreen() {
	const { data } = useSuspenseQuery(getDashboardDataQueryOptions);
	const [selectedPayment, setSelectedPayment] =
		useState<PaymentMethodFilter>("all");
	const [showExportModal, setShowExportModal] = useState(false);

	const { revenue, cupSales, periodLabel } = data;

	const handleExportCups = async () => {
		try {
			await exportCupsSalesXlsx(cupSales);
			setShowExportModal(false);
		} catch (error) {
			console.error(error);
			alert("Failed to export cups report.");
		}
	};

	const handleExportRevenue = async () => {
		try {
			await exportRevenueXlsx(revenue.byMethod);
			setShowExportModal(false);
		} catch (error) {
			console.error(error);
			alert("Failed to export revenue report.");
		}
	};

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
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
					onClick={() => setShowExportModal(false)}
				>
					<div
						className="card-white p-6 w-full max-w-sm mx-4"
						onClick={(event) => event.stopPropagation()}
					>
						<h3 className="text-sm font-bold mb-4 text-(--near-black)">
							Export Reports
						</h3>
						<p className="text-xs mb-4 text-(--medium-gray)">
							Download separate XLSX files for cups sold and revenue.
						</p>
						<div className="space-y-2">
							<button
								type="button"
								onClick={handleExportCups}
								className="w-full px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-(--deep-forest) text-white"
							>
								Export Cups XLSX
							</button>
							<button
								type="button"
								onClick={handleExportRevenue}
								className="w-full px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-(--off-white) text-(--dark-gray) border border-(--light-gray)"
							>
								Export Revenue XLSX
							</button>
						</div>
						<div className="mt-4 flex justify-end">
							<button
								type="button"
								onClick={() => setShowExportModal(false)}
								className="px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-transparent text-(--dark-gray)"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
