import { m as prisma } from "./auth-BTxLf562.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
import { n as getTodayBounds } from "./day-bounds-CThmiXH2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/getDailyReconciliation-Bp6lBxy9.js
var getDailyReconciliation_createServerFn_handler = createServerRpc({
	id: "e26b144a02db5b8cce85be67bc26bd21e190dcdb9b589e8f13392dc2ba0a8381",
	name: "getDailyReconciliation",
	filename: "src/features/staff/xreading/server/getDailyReconciliation.ts"
}, (opts) => getDailyReconciliation.__executeServer(opts));
var getDailyReconciliation = createServerFn({ method: "GET" }).handler(getDailyReconciliation_createServerFn_handler, async () => {
	const { start, end } = getTodayBounds();
	const [orders, expenses] = await Promise.all([prisma.order.findMany({
		where: {
			created_at: {
				gte: start,
				lte: end
			},
			method: "CASH"
		},
		select: { grand_total: true }
	}), prisma.expense.findMany({
		where: { timestamp: {
			gte: start,
			lte: end
		} },
		select: {
			amount: true,
			type: true
		}
	})]);
	const totalCashSales = orders.reduce((sum, order) => sum + Number(order.grand_total), 0);
	let totalCashOut = 0;
	let totalCashIn = 0;
	for (const exp of expenses) {
		const amount = Number(exp.amount);
		if (exp.type === "CASH_OUT") totalCashOut += amount;
		else if (exp.type === "CASH_IN") totalCashIn += amount;
	}
	return {
		totalCashSales,
		totalCashOut,
		totalCashIn
	};
});
//#endregion
export { getDailyReconciliation_createServerFn_handler };
