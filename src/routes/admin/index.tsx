import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardScreen } from "@/features/admin/dashboard/components/AdminDashboardScreen";
import { getDashboardDataQueryOptions } from "@/features/admin/dashboard/queryOptions";
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
    ]);
  },
  pendingComponent: RoutePendingBoundary,
  errorComponent: RouteErrorBoundary,
  component: AdminDashboard,
});

function AdminDashboard() {
  return <AdminDashboardScreen />;
}
