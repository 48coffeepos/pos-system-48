import { queryOptions } from "@tanstack/react-query";
import { xreadingKeys } from "./keys";
import { getDailyReconciliation } from "./server/getDailyReconciliation";
import { getCupSales } from "./server/getCupSales";

export const getDailyReconciliationQueryOptions = (date: "today" | "yesterday" = "today") => queryOptions({
	queryKey: xreadingKeys.daily(date),
	queryFn: () => getDailyReconciliation({ data: { date } }),
});

export const getCupSalesQueryOptions = (date: "today" | "yesterday" = "today") => queryOptions({
	queryKey: [...xreadingKeys.all, "cupSales", date] as const,
	queryFn: () => getCupSales({ data: { date } }),
});
