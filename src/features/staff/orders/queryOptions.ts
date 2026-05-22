import { queryOptions } from "@tanstack/react-query";
import orderKeys from "./keys";
import { getOrders } from "./server/getOrders";

export const getOrdersQueryOptions = queryOptions({
  queryKey: orderKeys.all,
  queryFn: () => getOrders(),
});
