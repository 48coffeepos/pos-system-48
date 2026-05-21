import { createFileRoute } from "@tanstack/react-router";
import {
	RouteErrorBoundary,
	RoutePendingBoundary,
} from "@/components/route-boundaries";
import { XReadingScreen } from "@/features/staff/xreading/components/XReadingScreen";
import { getDailyReconciliationQueryOptions } from "@/features/staff/xreading/queryOptions";

export const Route = createFileRoute("/staff/xreading")({
	loader: async ({ context: { queryClient } }) => {
		return queryClient.ensureQueryData(getDailyReconciliationQueryOptions());
	},
	pendingComponent: RoutePendingBoundary,
	errorComponent: RouteErrorBoundary,
	component: StaffXReading,
});

function StaffXReading() {
	const reconciliationData = Route.useLoaderData();

	return (
		<div className="min-h-screen bg-(--pale-yellow)/30">
			<main className="mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8">
				<XReadingScreen data={reconciliationData} />
			</main>
		</div>
	);
}
