import { createFileRoute } from "@tanstack/react-router";
import { StaffHeader } from "@/features/staff/components/StaffHeader";

export const Route = createFileRoute("/staff/")({
	component: StaffDashboard,
});

function StaffDashboard() {
	return (
		<div className="min-h-screen">
			<StaffHeader />
			<main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-[var(--deep-forest)]">
						Dashboard
					</h1>
					<p className="mt-1 text-sm text-[var(--medium-gray)]">
						Welcome to the staff panel. Manage orders and track sales.
					</p>
				</div>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					<div className="rounded-2xl border border-[var(--light-gray)] bg-[var(--pure-white)] p-6">
						<p className="text-sm font-medium text-[var(--medium-gray)]">
							Today's Sales
						</p>
						<p className="mt-2 text-3xl font-bold text-[var(--deep-forest)]">
							—
						</p>
					</div>
					<div className="rounded-2xl border border-[var(--light-gray)] bg-[var(--pure-white)] p-6">
						<p className="text-sm font-medium text-[var(--medium-gray)]">
							Pending Orders
						</p>
						<p className="mt-2 text-3xl font-bold text-[var(--deep-forest)]">
							—
						</p>
					</div>
					<div className="rounded-2xl border border-[var(--light-gray)] bg-[var(--pure-white)] p-6">
						<p className="text-sm font-medium text-[var(--medium-gray)]">
							Inventory Alerts
						</p>
						<p className="mt-2 text-3xl font-bold text-[var(--deep-forest)]">
							—
						</p>
					</div>
					<div className="rounded-2xl border border-[var(--light-gray)] bg-[var(--pure-white)] p-6">
						<p className="text-sm font-medium text-[var(--medium-gray)]">
							Expenses Today
						</p>
						<p className="mt-2 text-3xl font-bold text-[var(--deep-forest)]">
							—
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
