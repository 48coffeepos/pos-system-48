import { m as prisma } from "./auth-BTxLf562.mjs";
import { R as object, k as _enum } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
import { t as getTimeframeBounds } from "./day-bounds-CThmiXH2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/getExpenses--GBgjcT2.js
var getExpenses_createServerFn_handler = createServerRpc({
	id: "05ea2acc3807f21fc14541e3037e23bae5f5d27edb33b1684ec982ecf4510a36",
	name: "getExpenses",
	filename: "src/features/staff/expenses/server/getExpenses.ts"
}, (opts) => getExpenses.__executeServer(opts));
var getExpenses = createServerFn({ method: "GET" }).inputValidator(object({ timeframe: _enum(["today", "yesterday"]) })).handler(getExpenses_createServerFn_handler, async ({ data }) => {
	const { start, end } = getTimeframeBounds(data.timeframe);
	return (await prisma.expense.findMany({
		where: { timestamp: {
			gte: start,
			lte: end
		} },
		include: { staff: { select: { name: true } } },
		orderBy: { timestamp: "desc" }
	})).map((e) => ({
		expense_id: e.expense_id,
		staff_name: e.staff.name,
		type: e.type,
		description: e.description,
		amount: Number(e.amount),
		timestamp: e.timestamp.toISOString()
	}));
});
//#endregion
export { getExpenses_createServerFn_handler };
