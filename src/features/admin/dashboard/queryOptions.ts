import { queryOptions } from "@tanstack/react-query";

import dashboardKeys from "./keys";
import { getDashboardData } from "./server/getDashboardData";
import { getMonthlyData } from "./server/getMonthlyData";
import { getAvailableMonths } from "./server/getAvailableMonths";
import { getAdminReconciliation } from "./server/getAdminReconciliation";
import { getAdminCupSales } from "./server/getAdminCupSales";

export const getDashboardDataQueryOptions = queryOptions({
  queryKey: dashboardKeys.today(),
  queryFn: getDashboardData,
});

export const getMonthlyDataQueryOptions = (year: number, month: number) => queryOptions({
  queryKey: [...dashboardKeys.all, "monthly", year, month] as const,
  queryFn: () => getMonthlyData({ data: { year, month } }),
});

export const getAvailableMonthsQueryOptions = queryOptions({
  queryKey: [...dashboardKeys.all, "availableMonths"] as const,
  queryFn: getAvailableMonths,
});

export const getAdminReconciliationQueryOptions = (date: "today" | "yesterday") =>
  queryOptions({
    queryKey: dashboardKeys.reconciliation(date),
    queryFn: () => getAdminReconciliation({ data: { date } }),
  });

export const getAdminCupSalesQueryOptions = (date: "today" | "yesterday") =>
  queryOptions({
    queryKey: dashboardKeys.cupSales(date),
    queryFn: () => getAdminCupSales({ data: { date } }),
  });
