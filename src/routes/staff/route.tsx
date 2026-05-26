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
		<main className="h-dvh grid grid-rows-[auto_1fr]">
			<StaffHeader />
			<div className="overflow-y-auto">
				<Outlet />
			</div>
		</main>
	);
}
