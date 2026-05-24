import { queryOptions } from "@tanstack/react-query";

import orderKeys from "./keys";
import { getFilteredOrders } from "./server/getFilteredOrders";
import { getTodayOrders } from "./server/getTodayOrders";

export const getTodayOrdersQueryOptions = queryOptions({
  queryKey: orderKeys.today(),
  queryFn: () => getTodayOrders(),
});

export const getFilteredOrdersQueryOptions = (
  timeframe: "all" | "today" | "yesterday",
) =>
  queryOptions({
    queryKey: orderKeys.filtered(timeframe),
    queryFn: () => getFilteredOrders({ data: { timeframe } }),
  });

export const getDateRangeOrdersQueryOptions = (
  fromDate: string,
  toDate: string,
) =>
  queryOptions({
    queryKey: orderKeys.dateRange(fromDate, toDate),
    queryFn: () => getFilteredOrders({ data: { fromDate, toDate } }),
  });

export function getOrdersQueryOptions(
  params:
    | { timeframe: "all" | "today" | "yesterday"; page?: number }
    | { fromDate: string; toDate: string; page?: number },
) {
  const hasDateRange = "fromDate" in params;
  const page = params.page ?? 1;
  return queryOptions({
    queryKey: orderKeys.paginated({
      page,
      timeframe: hasDateRange ? undefined : (params as { timeframe: string }).timeframe,
      fromDate: hasDateRange ? (params as { fromDate: string }).fromDate : undefined,
      toDate: hasDateRange ? (params as { toDate: string }).toDate : undefined,
    }) as readonly string[],
    queryFn: () =>
      hasDateRange
        ? getFilteredOrders({
            data: {
              fromDate: (params as { fromDate: string }).fromDate,
              toDate: (params as { toDate: string }).toDate,
              page,
            },
          })
        : getFilteredOrders({
            data: {
              timeframe: (
                params as { timeframe: "all" | "today" | "yesterday" }
              ).timeframe,
              page,
            },
          }),
  });
}
