import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/integrations/prisma/db";
import { authMiddleware } from "@/features/auth/middlewares";
import { CreateExpenseSchema } from "../schemas/expense";

export const createExpense = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(CreateExpenseSchema)
  .handler(async ({ data, context }) => {
    const expense = await prisma.expense.create({
      data: {
        staff_id: context.session.user.id,
        type: data.type,
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
