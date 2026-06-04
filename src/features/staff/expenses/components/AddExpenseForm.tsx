import {
	ArrowDownRightIcon,
	ArrowUpRightIcon,
	ReceiptIcon,
} from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { useAppForm } from "@/integrations/tanstack-form";
import { cn } from "@/lib/utils";
import { createExpenseMutationOptions } from "../mutationOptions";
import { CreateExpenseSchema } from "../schemas/expense";
import type { CreateExpenseInput } from "../schemas/expense";

type ExpenseType = CreateExpenseInput["type"];

const TYPE_LABELS: Record<
	ExpenseType,
	{ heading: string; submit: string; button: string }
> = {
	CASH_IN: { heading: "Add Cash In", submit: "Record Cash In", button: "Cash In" },
	CASH_OUT: {
		heading: "Add Cash Out",
		submit: "Record Cash Out",
		button: "Cash Out",
	},
	EXPENSE: { heading: "Add Expense", submit: "Record Expense", button: "Expenses" },
};

export function AddExpenseForm() {
	const mutation = useMutation(createExpenseMutationOptions);

	const defaultValues: CreateExpenseInput = {
		type: "CASH_OUT",
		description: "",
		amount: 0,
	};

	const form = useAppForm({
		defaultValues,
		validators: {
			onSubmit: CreateExpenseSchema,
		},
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync(value);
			form.reset();
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 space-y-3"
		>
			<form.AppField name="type">
				{(field) => {
					const labels = TYPE_LABELS[field.state.value];

					return (
						<>
							<h2 className="mb-4 text-lg font-semibold text-(--deep-forest)">
								{labels.heading}
							</h2>

							<div className="mb-4">
								<Label className="mb-1.5 block text-sm font-medium text-(--deep-forest)">
									Type
								</Label>
								<div className="grid grid-cols-3 gap-2">
									<button
										type="button"
										onClick={() => field.handleChange("CASH_OUT")}
										className={cn(
											"flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-all sm:text-sm sm:px-3",
											field.state.value === "CASH_OUT"
												? "border-(--deep-forest) bg-(--deep-forest) text-(--pale-yellow)"
												: "border-(--light-gray) bg-(--pure-white) text-(--medium-gray) hover:border-(--medium-gray)",
										)}
									>
										<ArrowDownRightIcon weight="bold" className="size-4 shrink-0" />
										Cash Out
									</button>
									<button
										type="button"
										onClick={() => field.handleChange("CASH_IN")}
										className={cn(
											"flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-all sm:text-sm sm:px-3",
											field.state.value === "CASH_IN"
												? "border-(--deep-forest) bg-(--deep-forest) text-(--pale-yellow)"
												: "border-(--light-gray) bg-(--pure-white) text-(--medium-gray) hover:border-(--medium-gray)",
										)}
									>
										<ArrowUpRightIcon weight="bold" className="size-4 shrink-0" />
										Cash In
									</button>
									<button
										type="button"
										onClick={() => field.handleChange("EXPENSE")}
										className={cn(
											"flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-all sm:text-sm sm:px-3",
											field.state.value === "EXPENSE"
												? "border-(--deep-forest) bg-(--deep-forest) text-(--pale-yellow)"
												: "border-(--light-gray) bg-(--pure-white) text-(--medium-gray) hover:border-(--medium-gray)",
										)}
									>
										<ReceiptIcon weight="bold" className="size-4 shrink-0" />
										Expenses
									</button>
								</div>
							</div>
						</>
					);
				}}
			</form.AppField>

			<form.AppField
				name="description"
				listeners={{
					onChange: ({ fieldApi, value }) => {
						if (value.length >= 50) {
							fieldApi.setValue(value.slice(0, 50));
						}
					},
				}}
			>
				{(field) => (
					<>
						<field.Input label="Description" />
						<p
							className={cn(
								"mt-1 text-right text-xs",
								field.state.value.length >= 45
									? "text-red-600"
									: "text-(--medium-gray)",
							)}
						>
							{field.state.value.length} / 50
						</p>
					</>
				)}
			</form.AppField>

			<form.AppField name="amount">
				{(field) => <field.NumberField label="Amount" placeholder="0.00" />}
			</form.AppField>

			<form.Subscribe selector={(s) => s.values.type}>
				{(type) => (
					<form.AppForm>
						<form.SubmitButton
							label={TYPE_LABELS[type].submit}
							className="w-full"
						/>
					</form.AppForm>
				)}
			</form.Subscribe>
		</form>
	);
}
