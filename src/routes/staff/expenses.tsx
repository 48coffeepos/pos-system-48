import { createFileRoute } from "@tanstack/react-router";
import { StaffHeader } from "@/features/staff/components/StaffHeader";
import { CurrencyDollar } from "@phosphor-icons/react";

export const Route = createFileRoute("/staff/expenses")({
	component: StaffExpenses,
});

function StaffExpenses() {
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
						<h1 className="text-2xl font-bold text-(--deep-forest)">
							Expenses
						</h1>
						<p className="mt-0.5 text-sm text-(--medium-gray)">
							Record and monitor daily expenses.
						</p>
					</div>
				</div>
				<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-8 text-center">
					<CurrencyDollar className="mx-auto size-12 text-(--medium-gray)/40" />
					<h2 className="mt-4 text-lg font-semibold text-(--deep-forest)">
						No expenses recorded yet
					</h2>
					<p className="mt-1 text-sm text-(--medium-gray)">
						Expense tracking coming soon.
					</p>
				</div>
			</main>
		</div>
	);
}
