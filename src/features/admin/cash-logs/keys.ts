const adminCashLogKeys = {
	all: (timeframe: string) => ["admin-cash-logs", timeframe] as const,
};

export default adminCashLogKeys;
