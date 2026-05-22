import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import {
  RouteErrorBoundary,
  RoutePendingBoundary,
} from "@/components/route-boundaries";
import { MenuManager } from "@/features/admin/menu/components/MenuManager";
import { getAllMenuQueryOptions, getAllAddOnsQueryOptions } from "@/features/admin/menu/queryOptions";
import { getAllInventoryQueryOptions } from "@/features/admin/inventory/queryOptions";

export const Route = createFileRoute("/admin/menu")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(getAllMenuQueryOptions);
    await queryClient.ensureQueryData(getAllAddOnsQueryOptions);
    await queryClient.ensureQueryData(getAllInventoryQueryOptions);
  },
  pendingComponent: RoutePendingBoundary,
  errorComponent: RouteErrorBoundary,
  component: RouteComponent,
});

function RouteComponent() {
  const { data: menuItems } = useSuspenseQuery(getAllMenuQueryOptions);
  const { data: inventoryItems } = useSuspenseQuery(
    getAllInventoryQueryOptions,
  );

  return <MenuManager menuItems={menuItems} inventoryItems={inventoryItems} />;
}
