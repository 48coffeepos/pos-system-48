import { queryOptions } from "@tanstack/react-query";

import menuKeys from "./keys";
import { getAllMenu } from "./server/getAllMenu";

export const getAllMenuQueryOptions = queryOptions({
  queryKey: menuKeys.all,
  queryFn: getAllMenu,
});
