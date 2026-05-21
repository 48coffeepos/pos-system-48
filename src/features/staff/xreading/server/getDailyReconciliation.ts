import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/integrations/prisma/db";


export const getDailyReconciliation = createServerFn({ method: "GET" }).handler(
	async () => {
		const targetDate = new Date();
		
		const start = new Date(targetDate);
		start.setHours(0, 0, 0, 0);
		
		const end = new Date(targetDate);
		end.setHours(23, 59, 59, 999);

		const [orders, expenses] = await Promise.all([
			prisma.order.findMany({
				where: {
					created_at: {
						gte: start,
						lte: end,
					},
					method: "CASH",
				},
				select: {
					grand_total: true,
				},
			}),
			prisma.expense.findMany({
				where: {
					timestamp: {
						gte: start,
						lte: end,
					},
				},
				select: {
					amount: true,
					type: true,
				},
			}),
		]);

		const totalCashSales = orders.reduce(
			(sum, order) => sum + Number(order.grand_total),
			0,
		);

		let totalExpenses = 0;
		expenses.forEach((exp) => {
			if (exp.type === "CASH_OUT") {
				totalExpenses += Number(exp.amount);
			} else if (exp.type === "CASH_IN") {
				// Technically CASH_IN reduces the net expenses or increases expected cash
				totalExpenses -= Number(exp.amount);
			}
		});

		return {
			totalCashSales,
			totalExpenses,
		};
	},
);
