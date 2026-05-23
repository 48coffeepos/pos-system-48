import { queryOptions } from "@tanstack/react-query";

import menuKeys, { addonKeys } from "./keys";
import { getAllMenu } from "./server/getAllMenu";
import { getAllAddOns } from "./server/getAllAddOns";

export const getAllMenuQueryOptions = queryOptions({
  queryKey: menuKeys.all,
  queryFn: getAllMenu,
});

export const getAllAddOnsQueryOptions = queryOptions({
  queryKey: addonKeys.all,
  queryFn: getAllAddOns,
});
