import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import { auth } from "@/integrations/better-auth/auth";
import { prisma } from "@/integrations/prisma/db";

const createExpenseInput = z.object({
	type: z.enum(["CASH_IN", "CASH_OUT"]),
	description: z.string().min(1),
	amount: z.number().positive(),
});

export const createExpense = createServerFn({ method: "POST" })
	.inputValidator(createExpenseInput)
	.handler(async ({ data }) => {
		const headers = getRequestHeaders();
		const session = await auth.api.getSession({ headers });

		if (!session?.user?.id) {
			throw new Error("You must be signed in to record an expense.");
		}

		return prisma.expense.create({
			data: {
				staff_id: session.user.id,
				type: data.type,
				description: data.description.trim(),
				amount: data.amount,
			},
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
