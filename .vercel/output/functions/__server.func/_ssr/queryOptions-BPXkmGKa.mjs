import { R as object, k as _enum } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CPlEDLjn.mjs";
import { r as queryOptions } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queryOptions-BPXkmGKa.js
var expenseKeys = { all: (timeframe) => ["expenses", timeframe] };
var getExpenses = createServerFn({ method: "GET" }).inputValidator(object({ timeframe: _enum(["today", "yesterday"]) })).handler(createSsrRpc("05ea2acc3807f21fc14541e3037e23bae5f5d27edb33b1684ec982ecf4510a36"));
var getExpensesQueryOptions = (timeframe) => queryOptions({
	queryKey: expenseKeys.all(timeframe),
	queryFn: () => getExpenses({ data: { timeframe } })
});
//#endregion
export { getExpensesQueryOptions as n, expenseKeys as t };
