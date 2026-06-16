import { useMutation, useQuery } from "@tanstack/react-query";
import {
	ArrowDownRightIcon,
	ArrowUpRightIcon,
	CurrencyDollarIcon,
	PencilSimpleIcon,
	PlusIcon,
	ReceiptIcon,
	TrashIcon,
	WarningCircleIcon,
} from "@phosphor-icons/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { ExpenseRow } from "@/features/staff/expenses/server/getExpenses";
import { cn } from "@/lib/utils";
import { deleteExpenseMutationOptions } from "../mutationOptions";
import { getAdminExpensesQueryOptions } from "../queryOptions";
import { ExpenseEditModal } from "./ExpenseEditModal";
import { AddExpenseModal } from "./AddExpenseModal";

type Timeframe = "today" | "yesterday";

const columnHelper = createColumnHelper<ExpenseRow>();

export function AdminExpensesTable() {
	const [timeframe, setTimeframe] = useState<Timeframe>("today");
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [editingExpense, setEditingExpense] = useState<ExpenseRow | null>(null);
	const [deletingExpense, setDeletingExpense] = useState<ExpenseRow | null>(
		null,
	);
	const deleteMutation = useMutation(deleteExpenseMutationOptions);

	const { data: expenses, isLoading, isError, error, refetch } = useQuery(
		getAdminExpensesQueryOptions(timeframe),
	);

	const columns = [
		columnHelper.accessor("type", {
			header: "Type",
			cell: ({ getValue }) => {
				const type = getValue();
				if (type === "CASH_IN") {
					return (
						<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
							<ArrowUpRightIcon weight="bold" className="size-3" />
							Cash In
						</span>
					);
				}
				if (type === "EXPENSE") {
					return (
						<span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/20">
							<ReceiptIcon weight="bold" className="size-3" />
							Expenses
						</span>
					);
				}
				return (
					<span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-600/20">
						<ArrowDownRightIcon weight="bold" className="size-3" />
						Cash Out
					</span>
				);
			},
		}),
		columnHelper.accessor("description", {
			header: "Description",
			cell: ({ getValue }) => (
				<span className="font-medium text-(--deep-forest)">{getValue()}</span>
			),
		}),
		columnHelper.accessor("amount", {
			header: "Amount",
			cell: ({ getValue }) => (
				<span className="font-semibold tabular-nums">
					₱{getValue().toFixed(2)}
				</span>
			),
		}),
		columnHelper.accessor("staff_name", {
			header: "Added By",
			cell: ({ getValue }) => (
				<span className="text-(--medium-gray)">{getValue()}</span>
			),
		}),
		columnHelper.accessor("timestamp", {
			header: "Date & Time",
			cell: ({ getValue }) => (
				<span className="text-xs text-(--medium-gray)">
					{new Date(getValue()).toLocaleString("en-PH", {
						month: "short",
						day: "numeric",
						year: "numeric",
						hour: "numeric",
						minute: "2-digit",
						hour12: true,
					})}
				</span>
			),
		}),
		columnHelper.display({
			id: "actions",
			header: () => <div className="text-right">Actions</div>,
			cell: ({ row }) => (
				<div className="flex justify-end gap-2">
					<button
						type="button"
						onClick={() => setEditingExpense(row.original)}
						className="rounded-lg p-1.5 text-(--medium-gray) hover:bg-(--off-white) hover:text-(--deep-forest)"
						aria-label="Edit"
					>
						<PencilSimpleIcon className="size-4" />
					</button>
					<button
						type="button"
						onClick={() => setDeletingExpense(row.original)}
						className="rounded-lg p-1.5 text-(--medium-gray) hover:bg-red-50 hover:text-red-600"
						aria-label="Delete"
					>
						<TrashIcon className="size-4" />
					</button>
				</div>
			),
		}),
	] as ColumnDef<ExpenseRow, string | number>[];

	if (isError) {
		return (
			<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-12">
				<div className="flex flex-col items-center justify-center gap-4 text-center">
					<WarningCircleIcon weight="fill" className="size-10 text-(--error)" />
					<div>
						<p className="text-base font-semibold text-(--deep-forest)">
							Failed to load cash logs
						</p>
						<p className="mt-1 text-sm text-(--medium-gray)">
							{error?.message ?? "Something went wrong"}
						</p>
					</div>
					<Button onClick={() => refetch()} variant="outline" size="sm">
						Retry
					</Button>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white)">
				<div className="flex flex-col gap-3 border-b border-(--light-gray) px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
					<div className="flex items-center gap-2">
						<div className="flex size-8 items-center justify-center rounded-lg bg-(--deep-forest)">
							<CurrencyDollarIcon
								weight="fill"
								className="size-4 text-(--pale-yellow)"
							/>
						</div>
						<div>
							<h2 className="text-base font-semibold text-(--deep-forest)">
								Cash Records
							</h2>
							<p className="text-xs text-(--medium-gray)">
								{isLoading
									? "Loading..."
									: `${expenses?.length ?? 0} entries`}
							</p>
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
						<Button
							type="button"
							size="sm"
							onClick={() => setAddModalOpen(true)}
						>
							<PlusIcon className="size-4" />
							Add Record
						</Button>
						<div className="flex gap-1.5 rounded-full bg-(--light-gray)/30 p-1">
							{(["today", "yesterday"] as const).map((value) => (
								<button
									key={value}
									type="button"
									onClick={() => setTimeframe(value)}
									className={cn(
										"rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
										timeframe === value
											? "bg-(--deep-forest) text-(--pure-white)"
											: "text-(--medium-gray) hover:bg-(--light-gray)/50",
									)}
								>
									{value === "today" ? "Today" : "Yesterday"}
								</button>
							))}
						</div>
					</div>
				</div>
				<div className="overflow-x-auto p-2">
					{isLoading ? (
						<div className="flex items-center justify-center py-16">
							<span className="h-5 w-5 animate-spin rounded-full border-2 border-(--deep-forest) border-t-transparent" />
						</div>
					) : (
						<DataTable<ExpenseRow>
							columns={columns}
							data={expenses ?? []}
							pageSize={9999}
						/>
					)}
				</div>
			</div>

			<AddExpenseModal
				open={addModalOpen}
				onClose={() => setAddModalOpen(false)}
			/>

			<ExpenseEditModal
				expense={editingExpense}
				open={!!editingExpense}
				onClose={() => setEditingExpense(null)}
			/>

			<AlertDialog
				open={!!deletingExpense}
				onOpenChange={(open) => {
					if (!open) setDeletingExpense(null);
				}}
			>
				<AlertDialogContent size="sm">
					<AlertDialogHeader>
						<AlertDialogTitle>Delete cash log?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently remove this entry. This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							disabled={deleteMutation.isPending}
							onClick={async () => {
								if (!deletingExpense) return;
								await deleteMutation.mutateAsync(deletingExpense.expense_id);
								setDeletingExpense(null);
							}}
						>
							{deleteMutation.isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
