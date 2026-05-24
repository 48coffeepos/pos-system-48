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
