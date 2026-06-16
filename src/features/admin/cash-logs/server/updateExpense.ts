import { createServerFn } from "@tanstack/react-start";
import { Expense_Type } from "@/generated/prisma/client.js";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { UpdateExpenseSchema } from "../schemas/expense";

export const updateExpense = createServerFn({ method: "POST" })
	.middleware([adminAuthMiddleware()])
	.inputValidator(UpdateExpenseSchema)
	.handler(async ({ data }) => {
		const expense = await prisma.expense.update({
			where: { expense_id: data.expense_id },
			data: {
				type: Expense_Type[data.type],
				description: data.description,
				amount: data.amount,
			},
			include: {
				staff: { select: { name: true } },
			},
		});

		return {
			expense_id: expense.expense_id,
			staff_name: expense.staff.name,
			type: expense.type,
			description: expense.description,
			amount: Number(expense.amount),
			timestamp: expense.timestamp.toISOString(),
		};
	});
