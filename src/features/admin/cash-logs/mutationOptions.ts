import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { xreadingKeys } from "@/features/staff/xreading/keys";
import adminCashLogKeys from "./keys";
import type { UpdateExpenseInput } from "./schemas/expense";
import { deleteExpense } from "./server/deleteExpense";
import type { ExpenseRow } from "@/features/staff/expenses/server/getExpenses";
import { updateExpense } from "./server/updateExpense";

export const updateExpenseMutationOptions = mutationOptions({
	mutationFn: async (data: UpdateExpenseInput) => updateExpense({ data }),
	onSuccess: (updated, _variables, _onMutateResult, context) => {
		for (const timeframe of ["today", "yesterday"] as const) {
			context.client.setQueryData<ExpenseRow[]>(
				adminCashLogKeys.all(timeframe),
				(old) =>
					old?.map((row) =>
						row.expense_id === updated.expense_id ? updated : row,
					) ?? old,
			);
		}
		void context.client.invalidateQueries({ queryKey: xreadingKeys.all });
		toast.success("Cash log updated");
	},
	onError: (error) => {
		toast.error("Failed to update cash log", {
			description: error?.message ?? "Unknown error",
		});
	},
});

export const deleteExpenseMutationOptions = mutationOptions({
	mutationFn: async (expense_id: string) =>
		deleteExpense({ data: { expense_id } }),
	onSuccess: (_data, expense_id, _onMutateResult, context) => {
		for (const timeframe of ["today", "yesterday"] as const) {
			context.client.setQueryData<ExpenseRow[]>(
				adminCashLogKeys.all(timeframe),
				(old) => old?.filter((row) => row.expense_id !== expense_id) ?? old,
			);
		}
		void context.client.invalidateQueries({ queryKey: xreadingKeys.all });
		toast.success("Cash log deleted");
	},
	onError: (error) => {
		toast.error("Failed to delete cash log", {
			description: error?.message ?? "Unknown error",
		});
	},
});
