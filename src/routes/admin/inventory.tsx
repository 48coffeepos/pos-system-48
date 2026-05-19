import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { AdminHeader } from "@/feature/admin/components/AdminHeader";
import { AddInventoryItem } from "@/feature/admin/inventory/components/AddInventoryItem";
import type { InventoryItem } from "@/feature/admin/inventory/components/AddInventoryItem";
import { InventoryList } from "@/feature/admin/inventory/components/InventoryList";
import { getAllInventoryQueryOptions } from "@/feature/admin/inventory/queryOptions";

export const Route = createFileRoute("/admin/inventory")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(getAllInventoryQueryOptions);
  },
  component: AdminInventory,
});

function AdminInventory() {
  const { data: inventoryItems } = useSuspenseQuery(getAllInventoryQueryOptions);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  return (
    <div className="min-h-screen">
      <AdminHeader />
      <main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]"> 
          {/* Inventory List Area */}
          <div>
            <InventoryList items={inventoryItems} onEdit={setEditingItem} />
          </div>

          {/* Add Inventory Card */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <AddInventoryItem
              items={inventoryItems}
              editingItem={editingItem}
              onCancelEdit={() => setEditingItem(null)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
