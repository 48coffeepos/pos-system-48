import { queryOptions } from "@tanstack/react-query";
import { xreadingKeys } from "./keys";
import { getDailyReconciliation } from "./server/getDailyReconciliation";
import { getCupSales } from "./server/getCupSales";

export const getDailyReconciliationQueryOptions = () => queryOptions({
	queryKey: xreadingKeys.daily("today"),
	queryFn: () => getDailyReconciliation(),
});

export const getCupSalesQueryOptions = () => queryOptions({
	queryKey: [...xreadingKeys.all, "cupSales"] as const,
	queryFn: () => getCupSales(),
});
