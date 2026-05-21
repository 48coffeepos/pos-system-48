import { CoffeeIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import type { InventoryItem } from "@/features/admin/inventory/components/AddInventoryItem";
import { deleteMenuMutationOptions } from "../mutationOptions";
import type { MenuListItem } from "../types";
import { MenuDeleteDialog } from "./MenuDeleteDialog";
import { MenuGrid } from "./MenuGrid";
import { MenuModal } from "./MenuModal";

interface MenuManagerProps {
  menuItems: MenuListItem[];
  inventoryItems: InventoryItem[];
}

function MenuManager({ menuItems, inventoryItems }: MenuManagerProps) {
  const [menuModal, setMenuModal] = useState<
    | { kind: "closed" }
    | { kind: "new" }
    | { kind: "edit"; item: MenuListItem }
  >({ kind: "closed" });
  const [deleteTarget, setDeleteTarget] = useState<MenuListItem | null>(null);
  const deleteMutation = useMutation(deleteMenuMutationOptions);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync({ id: deleteTarget.id });
      setDeleteTarget(null);
    } catch {
      // Toasts are handled by the mutation options.
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--deep-forest)">
            Menu Items
          </h1>
          <p className="mt-1 text-sm text-(--medium-gray)">
            Manage your coffee shop menu
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMenuModal({ kind: "new" })}
          className="btn-primary flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs"
        >
          <PlusIcon weight="bold" className="h-4 w-4" /> Add menu item
        </button>
      </div>

      {menuItems.length > 0 ? (
        <MenuGrid
          items={menuItems}
          onEdit={(item) => setMenuModal({ kind: "edit", item })}
          onDelete={(item) => setDeleteTarget(item)}
        />
      ) : (
        <div className="flex h-64 flex-col items-center justify-center">
          <CoffeeIcon
            weight="bold"
            className="mb-3 h-12 w-12 text-(--medium-gray)"
          />
          <p className="text-sm text-(--medium-gray)">No menu items yet</p>
          <button
            type="button"
            onClick={() => setMenuModal({ kind: "new" })}
            className="mt-4 rounded-xl border border-(--light-gray) px-5 py-2.5 text-sm font-semibold text-(--deep-forest) transition-colors hover:bg-(--off-white)"
          >
            Add your first item
          </button>
        </div>
      )}

      <MenuModal
        key={
          menuModal.kind === "edit"
            ? `edit-${menuModal.item.id}`
            : menuModal.kind
        }
        inventoryItems={inventoryItems}
        modal={menuModal}
        onClose={() => setMenuModal({ kind: "closed" })}
      />

      <MenuDeleteDialog
        item={deleteTarget}
        open={Boolean(deleteTarget)}
        isPending={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </div>
  );
}

export { MenuManager };
