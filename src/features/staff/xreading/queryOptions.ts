import { queryOptions } from "@tanstack/react-query";
import { xreadingKeys } from "./keys";
import { getDailyReconciliation } from "./server/getDailyReconciliation";

export const getDailyReconciliationQueryOptions = () => queryOptions({
	queryKey: xreadingKeys.daily("today"),
	queryFn: () => getDailyReconciliation(),
});
