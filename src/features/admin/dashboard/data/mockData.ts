export interface CupSales {
	cups_12oz_cash: number;
	cups_12oz_gcash: number;
	cups_12oz_grab: number;
	cups_12oz_sold: number;
	cups_16oz_cash: number;
	cups_16oz_gcash: number;
	cups_16oz_grab: number;
	cups_16oz_sold: number;
}

export interface ExpenseItem {
	id: string;
	title: string;
	amount: number;
	date: string;
}

export interface DashboardStats {
	total_revenue: number;
}

export const PAYMENTS = [
	{ key: "all", label: "All" },
	{ key: "cash", label: "Cash" },
	{ key: "gcash", label: "GCash" },
	{ key: "grab", label: "Grab" },
] as const;

export type PaymentMethod = (typeof PAYMENTS)[number]["key"];

export const mockCupSales: CupSales = {
	cups_12oz_cash: 142,
	cups_12oz_gcash: 89,
	cups_12oz_grab: 34,
	cups_12oz_sold: 265,
	cups_16oz_cash: 98,
	cups_16oz_gcash: 76,
	cups_16oz_grab: 45,
	cups_16oz_sold: 219,
};

export const mockStats: DashboardStats = {
	total_revenue: 128450.75,
};

export const mockExpenses: ExpenseItem[] = [
	{ id: "1", title: "Milk Restock", amount: 3500.0, date: "2024-05-18" },
	{ id: "2", title: "Syrup Supply", amount: 1200.5, date: "2024-05-17" },
	{ id: "3", title: "Cup Packaging", amount: 850.0, date: "2024-05-16" },
	{ id: "4", title: "Equipment Repair", amount: 2400.0, date: "2024-05-15" },
	{ id: "5", title: "Utilities", amount: 4500.0, date: "2024-05-14" },
];
