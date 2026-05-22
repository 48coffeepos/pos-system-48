import { createServerFn } from "@tanstack/react-start";
import { getTodayBounds } from "@/lib/day-bounds";
import { prisma } from "@/integrations/prisma/db";

export const getDailyReconciliation = createServerFn({ method: "GET" }).handler(
	async () => {
		const { start, end } = getTodayBounds();

		const [orders, expenses] = await Promise.all([
			prisma.order.findMany({
				where: {
					created_at: { gte: start, lte: end },
					method: "CASH",
				},
				select: { grand_total: true },
			}),
			prisma.expense.findMany({
				where: {
					timestamp: { gte: start, lte: end },
				},
				select: { amount: true, type: true },
			}),
		]);

		const totalCashSales = orders.reduce(
			(sum, order) => sum + Number(order.grand_total),
			0,
		);

		let totalCashOut = 0;
		let totalCashIn = 0;
		for (const exp of expenses) {
			const amount = Number(exp.amount);
			if (exp.type === "CASH_OUT") {
				totalCashOut += amount;
			} else if (exp.type === "CASH_IN") {
				totalCashIn += amount;
			}
		}

		return {
			totalCashSales,
			totalCashOut,
			totalCashIn,
		};
	},
);
