import { CurrencyDollar, Receipt } from "@phosphor-icons/react";
import { type DashboardStats } from "../data/mockData";
import { formatPeso } from "../utils";

interface StatsSummaryProps {
	stats: DashboardStats | null;
	totalExpenseAmount: number;
}

export function StatsSummary({ stats, totalExpenseAmount }: StatsSummaryProps) {
	return (
		<div className="card-white p-5 flex flex-col gap-3">
			<div className="flex items-center gap-3 p-3 rounded-2xl bg-(--off-white)">
				<div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(212,165,116,0.15)]">
					<CurrencyDollar className="w-5 h-5 text-[#D4A574]" />
				</div>
				<div>
					<p className="text-xs text-(--medium-gray)">All-time revenue</p>
					<p className="text-lg font-bold text-(--near-black)">
						{stats ? formatPeso(stats.total_revenue) : formatPeso(0)}
					</p>
					<p className="text-[10px] text-(--medium-gray)">
						Unfiltered total
					</p>
				</div>
			</div>
			<div className="flex items-center gap-3 p-3 rounded-2xl bg-(--off-white)">
				<div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(167,105,69,0.1)]">
					<Receipt className="w-5 h-5 text-(--coral)" />
				</div>
				<div>
					<p className="text-xs text-(--medium-gray)">Total Expenses</p>
					<p className="text-lg font-bold text-(--near-black)">
						{formatPeso(totalExpenseAmount)}
					</p>
					<p className="text-[10px] text-(--medium-gray)">
						All logged costs
					</p>
				</div>
			</div>
		</div>
	);
}
