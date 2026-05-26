/** Senior/PWD discount rate applied to pre-discount line totals (5%). */
export const SENIOR_PWD_DISCOUNT_PERCENT = 5;

const SENIOR_PWD_DISCOUNT_RATE = SENIOR_PWD_DISCOUNT_PERCENT / 100;

/** Peso amount discounted from the pre-discount line total at 5%. */
export function seniorPwdDiscountAmount(lineTotal: number): number {
	if (lineTotal <= 0) return 0;
	const amount =
		(lineTotal * SENIOR_PWD_DISCOUNT_RATE) / (1 - SENIOR_PWD_DISCOUNT_RATE);
	return Math.round(amount * 100) / 100;
}
