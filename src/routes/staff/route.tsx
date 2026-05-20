import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { sessionQueryOptions } from "@/features/auth/queryOptions";

export const Route = createFileRoute("/staff")({
	component: StaffLayout,
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

function StaffLayout() {
	return (
		<div className="min-h-screen">
			<Outlet />
		</div>
	);
}
