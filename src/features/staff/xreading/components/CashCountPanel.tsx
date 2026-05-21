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
		<div className="flex flex-col rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 shadow-sm">
			<h2 className="mb-4 text-lg font-semibold text-(--deep-forest)">
				Cash Count
			</h2>
			<p className="mb-6 text-sm text-(--medium-gray)">
				Count physical cash in register
			</p>

			<div className="flex-1 space-y-4">
				{denominations.map((denom) => (
					<div
						key={denom}
						className="flex items-center gap-4 rounded-xl border border-(--light-gray)/50 bg-gray-50/50 p-3"
					>
						<div className="flex w-24 items-center justify-center rounded-lg bg-(--deep-forest) py-2 font-mono font-medium text-(--pale-yellow)">
							₱{denom}
						</div>
						<div className="flex flex-1 items-center gap-2">
							<span className="text-sm font-medium text-(--medium-gray)">
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
										className="w-20 rounded-lg border border-(--light-gray) bg-white px-3 py-1.5 text-center font-medium focus:border-(--forest-green) focus:outline-none focus:ring-1 focus:ring-(--forest-green)"
									/>
								)}
							</form.AppField>
						</div>
						<div className="flex w-32 flex-col items-end">
							<span className="text-xs text-(--medium-gray)">Total</span>
							<form.Subscribe
								selector={(state: any) =>
									(state.values[denom as keyof CashCountValues] || 0) * denom
								}
							>
								{(total: number) => (
									<span className="font-mono font-medium text-(--deep-forest)">
										₱{total.toFixed(2)}
									</span>
								)}
							</form.Subscribe>
						</div>
					</div>
				))}
			</div>

			<div className="mt-8 flex flex-col gap-4">
				<div className="flex items-center justify-between rounded-xl bg-(--deep-forest) p-6 text-white">
					<span className="text-lg font-medium">Total Cash Counted</span>
					<span className="font-mono text-2xl font-bold text-(--pale-yellow)">
						₱{totalCashCounted.toFixed(2)}
					</span>
				</div>
				<button
					type="button"
					onClick={onResetClick}
					className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-4 font-bold text-red-700 transition-colors hover:bg-red-100"
				>
					Reset Cash Count
				</button>
			</div>
		</div>
	);
}
