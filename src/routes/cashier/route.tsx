import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { sessionQueryOptions } from "@/features/auth/queryOptions";
import { CashierHeader } from "./CashierHeader";

export const Route = createFileRoute("/cashier")({
	component: RouteComponent,
	loader: async ({ context }) => {
		const currentUser =
			await context.queryClient.ensureQueryData(sessionQueryOptions);
		if (!currentUser) {
			throw redirect({
				to: "/",
			});
		}
	},
});

function RouteComponent() {
	return (
		<main className="min-h-screen">
			<CashierHeader />
			<Outlet />
		</main>
	);
}
