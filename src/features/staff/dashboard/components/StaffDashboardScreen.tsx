import { useStore } from "@tanstack/react-form";
import { useAppForm } from "@/integrations/tanstack-form";
import { StaffHeader } from "@/features/staff/components/StaffHeader";
import {
	dashboardFilterSchema,
	defaultDashboardFilterValues,
} from "../schemas/dashboardFilter";

export function StaffDashboardScreen() {
	const form = useAppForm({
		defaultValues: defaultDashboardFilterValues(),
		validators: {
			onChange: dashboardFilterSchema,
		},
	});

	const period = useStore(form.store, (state) => state.values.period);

	return (
		<div className="min-h-screen">
			<StaffHeader />
			<main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
				<form.AppForm>
					<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h1 className="text-2xl font-bold text-[var(--deep-forest)]">
								Dashboard
							</h1>
							<p className="mt-1 text-sm text-[var(--medium-gray)]">
								Welcome to the staff panel. Manage orders and track sales.
							</p>
						</div>
						<form.AppField name="period">
							{(field) => (
								<field.Select
									label="Period"
									options={[
										{ value: "today", label: "Today" },
										{ value: "week", label: "This week" },
									]}
								/>
							)}
						</form.AppField>
					</div>
				</form.AppForm>

				<p className="mb-6 text-xs text-(--medium-gray)">
					Showing stats for:{" "}
					<span className="font-semibold text-(--deep-forest)">
						{period === "today" ? "Today" : "This week"}
					</span>
				</p>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					<div className="rounded-2xl border border-[var(--light-gray)] bg-[var(--pure-white)] p-6">
						<p className="text-sm font-medium text-[var(--medium-gray)]">
							Today&apos;s Sales
						</p>
						<p className="mt-2 text-3xl font-bold text-[var(--deep-forest)]">—</p>
					</div>
					<div className="rounded-2xl border border-[var(--light-gray)] bg-[var(--pure-white)] p-6">
						<p className="text-sm font-medium text-[var(--medium-gray)]">
							Pending Orders
						</p>
						<p className="mt-2 text-3xl font-bold text-[var(--deep-forest)]">—</p>
					</div>
					<div className="rounded-2xl border border-[var(--light-gray)] bg-[var(--pure-white)] p-6">
						<p className="text-sm font-medium text-[var(--medium-gray)]">
							Inventory Alerts
						</p>
						<p className="mt-2 text-3xl font-bold text-[var(--deep-forest)]">—</p>
					</div>
					<div className="rounded-2xl border border-[var(--light-gray)] bg-[var(--pure-white)] p-6">
						<p className="text-sm font-medium text-[var(--medium-gray)]">
							Expenses Today
						</p>
						<p className="mt-2 text-3xl font-bold text-[var(--deep-forest)]">—</p>
					</div>
				</div>
			</main>
		</div>
	);
}
