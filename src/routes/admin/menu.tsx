import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MenuManager } from "@/features/admin/menu/components/MenuManager";
import { getAllMenuQueryOptions } from "@/features/admin/menu/queryOptions";
import { getAllInventoryQueryOptions } from "@/features/admin/inventory/queryOptions";

export const Route = createFileRoute("/admin/menu")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(getAllMenuQueryOptions);
    await queryClient.ensureQueryData(getAllInventoryQueryOptions);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: menuItems } = useSuspenseQuery(getAllMenuQueryOptions);
  const { data: inventoryItems } = useSuspenseQuery(
    getAllInventoryQueryOptions,
  );

  return <MenuManager menuItems={menuItems} inventoryItems={inventoryItems} />;
}
