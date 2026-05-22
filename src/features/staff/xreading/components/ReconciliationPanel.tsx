import { CheckCircle, Printer, WarningCircle } from "@phosphor-icons/react";
import { formatPeso } from "@/lib/format-currency";
import type { DailyReconciliationTotals } from "../utils/reconciliation";
import {
	formatReconciliationStatus,
	getOverShort,
} from "../utils/reconciliation";

interface ReconciliationPanelProps {
	totals: DailyReconciliationTotals;
	totalCashCounted: number;
	onExportSales: () => void;
	onExportCashCount: () => void;
}

function SummaryCard({
	label,
	value,
	valueClassName,
}: {
	label: string;
	value: string;
	valueClassName?: string;
}) {
	return (
		<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 shadow-sm">
			<h3 className="mb-1 text-sm font-medium text-(--medium-gray)">{label}</h3>
			<p
				className={`font-mono text-3xl font-bold ${valueClassName ?? "text-(--deep-forest)"}`}
			>
				{value}
			</p>
		</div>
	);
}

export function ReconciliationPanel({
	totals,
	totalCashCounted,
	onExportSales,
	onExportCashCount,
}: ReconciliationPanelProps) {
	const { overShort } = getOverShort(totalCashCounted, totals);
	const { isMatched, isOver } = formatReconciliationStatus(overShort);

	return (
		<div className="flex flex-col gap-6">
			<SummaryCard
				label="Total Cash In"
				value={formatPeso(totals.totalCashIn)}
			/>
			<SummaryCard
				label="Total Sales"
				value={formatPeso(totals.totalCashSales)}
			/>
			<SummaryCard
				label="Expenses"
				value={formatPeso(totals.totalCashOut)}
				valueClassName="text-(--coral)"
			/>

			<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 shadow-sm">
				<h3 className="mb-1 text-sm font-medium text-(--medium-gray)">
					Discrepancy
				</h3>
				<div className="flex items-center gap-3">
					<p
						className={`font-mono text-4xl font-bold ${
							isMatched
								? "text-(--forest-green)"
								: isOver
									? "text-(--forest-green)"
									: "text-(--coral)"
						}`}
					>
						{overShort > 0 ? "+" : ""}
						{formatPeso(overShort)}
					</p>
					{isMatched ? (
						<CheckCircle
							weight="fill"
							className="size-8 text-(--forest-green)"
						/>
					) : (
						<WarningCircle
							weight="fill"
							className={`size-8 ${isOver ? "text-(--forest-green)" : "text-(--coral)"}`}
						/>
					)}
				</div>
				<p className="mt-2 text-sm text-(--medium-gray)">
					{isMatched
						? "Cash count matches."
						: isOver
							? "Over — counted more than expected."
							: "Short — counted less than expected."}
				</p>
			</div>

			<div className="mt-auto grid grid-cols-2 gap-4">
				<button
					type="button"
					onClick={onExportSales}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--deep-forest) px-4 py-4 font-medium text-(--pale-yellow) transition-colors hover:bg-(--forest-green)"
				>
					<Printer weight="bold" className="size-5" />
					Print Sales X-Reading
				</button>
				<button
					type="button"
					onClick={onExportCashCount}
					className="flex w-full items-center justify-center gap-2 rounded-xl border border-(--deep-forest) px-4 py-4 font-medium text-(--deep-forest) transition-colors hover:bg-(--pale-yellow)"
				>
					<Printer weight="bold" className="size-5" />
					Print Cash Count
				</button>
			</div>
		</div>
	);
}
