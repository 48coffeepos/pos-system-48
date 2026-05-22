export type DailyReconciliationTotals = {
	totalCashSales: number;
	totalCashOut: number;
	totalCashIn: number;
};

/**
 * Expected cash in drawer after sales and today's cash movements.
 * Formula: Cash Sales − Expenses (cash out)
 */
export function getExpectedCashInDrawer({
	totalCashSales,
	totalCashOut,
}: DailyReconciliationTotals) {
	return totalCashSales - totalCashOut;
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
