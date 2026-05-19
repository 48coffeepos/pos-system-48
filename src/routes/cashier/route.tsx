import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { sessionQueryOptions } from "@/features/auth/queryOptions";

export const Route = createFileRoute("/cashier")({
	component: RouteComponent,
	loader: async ({ context }) => {
		const session = await context.queryClient.fetchQuery(sessionQueryOptions);
		if (!session?.user) {
			throw redirect({
				to: "/",
			});
		}
	},
});

function RouteComponent() {
	return (
		<main>
			<SignOutButton />
			<Outlet />
		</main>
	);
}
