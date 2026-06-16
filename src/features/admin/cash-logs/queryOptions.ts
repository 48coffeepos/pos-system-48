import { queryOptions } from "@tanstack/react-query";
import adminCashLogKeys from "./keys";
import { getAdminExpenses } from "./server/getAdminExpenses";

export const getAdminExpensesQueryOptions = (
	timeframe: "today" | "yesterday",
) =>
	queryOptions({
		queryKey: adminCashLogKeys.all(timeframe),
		queryFn: () => getAdminExpenses({ data: { timeframe } }),
	});
