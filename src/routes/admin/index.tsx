import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
	component: AdminDashboard,
});

function AdminDashboard() {
	return (
		<div className="min-h-screen">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-(--deep-forest)">Dashboard</h1>
				<p className="mt-1 text-sm text-(--medium-gray)">
					Welcome to the admin panel. Manage your coffee shop from here.
				</p>
			</div>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6">
					<p className="text-sm font-medium text-(--medium-gray)">
						Total Orders
					</p>
					<p className="mt-2 text-3xl font-bold text-(--deep-forest)">—</p>
				</div>
				<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6">
					<p className="text-sm font-medium text-(--medium-gray)">Menu Items</p>
					<p className="mt-2 text-3xl font-bold text-(--deep-forest)">—</p>
				</div>
				<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6">
					<p className="text-sm font-medium text-(--medium-gray)">Inventory</p>
					<p className="mt-2 text-3xl font-bold text-(--deep-forest)">—</p>
				</div>
				<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6">
					<p className="text-sm font-medium text-(--medium-gray)">Accounts</p>
					<p className="mt-2 text-3xl font-bold text-(--deep-forest)">—</p>
				</div>
			</div>
		</div>
	);
}
