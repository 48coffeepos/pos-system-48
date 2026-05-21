export const xreadingKeys = {
	all: ["xreading"] as const,
	daily: (timeframe: "today" | "yesterday") => [...xreadingKeys.all, "daily", timeframe] as const,
};
