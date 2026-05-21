import { useMutation, useQuery } from "@tanstack/react-query";
import { CurrencyDollar } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useAppForm } from "@/integrations/tanstack-form";
import { StaffHeader } from "@/features/staff/components/StaffHeader";
import { formatPeso } from "@/lib/format-currency";
import { getExpensesQueryOptions } from "../queryOptions";
import { createExpenseMutationOptions } from "../mutationOptions";
import {
	createExpenseSchema,
	emptyCreateExpenseValues,
} from "../schemas/expense";

export function ExpensesScreen() {
	const { data: expenses, isLoading, error } = useQuery(getExpensesQueryOptions);
	const createMutation = useMutation(createExpenseMutationOptions);

	const form = useAppForm({
		defaultValues: emptyCreateExpenseValues(),
		validators: {
			onSubmit: createExpenseSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await createMutation.mutateAsync({
					type: value.type,
					description: value.description.trim(),
					amount: Number.parseFloat(value.amount),
				});
				form.reset();
				toast.success("Expense recorded.");
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Failed to record expense.";
				toast.error(message);
			}
		},
	});

	if (error) {
		console.error("Failed to fetch expenses:", error);
	}

	return (
		<div className="min-h-screen">
			<StaffHeader />
			<main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8 flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-(--deep-forest)">
						<CurrencyDollar
							weight="fill"
							className="size-5 text-(--pale-yellow)"
						/>
					</div>
					<div>
						<h1 className="text-2xl font-bold text-(--deep-forest)">Expenses</h1>
						<p className="mt-0.5 text-sm text-(--medium-gray)">
							Record and monitor daily expenses.
						</p>
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-2">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
						className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 shadow-sm"
					>
						<h2 className="mb-4 text-lg font-semibold text-(--deep-forest)">
							Record Expense
						</h2>
						<form.AppForm>
							<div className="space-y-4">
								<form.AppField name="type">
									{(field) => (
										<field.Select
											label="Type"
											options={[
												{ value: "CASH_OUT", label: "Cash Out" },
												{ value: "CASH_IN", label: "Cash In" },
											]}
										/>
									)}
								</form.AppField>
								<form.AppField name="description">
									{(field) => (
										<field.Input
											label="Description"
											placeholder="What was this expense for?"
										/>
									)}
								</form.AppField>
								<form.AppField name="amount">
									{(field) => (
										<field.Input
											label="Amount"
											type="number"
											placeholder="0.00"
										/>
									)}
								</form.AppField>
								<form.SubmitButton label="Save Expense" />
							</div>
						</form.AppForm>
					</form>

					<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 shadow-sm">
						<h2 className="mb-4 text-lg font-semibold text-(--deep-forest)">
							Today&apos;s Expenses
						</h2>
						{isLoading ? (
							<p className="text-sm text-(--medium-gray)">Loading...</p>
						) : !expenses?.length ? (
							<p className="text-sm text-(--medium-gray)">
								No expenses recorded today.
							</p>
						) : (
							<ul className="max-h-[420px] space-y-3 overflow-y-auto">
								{expenses.map((expense) => (
									<li
										key={expense.expense_id}
										className="flex items-start justify-between gap-4 rounded-xl border border-(--light-gray)/50 bg-gray-50/50 p-3"
									>
										<div>
											<p className="font-medium text-(--deep-forest)">
												{expense.description}
											</p>
											<p className="text-xs text-(--medium-gray)">
												{expense.type === "CASH_IN" ? "Cash In" : "Cash Out"} ·{" "}
												{expense.staff.name}
											</p>
										</div>
										<span
											className={`font-mono text-sm font-bold ${
												expense.type === "CASH_IN"
													? "text-green-600"
													: "text-red-600"
											}`}
										>
											{expense.type === "CASH_IN" ? "+" : "-"}
											{formatPeso(Number(expense.amount))}
										</span>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
