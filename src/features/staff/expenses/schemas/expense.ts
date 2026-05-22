import { z } from "zod";

export const CreateExpenseSchema = z.object({
	type: z.enum(["CASH_IN", "CASH_OUT"]),
	description: z.string().max(50, "Description must be 50 characters or less"),
	amount: z
		.number()
		.positive("Amount must be positive")
		.max(99999999.99, "Amount must be less than 99,999,999.99"),
});
export type CreateExpenseInput = z.input<typeof CreateExpenseSchema>;
