import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardScreen } from "@/features/admin/dashboard/components/AdminDashboardScreen";
import { getDashboardDataQueryOptions, getAvailableMonthsQueryOptions } from "@/features/admin/dashboard/queryOptions";
import { getTodayOrdersQueryOptions } from "@/features/admin/orders/queryOptions";
import {
  RoutePendingBoundary,
  RouteErrorBoundary,
} from "@/components/route-boundaries";

export const Route = createFileRoute("/admin/")({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(getDashboardDataQueryOptions),
      queryClient.ensureQueryData(getTodayOrdersQueryOptions),
      queryClient.ensureQueryData(getAvailableMonthsQueryOptions),
    ]);
  },
  pendingComponent: RoutePendingBoundary,
  errorComponent: RouteErrorBoundary,
  component: AdminDashboard,
});

function AdminDashboard() {
  return <AdminDashboardScreen />;
}
