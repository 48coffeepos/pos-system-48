import { queryOptions } from "@tanstack/react-query";
import expenseKeys from "./keys";
import { getExpenses } from "./server/getExpenses";

export const getExpensesQueryOptions = (timeframe: "today" | "yesterday") =>
  queryOptions({
    queryKey: expenseKeys.all(timeframe),
    queryFn: () => getExpenses({ data: { timeframe } }),
  });
