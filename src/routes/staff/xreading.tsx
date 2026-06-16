import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	RouteErrorBoundary,
	RoutePendingBoundary,
} from "@/components/route-boundaries";
import { XReadingScreen } from "@/features/staff/xreading/components/XReadingScreen";
import { getDailyReconciliationQueryOptions } from "@/features/staff/xreading/queryOptions";

import { z } from "zod";

const searchSchema = z.object({
	date: z.enum(["today", "yesterday"]).optional().default("today"),
});

export const Route = createFileRoute("/staff/xreading")({
	validateSearch: searchSchema,
	loaderDeps: ({ search: { date } }) => ({ date }),
	loader: async ({ context: { queryClient }, deps: { date } }) => {
		await queryClient.ensureQueryData(getDailyReconciliationQueryOptions(date));
	},
	pendingComponent: RoutePendingBoundary,
	errorComponent: RouteErrorBoundary,
	component: StaffXReading,
});

function StaffXReading() {
	const { date } = Route.useSearch();
	const { data: reconciliationData } = useSuspenseQuery(
		getDailyReconciliationQueryOptions(date),
	);

	return (
		<div className="min-h-screen bg-(--pale-yellow)/30">
			<main className="mx-auto max-w-screen-2xl p-2 sm:p-3 lg:p-4">
				<XReadingScreen date={date} data={reconciliationData} />
			</main>
		</div>
	);
}
