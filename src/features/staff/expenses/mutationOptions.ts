import { mutationOptions } from "@tanstack/react-query";
import expenseKeys from "./keys";
import { createExpense } from "./server/createExpense";

export const createExpenseMutationOptions = mutationOptions({
	mutationFn: async (input: {
		type: "CASH_IN" | "CASH_OUT";
		description: string;
		amount: number;
	}) => createExpense({ data: input }),
	onSuccess: async (_data, _variables, context) => {
		await context.client.invalidateQueries({ queryKey: expenseKeys.all });
	},
});
