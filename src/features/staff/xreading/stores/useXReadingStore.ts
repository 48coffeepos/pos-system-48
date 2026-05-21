import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CashCountValues = {
	1: number;
	5: number;
	10: number;
	20: number;
	50: number;
	100: number;
	200: number;
	500: number;
	1000: number;
};

export const emptyCashCountValues: CashCountValues = {
	1: 0,
	5: 0,
	10: 0,
	20: 0,
	50: 0,
	100: 0,
	200: 0,
	500: 0,
	1000: 0,
};

type DenominationKey = keyof CashCountValues;

interface XReadingState {
	cashCount: CashCountValues;
	setCashCount: (values: CashCountValues) => void;
	setDenom: (denom: DenominationKey, qty: number) => void;
	resetCashCount: () => void;
}

export const useXReadingStore = create<XReadingState>()(
	persist(
		(set) => ({
			cashCount: emptyCashCountValues,

			setCashCount: (values) => set({ cashCount: values }),

			setDenom: (denom, qty) =>
				set((state) => ({
					cashCount: { ...state.cashCount, [denom]: qty },
				})),

			resetCashCount: () => set({ cashCount: emptyCashCountValues }),
		}),
		{
			name: "staff-xreading-cash-count",
			partialize: (state) => ({
				cashCount: state.cashCount,
			}),
		},
	),
);
