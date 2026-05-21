import { create } from "zustand";

export type XReadingReceiptMode = "sales" | "cashcount" | null;

export type XReadingReconciliation = {
	totalCashSales: number;
	totalExpenses: number;
};

interface XReadingState extends XReadingReconciliation {
	receiptMode: XReadingReceiptMode;
	cashCountResetNonce: number;

	setReconciliation: (data: XReadingReconciliation) => void;
	openSalesReceipt: () => void;
	openCashCountReceipt: () => void;
	closeReceipt: () => void;
	requestCashCountReset: () => void;
	resetUi: () => void;
}

const initialReconciliation: XReadingReconciliation = {
	totalCashSales: 0,
	totalExpenses: 0,
};

export const useXReadingStore = create<XReadingState>((set) => ({
	...initialReconciliation,
	receiptMode: null,
	cashCountResetNonce: 0,

	setReconciliation: (data) => set(data),
	openSalesReceipt: () => set({ receiptMode: "sales" }),
	openCashCountReceipt: () => set({ receiptMode: "cashcount" }),
	closeReceipt: () => set({ receiptMode: null }),
	requestCashCountReset: () =>
		set((state) => ({ cashCountResetNonce: state.cashCountResetNonce + 1 })),
	resetUi: () =>
		set({
			...initialReconciliation,
			receiptMode: null,
			cashCountResetNonce: 0,
		}),
}));
