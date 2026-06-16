import { createServerFn } from "@tanstack/react-start";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { DeleteExpenseSchema } from "../schemas/expense";

export const deleteExpense = createServerFn({ method: "POST" })
	.middleware([adminAuthMiddleware()])
	.inputValidator(DeleteExpenseSchema)
	.handler(async ({ data }) => {
		await prisma.expense.delete({
			where: { expense_id: data.expense_id },
		});
		return { success: true };
	});
