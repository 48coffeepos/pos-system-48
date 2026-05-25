import { queryOptions } from "@tanstack/react-query";

import dashboardKeys from "./keys";
import { getDashboardData } from "./server/getDashboardData";

export const getDashboardDataQueryOptions = queryOptions({
  queryKey: dashboardKeys.today(),
  queryFn: getDashboardData,
});
