import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminHeader } from "@/feature/admin/components/AdminHeader";
import { sessionQueryOptions } from "@/features/auth/queryOptions";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
	loader: async ({ context }) => {
		const session = await context.queryClient.fetchQuery(sessionQueryOptions);
		if (!session?.user) {
			throw redirect({
				to: "/",
			});
		}

		if (session.user.role !== "admin") {
			throw redirect({
				to: "/cashier/pos",
			});
		}
	},
});

function AdminLayout() {
	return (
		<div className="min-h-screen">
			<AdminHeader />
			<div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
				<Outlet />
			</div>
		</div>
	);
}
