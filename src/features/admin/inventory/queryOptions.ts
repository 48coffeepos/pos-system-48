import { queryOptions } from "@tanstack/react-query";
import inventoryKeys from "./keys";
import { getInventoryItems } from "./server/getInventoryItems";

export const getInventoryQueryOptions = queryOptions({
  queryKey: inventoryKeys.inventory,
  queryFn: () => getInventoryItems(),
});
