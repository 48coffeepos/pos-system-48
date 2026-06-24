export const xreadingKeys = {
	all: ["xreading"] as const,
	daily: (timeframe: "today" | "yesterday", staffId?: string) => [...xreadingKeys.all, "daily", timeframe, staffId ?? "all"] as const,
	cupSales: (timeframe: "today" | "yesterday", staffId?: string) => [...xreadingKeys.all, "cupSales", timeframe, staffId ?? "all"] as const,
};
