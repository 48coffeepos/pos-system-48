import { createFileRoute } from "@tanstack/react-router";
import { AddExpenseForm } from "@/features/staff/expenses/components/AddExpenseForm";
import { ExpensesTable } from "@/features/staff/expenses/components/ExpensesTable";
import { getExpensesQueryOptions } from "@/features/staff/expenses/queryOptions";

export const Route = createFileRoute("/staff/expenses")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getExpensesQueryOptions("today"));
  },
  component: StaffExpenses,
});

function StaffExpenses() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ExpensesTable />
          </div>
          <div>
            <AddExpenseForm />
          </div>
        </div>
      </main>
    </div>
  );
}
