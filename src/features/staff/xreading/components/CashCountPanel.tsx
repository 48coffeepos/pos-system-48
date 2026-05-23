import type { CashCountValues } from "../stores/useXReadingStore";
import { useXReadingStore } from "../stores/useXReadingStore";

export type Denomination = 1 | 5 | 10 | 20 | 50 | 100 | 200 | 500 | 1000;

interface CashCountPanelProps {
	form: any;
	totalCashCounted: number;
	onResetClick: () => void;
}

const denominations: Denomination[] = [
	1000, 500, 200, 100, 50, 20, 10, 5, 1
];

export function CashCountPanel({
	form,
	totalCashCounted,
	onResetClick,
}: CashCountPanelProps) {
	const setDenom = useXReadingStore((state) => state.setDenom);

	return (
		<div className="flex flex-col rounded-2xl border border-(--light-gray) bg-(--pure-white) p-4 shadow-sm">
			<h2 className="mb-4 text-base font-semibold text-(--deep-forest)">
				Cash Count
			</h2>

			<div className="flex-1 space-y-2">
				{denominations.map((denom) => (
					<div
						key={denom}
						className="flex items-center gap-3 rounded-xl border border-(--light-gray)/50 bg-gray-50/50 p-2"
					>
						<div className="flex w-20 items-center justify-center rounded-lg bg-(--deep-forest) py-1.5 font-mono text-sm font-medium text-(--pale-yellow)">
							₱{denom}
						</div>
						<div className="flex flex-1 items-center gap-1.5">
							<span className="text-xs font-medium text-(--medium-gray)">
								Qty
							</span>
							<form.AppField name={denom.toString() as any}>
								{(field: any) => (
									<input
										id={field.name}
										type="number"
										min="0"
										value={field.state.value === 0 ? "" : field.state.value}
										onChange={(e) => {
											if (e.target.value === "") {
												field.handleChange(0);
												setDenom(denom, 0);
												return;
											}
											const val = parseInt(e.target.value, 10);
											const qty = isNaN(val) || val < 0 ? 0 : val;
											field.handleChange(qty);
											setDenom(denom, qty);
										}}
										className="w-16 rounded-lg border border-(--light-gray) bg-white px-2 py-1 text-center text-sm font-medium focus:border-(--forest-green) focus:outline-none focus:ring-1 focus:ring-(--forest-green)"
									/>
								)}
							</form.AppField>
						</div>
						<div className="flex w-28 flex-col items-end">
							<span className="text-[10px] text-(--medium-gray)">Total</span>
							<form.Subscribe
								selector={(state: any) =>
									(state.values[denom as keyof CashCountValues] || 0) * denom
								}
							>
								{(total: number) => (
									<span className="font-mono text-xs font-medium text-(--deep-forest)">
										₱{total.toFixed(2)}
									</span>
								)}
							</form.Subscribe>
						</div>
					</div>
				))}
			</div>

			<div className="mt-6 flex flex-col gap-3">
				<div className="flex items-center justify-between rounded-xl bg-(--deep-forest) p-4 text-white">
					<span className="text-sm font-medium">Total Cash Counted</span>
					<span className="font-mono text-xl font-bold text-(--pale-yellow)">
						₱{totalCashCounted.toFixed(2)}
					</span>
				</div>
				<button
					type="button"
					onClick={onResetClick}
					className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition-colors hover:bg-red-100"
				>
					Reset Cash Count
				</button>
			</div>
		</div>
	);
}
