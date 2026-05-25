import { createFileRoute } from "@tanstack/react-router";

import { AdminOrdersScreen } from "@/features/admin/orders/components/AdminOrdersScreen";
import {
  RoutePendingBoundary,
  RouteErrorBoundary,
} from "@/components/route-boundaries";

export const Route = createFileRoute("/admin/orders")({
  pendingComponent: RoutePendingBoundary,
  errorComponent: RouteErrorBoundary,
  component: AdminOrdersRoute,
});

function AdminOrdersRoute() {
  return <AdminOrdersScreen />;
}
