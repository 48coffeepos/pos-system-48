import { queryOptions } from "@tanstack/react-query";

import inventoryKeys from "./keys";
import { getAllInventory } from "./server/getAllInventory";

export const getAllInventoryQueryOptions = queryOptions({
  queryKey: inventoryKeys.inventory,
  queryFn: getAllInventory,
});
