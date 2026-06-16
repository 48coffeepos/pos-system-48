import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import type { ExpenseRow } from "@/features/staff/expenses/server/getExpenses";
import { prisma } from "@/integrations/prisma/db";
import { getTimeframeBounds } from "@/lib/day-bounds";

export const getAdminExpenses = createServerFn({ method: "GET" })
	.middleware([adminAuthMiddleware()])
	.inputValidator(z.object({ timeframe: z.enum(["today", "yesterday"]) }))
	.handler(async ({ data }) => {
		const { start, end } = getTimeframeBounds(data.timeframe);

		const expenses = await prisma.expense.findMany({
			where: {
				timestamp: { gte: start, lte: end },
			},
			include: {
				staff: {
					select: { name: true },
				},
			},
			orderBy: { timestamp: "desc" },
		});

		return expenses.map((e) => ({
			expense_id: e.expense_id,
			staff_name: e.staff.name,
			type: e.type,
			description: e.description,
			amount: Number(e.amount),
			timestamp: e.timestamp.toISOString(),
		})) satisfies ExpenseRow[];
	});
