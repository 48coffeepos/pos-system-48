import { Printer, WarningCircle, CheckCircle } from "@phosphor-icons/react";
import { useXReadingStore } from "@/features/staff/xreading/stores/useXReadingStore";

interface ReconciliationPanelProps {
	totalCashCounted: number;
}

export function ReconciliationPanel({ totalCashCounted }: ReconciliationPanelProps) {
	const totalCashSales = useXReadingStore((state) => state.totalCashSales);
	const totalExpenses = useXReadingStore((state) => state.totalExpenses);
	const openSalesReceipt = useXReadingStore((state) => state.openSalesReceipt);
	const openCashCountReceipt = useXReadingStore(
		(state) => state.openCashCountReceipt,
	);

	const netSales = totalCashSales - totalExpenses;
	const discrepancy = totalCashCounted - netSales;

	const isMatched = Math.abs(discrepancy) < 0.01;
	const isOver = discrepancy > 0;

	return (
		<div className="flex flex-col gap-6">
			<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 shadow-sm">
				<h3 className="mb-1 text-sm font-medium text-(--medium-gray)">
					Total Cash Sales Today
				</h3>
				<p className="font-mono text-3xl font-bold text-(--deep-forest)">
					₱{totalCashSales.toFixed(2)}
				</p>
			</div>

			<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 shadow-sm">
				<h3 className="mb-1 text-sm font-medium text-(--medium-gray)">
					Expenses Today
				</h3>
				<p className="font-mono text-3xl font-bold text-red-600">
					₱{totalExpenses.toFixed(2)}
				</p>
			</div>

			<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 shadow-sm">
				<h3 className="mb-1 text-sm font-medium text-(--medium-gray)">
					OVER / SHORT
				</h3>
				<div className="flex items-center gap-3">
					<p
						className={`font-mono text-4xl font-bold ${
							isMatched
								? "text-green-600"
								: isOver
									? "text-blue-600"
									: "text-red-600"
						}`}
					>
						{discrepancy > 0 ? "+" : ""}
						₱{discrepancy.toFixed(2)}
					</p>
					{isMatched ? (
						<CheckCircle weight="fill" className="size-8 text-green-600" />
					) : (
						<WarningCircle
							weight="fill"
							className={`size-8 ${isOver ? "text-blue-600" : "text-red-600"}`}
						/>
					)}
				</div>
				<p className="mt-2 text-sm text-(--medium-gray)">
					{isMatched
						? "Cash count matches perfectly."
						: isOver
							? "You have more cash than expected."
							: "You are short on cash."}
				</p>
			</div>

			<div className="mt-auto grid grid-cols-2 gap-4">
				<button
					type="button"
					onClick={openSalesReceipt}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--deep-forest) px-4 py-4 font-medium text-(--pale-yellow) transition-colors hover:bg-(--deep-forest)/90"
				>
					<Printer weight="bold" className="size-5" />
					Print Sales X-Reading
				</button>
				<button
					type="button"
					onClick={openCashCountReceipt}
					className="flex w-full items-center justify-center gap-2 rounded-xl border border-(--deep-forest) px-4 py-4 font-medium text-(--deep-forest) transition-colors hover:bg-(--pale-yellow)"
				>
					<Printer weight="bold" className="size-5" />
					Print Cash Count
				</button>
			</div>
		</div>
	);
}
