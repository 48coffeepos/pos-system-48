import { queryOptions } from "@tanstack/react-query";
import expenseKeys from "./keys";
import { getExpenses } from "./server/getExpenses";

export const getExpensesQueryOptions = queryOptions({
	queryKey: expenseKeys.all,
	queryFn: () => getExpenses(),
});
