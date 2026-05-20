import { createFileRoute, redirect } from "@tanstack/react-router";
import LogInPage from "@/features/auth/components/LogInPage";
import { sessionQueryOptions } from "@/features/auth/queryOptions";
import { getAuthRedirectPath } from "@/features/auth/utils";

export const Route = createFileRoute("/")({
	loader: async ({ context }) => {
		const session = await context.queryClient.fetchQuery(sessionQueryOptions);
		if (session?.user) {
			throw redirect({
				to: getAuthRedirectPath(session.user.role),
			});
		}
	},
	component: LogInPage,
});
