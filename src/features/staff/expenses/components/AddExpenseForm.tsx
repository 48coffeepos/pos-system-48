import { ArrowDownRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { useAppForm } from "@/integrations/tanstack-form";
import { cn } from "@/lib/utils";
import { createExpenseMutationOptions } from "../mutationOptions";
import { CreateExpenseSchema } from "../schemas/expense";

export function AddExpenseForm() {
	const mutation = useMutation(createExpenseMutationOptions);

	const defaultValues = {
		type: "CASH_OUT" as "CASH_IN" | "CASH_OUT",
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
				{(field) => (
					<>
						<h2 className="mb-4 text-lg font-semibold text-(--deep-forest)">
							{field.state.value === "CASH_IN" ? "Add Cash In" : "Add Cash Out"}
						</h2>

						<div className="mb-4">
							<Label className="mb-1.5 block text-sm font-medium text-(--deep-forest)">
								Type
							</Label>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => field.handleChange("CASH_OUT")}
									className={cn(
										"flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
										field.state.value === "CASH_OUT"
											? "border-(--deep-forest) bg-(--deep-forest) text-(--pale-yellow)"
											: "border-(--light-gray) bg-(--pure-white) text-(--medium-gray) hover:border-(--medium-gray)",
									)}
								>
									<ArrowDownRightIcon weight="bold" className="size-4" />
									Cash Out
								</button>
								<button
									type="button"
									onClick={() => field.handleChange("CASH_IN")}
									className={cn(
										"flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
										field.state.value === "CASH_IN"
											? "border-(--deep-forest) bg-(--deep-forest) text-(--pale-yellow)"
											: "border-(--light-gray) bg-(--pure-white) text-(--medium-gray) hover:border-(--medium-gray)",
									)}
								>
									<ArrowUpRightIcon weight="bold" className="size-4" />
									Cash In
								</button>
							</div>
						</div>
					</>
				)}
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
							label={type === "CASH_IN" ? "Record Cash In" : "Record Cash Out"}
							className="w-full"
						/>
					</form.AppForm>
				)}
			</form.Subscribe>
		</form>
	);
}
