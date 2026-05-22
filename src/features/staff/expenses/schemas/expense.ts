import { z } from "zod";

export const CreateExpenseSchema = z.object({
  type: z.enum(["CASH_IN", "CASH_OUT"]),
  description: z.string().max(50, "Description must be 50 characters or less"),
  amount: z
    .string()
    .transform((val) => {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) throw new Error("Amount must be a valid number");
      return parsed;
    })
    .pipe(z.number().positive("Amount must be positive")),
});

export type CreateExpenseInput = z.input<typeof CreateExpenseSchema>;
