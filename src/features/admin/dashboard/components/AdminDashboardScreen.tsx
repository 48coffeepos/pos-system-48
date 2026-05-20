import { useState } from "react";
import { mockCupSales, mockExpenses, mockStats } from "../data/mockData";
import { formatPeso } from "../utils";
import { CupSalesBreakdown } from "./CupSalesBreakdown";
import { RevenueCard } from "./RevenueCard";
import { StatsSummary } from "./StatsSummary";

export function AdminDashboardScreen() {
	const [showExportModal, setShowExportModal] = useState(false);

	// Mock computed values
	const revenue = 45680.5;
	const orderCount = 312;
	const periodSubtitle = "May 1 — May 19, 2024";
	const totalExpenseAmount = mockExpenses.reduce((sum, e) => sum + e.amount, 0);

	return (
		<div className="p-6">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
				<RevenueCard
					revenue={revenue}
					orderCount={orderCount}
					periodSubtitle={periodSubtitle}
					onExportClick={() => setShowExportModal(true)}
				/>
				<StatsSummary
					stats={mockStats}
					totalExpenseAmount={totalExpenseAmount}
				/>
			</div>

			<CupSalesBreakdown
				cupSales={mockCupSales}
				onPrintClick={() => setShowExportModal(true)}
			/>

			{showExportModal && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
					onClick={() => setShowExportModal(false)}
				>
					<div
						className="card-white p-6 w-full max-w-sm mx-4"
						onClick={(e) => e.stopPropagation()}
					>
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
										`Export triggered!\nRevenue: ${formatPeso(revenue)}\nOrders: ${orderCount}`,
									);
									setShowExportModal(false);
								}}
								className="px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-(--deep-forest) text-white"
							>
								Export CSV
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
