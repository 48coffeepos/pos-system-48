import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/integrations/prisma/db";

export const getExpenses = createServerFn({ method: "GET" }).handler(async () => {
	const start = new Date();
	start.setHours(0, 0, 0, 0);
	const end = new Date();
	end.setHours(23, 59, 59, 999);

	return prisma.expense.findMany({
		where: {
			timestamp: { gte: start, lte: end },
		},
		orderBy: { timestamp: "desc" },
		select: {
			expense_id: true,
			type: true,
			description: true,
			amount: true,
			timestamp: true,
			staff: { select: { name: true } },
		},
	});
});
