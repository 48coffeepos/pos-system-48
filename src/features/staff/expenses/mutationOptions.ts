import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import expenseKeys from "./keys";
import { createExpense } from "./server/createExpense";
import type { CreateExpenseInput } from "./schemas/expense";
import type { ExpenseRow } from "./server/getExpenses";

export const createExpenseMutationOptions = mutationOptions({
  mutationFn: async (data: CreateExpenseInput) => createExpense({ data }),
  onSuccess: (newExpense, variables, _onMutateResult, context) => {
    for (const timeframe of ["today", "yesterday"] as const) {
      context.client.setQueryData<ExpenseRow[]>(
        expenseKeys.all(timeframe),
        (old) => {
          if (!old) return [newExpense];
          return [newExpense, ...old];
        },
      );
    }
    const label = variables.type === "CASH_IN" ? "Cash in" : "Cash out";
    toast.success(`${label} recorded`, {
      description: `${variables.description}`,
    });
  },
  onError: (error) => {
    toast.error("Failed to record expense", {
      description: error?.message ?? "Unknown error",
    });
  },
});
