import { z } from "zod";

export const createExpenseSchema = z.object({
	type: z.enum(["CASH_IN", "CASH_OUT"]),
	description: z.string().min(1, "Description is required"),
	amount: z
		.string()
		.min(1, "Amount is required")
		.refine((val) => {
			const n = Number.parseFloat(val);
			return !Number.isNaN(n) && n > 0;
		}, "Enter a valid amount greater than 0"),
});

export type CreateExpenseValues = z.infer<typeof createExpenseSchema>;

export const emptyCreateExpenseValues = (): CreateExpenseValues => ({
	type: "CASH_OUT",
	description: "",
	amount: "",
});
