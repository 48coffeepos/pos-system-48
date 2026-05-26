import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	RouteErrorBoundary,
	RoutePendingBoundary,
} from "@/components/route-boundaries";
import { XReadingScreen } from "@/features/staff/xreading/components/XReadingScreen";
import { getDailyReconciliationQueryOptions } from "@/features/staff/xreading/queryOptions";

export const Route = createFileRoute("/staff/xreading")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(getDailyReconciliationQueryOptions());
	},
	pendingComponent: RoutePendingBoundary,
	errorComponent: RouteErrorBoundary,
	component: StaffXReading,
});

function StaffXReading() {
	const { data: reconciliationData } = useSuspenseQuery(
		getDailyReconciliationQueryOptions(),
	);

	return (
		<div className="min-h-screen bg-(--pale-yellow)/30">
			<main className="mx-auto max-w-screen-2xl p-2 sm:p-3 lg:p-4">
				<XReadingScreen data={reconciliationData} />
			</main>
		</div>
	);
}
