import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { sessionQueryOptions } from "@/features/auth/queryOptions";
import { StaffHeader } from "@/features/staff/components/StaffHeader";

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
		<main className="h-dvh flex flex-col">
			<StaffHeader />
			<div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
				<Outlet />
			</div>
		</main>
	);
}
