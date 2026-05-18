import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/feature/admin/inventory/components/AdminHeader";
import { Package } from "@phosphor-icons/react";

export const Route = createFileRoute("/admin/inventory")({
  component: AdminInventory,
});

function AdminInventory() {
  return (
    <div className="min-h-screen">
      <AdminHeader />
      <main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-(--deep-forest)">
            <Package weight="fill" className="size-5 text-(--pale-yellow)" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-(--deep-forest)">
              Inventory
            </h1>
            <p className="mt-0.5 text-sm text-(--medium-gray)">
              Manage your stock and supplies.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-8 text-center">
          <Package className="mx-auto size-12 text-(--medium-gray)/40" />
          <h2 className="mt-4 text-lg font-semibold text-(--deep-forest)">
            No inventory items yet
          </h2>
          <p className="mt-1 text-sm text-(--medium-gray)">
            Start adding your coffee beans, milk, syrups, and other supplies.
          </p>
        </div>
      </main>
    </div>
  );
}
