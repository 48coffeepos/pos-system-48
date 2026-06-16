const orderKeys = {
	all: ["orders"] as const,
	today: () => [...orderKeys.all, "today"] as const,
	filtered: (timeframe: string) =>
		[...orderKeys.all, "filtered", timeframe] as const,
	dateRange: (fromDate: string, toDate: string) =>
		[...orderKeys.all, "dateRange", fromDate, toDate] as const,
	paginated: (params: {
		page: number;
		timeframe?: string;
		fromDate?: string;
		toDate?: string;
		showCanceled?: boolean;
		search?: string;
	}) =>
		[
			...orderKeys.all,
			"paginated",
			String(params.page),
			params.timeframe ?? "",
			params.fromDate ?? "",
			params.toDate ?? "",
			String(!!params.showCanceled),
			params.search ?? "",
		] as const,
};

export default orderKeys;
