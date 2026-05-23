import { queryOptions } from "@tanstack/react-query";

import orderKeys from "./keys";
import { getTodayOrders } from "./server/getTodayOrders";

export const getTodayOrdersQueryOptions = queryOptions({
  queryKey: orderKeys.today(),
  queryFn: () => getTodayOrders(),
});
