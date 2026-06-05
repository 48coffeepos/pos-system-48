import { queryOptions } from "@tanstack/react-query";

import inventoryKeys from "./keys";
import { getAllInventory } from "./server/getAllInventory";
import { getInventoryLogs } from "./server/getInventoryLogs";

export const getAllInventoryQueryOptions = queryOptions({
  queryKey: inventoryKeys.inventory,
  queryFn: getAllInventory,
});

export const getInventoryLogsQueryOptions = queryOptions({
  queryKey: inventoryKeys.inventoryLogs,
  queryFn: getInventoryLogs,
});
