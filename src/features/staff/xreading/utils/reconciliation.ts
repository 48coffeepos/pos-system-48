export type DailyReconciliationTotals = {
	totalCashSales: number;
	totalCashOut: number;
	totalCashIn: number;
};

/**
 * Net sales after cash in, cash sales, and cash out.
 * Formula: Cash Sales + Cash In − Cash Out
 */
export function getExpectedCashInDrawer({
	totalCashSales,
	totalCashOut,
	totalCashIn,
}: DailyReconciliationTotals) {
	return totalCashSales + totalCashIn - totalCashOut;
}

/** Over = counted more than expected; short = counted less. */
export function getOverShort(
	totalCashCounted: number,
	totals: DailyReconciliationTotals,
) {
	const expected = getExpectedCashInDrawer(totals);
	return {
		expectedCash: expected,
		overShort: totalCashCounted - expected,
	};
}

export function formatReconciliationStatus(overShort: number) {
	const isMatched = Math.abs(overShort) < 0.01;
	const isOver = overShort > 0.01;
	return { isMatched, isOver, isShort: overShort < -0.01 };
}
