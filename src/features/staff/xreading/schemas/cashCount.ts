import { z } from "zod";

export type CashCountDenomination =
	| 1
	| 5
	| 10
	| 20
	| 50
	| 100
	| 200
	| 500
	| 1000;

export type CashCountValues = Record<CashCountDenomination, number>;

export const CASH_COUNT_DENOMINATIONS: CashCountDenomination[] = [
	1000, 500, 200, 100, 50, 20, 10, 5, 1,
];

const qty = z.number().int().min(0);

export const cashCountSchema = z.object({
	1: qty,
	5: qty,
	10: qty,
	20: qty,
	50: qty,
	100: qty,
	200: qty,
	500: qty,
	1000: qty,
});

export function emptyCashCountValues(): CashCountValues {
	return {
		"1": 0,
		"5": 0,
		"10": 0,
		"20": 0,
		"50": 0,
		"100": 0,
		"200": 0,
		"500": 0,
		"1000": 0,
	} as CashCountValues;
}
