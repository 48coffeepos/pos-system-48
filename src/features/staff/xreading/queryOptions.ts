import { queryOptions } from "@tanstack/react-query";
import { xreadingKeys } from "./keys";
import { getDailyReconciliation } from "./server/getDailyReconciliation";
import { getCupSales } from "./server/getCupSales";

export const getDailyReconciliationQueryOptions = (date: "today" | "yesterday" = "today", staffId?: string) => queryOptions({
	queryKey: xreadingKeys.daily(date, staffId),
	queryFn: () => getDailyReconciliation({ data: { date, staffId } }),
});

export const getCupSalesQueryOptions = (date: "today" | "yesterday" = "today", staffId?: string) => queryOptions({
	queryKey: xreadingKeys.cupSales(date, staffId),
	queryFn: () => getCupSales({ data: { date, staffId } }),
});
