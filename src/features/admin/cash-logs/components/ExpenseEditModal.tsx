import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAppForm } from "@/integrations/tanstack-form";
import { cn } from "@/lib/utils";
import type { ExpenseRow } from "@/features/staff/expenses/server/getExpenses";
import { updateExpenseMutationOptions } from "../mutationOptions";
import { UpdateExpenseSchema } from "../schemas/expense";
import type { UpdateExpenseInput } from "../schemas/expense";

interface ExpenseEditModalProps {
	expense: ExpenseRow | null;
	open: boolean;
	onClose: () => void;
}

const TYPE_OPTIONS = [
	{ value: "CASH_IN" as const, label: "Cash In" },
	{ value: "CASH_OUT" as const, label: "Cash Out" },
	{ value: "EXPENSE" as const, label: "Expenses" },
];

export function ExpenseEditModal({
	expense,
	open,
	onClose,
}: ExpenseEditModalProps) {
	const mutation = useMutation(updateExpenseMutationOptions);

	const form = useAppForm({
		defaultValues: {
			expense_id: "",
			type: "CASH_IN" as UpdateExpenseInput["type"],
			description: "",
			amount: 0,
		},
		validators: { onSubmit: UpdateExpenseSchema },
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync(value);
			onClose();
		},
	});

	useEffect(() => {
		if (open && expense) {
			form.reset({
				expense_id: expense.expense_id,
				type: expense.type as UpdateExpenseInput["type"],
				description: expense.description,
				amount: expense.amount,
			});
		}
	}, [open, expense, form]);

	if (!expense) return null;

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogContent className="w-[calc(100vw-1rem)] max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Cash Log</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<form.AppField name="type">
						{(field) => (
							<div>
								<Label className="mb-1.5 block text-sm font-medium">Type</Label>
								<div className="grid grid-cols-3 gap-2">
									{TYPE_OPTIONS.map((opt) => (
										<button
											key={opt.value}
											type="button"
											onClick={() => field.handleChange(opt.value)}
											className={cn(
												"rounded-lg border px-2 py-2 text-xs font-medium sm:text-sm",
												field.state.value === opt.value
													? "border-(--deep-forest) bg-(--deep-forest) text-(--pale-yellow)"
													: "border-(--light-gray) text-(--medium-gray)",
											)}
										>
											{opt.label}
										</button>
									))}
								</div>
							</div>
						)}
					</form.AppField>

					<form.AppField name="description">
						{(field) => <field.Input label="Description" />}
					</form.AppField>

					<form.AppField name="amount">
						{(field) => (
							<field.NumberField label="Amount" placeholder="0.00" min="0" step="0.01" />
						)}
					</form.AppField>

					<p className="text-xs text-(--medium-gray)">
						Added by {expense.staff_name} ·{" "}
						{new Date(expense.timestamp).toLocaleString()}
					</p>

					<DialogFooter>
						<form.AppForm>
							<form.SubmitButton
								label={mutation.isPending ? "Saving..." : "Save Changes"}
							/>
						</form.AppForm>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
