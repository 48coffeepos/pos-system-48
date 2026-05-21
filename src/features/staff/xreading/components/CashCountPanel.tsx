import { ArrowCounterClockwise } from "@phosphor-icons/react";
import {
	CASH_COUNT_DENOMINATIONS,
	type CashCountDenomination,
} from "@/features/staff/xreading/schemas/cashCount";
import { useXReadingStore } from "@/features/staff/xreading/stores/useXReadingStore";
import { CashCountQtyField } from "./CashCountQtyField";

export type Denomination = CashCountDenomination;

interface CashCountPanelProps {
	form: any;
	totalCashCounted: number;
}

export function CashCountPanel({
	form,
	totalCashCounted,
}: CashCountPanelProps) {
	const requestCashCountReset = useXReadingStore(
		(state) => state.requestCashCountReset,
	);

	return (
		<div className="flex flex-col rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 shadow-sm">
			<h2 className="mb-4 text-lg font-semibold text-(--deep-forest)">
				Cash Count
			</h2>
			<p className="mb-6 text-sm text-(--medium-gray)">
				Count physical cash in register
			</p>

			<div className="flex-1 space-y-4">
				{CASH_COUNT_DENOMINATIONS.map((denom) => (
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
							<form.AppField name={String(denom)}>
								{() => <CashCountQtyField />}
							</form.AppField>
						</div>
						<div className="flex w-32 flex-col items-end">
							<span className="text-xs text-(--medium-gray)">Total</span>
							<form.Subscribe
								selector={(state) =>
									(state.values[String(denom)] || 0) * denom
								}
							>
								{(total) => (
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
					onClick={requestCashCountReset}
					className="flex w-full items-center justify-center gap-2 rounded-xl border border-(--deep-forest) px-4 py-4 font-bold text-(--deep-forest) transition-colors hover:bg-(--pale-yellow)"
				>
					<ArrowCounterClockwise weight="bold" className="size-5" />
					Reset Cash Count
				</button>
			</div>
		</div>
	);
}
