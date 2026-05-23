import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

import type { InventoryItem } from "@/features/admin/inventory/components/AddInventoryItem";
import { deleteMenuMutationOptions, createAddOnMutationOptions, deleteAddOnMutationOptions, updateAddOnMutationOptions } from "../mutationOptions";
import { getAllAddOnsQueryOptions } from "../queryOptions";
import type { MenuListItem } from "../types";
import type { AddOnFormInput } from "../schemas/add-on";
import type { AddOnItem } from "../types";
import { AddOnDeleteDialog } from "./AddOnDeleteDialog";
import { AddOnModal } from "./AddOnModal";
import { AddOnSection } from "./AddOnSection";
import { MenuDeleteDialog } from "./MenuDeleteDialog";
import { MenuModal } from "./MenuModal";
import { MenuSection } from "./MenuSection";

interface MenuManagerProps {
  menuItems: MenuListItem[];
  inventoryItems: InventoryItem[];
}

type Tab = "menu" | "add-ons";

function MenuManager({ menuItems, inventoryItems }: MenuManagerProps) {
  const [tab, setTab] = useState<Tab>("menu");
  const [menuModal, setMenuModal] = useState<
    { kind: "closed" } | { kind: "new" } | { kind: "edit"; item: MenuListItem }
  >({ kind: "closed" });
  const [deleteTarget, setDeleteTarget] = useState<MenuListItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addOnModal, setAddOnModal] = useState<
    { kind: "closed" } | { kind: "new" } | { kind: "edit"; item: AddOnItem }
  >({ kind: "closed" });
  const [addOnDeleteTarget, setAddOnDeleteTarget] = useState<AddOnItem | null>(null);
  const deleteMutation = useMutation(deleteMenuMutationOptions);
  const createAddOnMutation = useMutation(createAddOnMutationOptions);
  const deleteAddOnMutation = useMutation(deleteAddOnMutationOptions);
  const updateAddOnMutation = useMutation(updateAddOnMutationOptions);
  const { data: addOns, isLoading, isError, error, refetch } = useQuery(getAllAddOnsQueryOptions);

  const fuseIndex = useMemo(
    () =>
      new Fuse(menuItems, {
        keys: ["name", "menuInventories.inventoryName"],
        threshold: 0.3,
      }),
    [menuItems],
  );

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return menuItems;
    return fuseIndex.search(searchQuery).map((result) => result.item);
  }, [searchQuery, menuItems, fuseIndex]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync({ id: deleteTarget.id });
      setDeleteTarget(null);
    } catch {
      // Toasts are handled by the mutation options.
    }
  };

  const isSearching = searchQuery.trim().length > 0;

  const handleSaveAddOn = async (data: AddOnFormInput) => {
    if (addOnModal.kind === "edit") {
      await updateAddOnMutation.mutateAsync({
        id: addOnModal.item.id,
        name: data.name.trim(),
        amount: data.amount,
      });
    } else {
      await createAddOnMutation.mutateAsync({
        name: data.name.trim(),
        amount: data.amount,
      });
    }
    setAddOnModal({ kind: "closed" });
  };

  const handleDeleteAddOn = async () => {
    if (!addOnDeleteTarget) return;

    try {
      await deleteAddOnMutation.mutateAsync({ id: addOnDeleteTarget.id });
      setAddOnDeleteTarget(null);
    } catch {
      // Toasts are handled by the mutation options.
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6 flex gap-1.5 rounded-full bg-(--light-gray)/30 p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab("menu")}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-colors",
            tab === "menu"
              ? "bg-(--deep-forest) text-(--pure-white)"
              : "text-(--medium-gray) hover:bg-(--light-gray)/50",
          )}
        >
          Menu Items
        </button>
        <button
          type="button"
          onClick={() => setTab("add-ons")}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-colors",
            tab === "add-ons"
              ? "bg-(--deep-forest) text-(--pure-white)"
              : "text-(--medium-gray) hover:bg-(--light-gray)/50",
          )}
        >
          Add-ons
        </button>
      </div>

      {tab === "menu" && (
        <MenuSection
          items={filteredItems}
          searchQuery={searchQuery}
          isSearching={isSearching}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery("")}
          onAddClick={() => setMenuModal({ kind: "new" })}
          onEdit={(item) => setMenuModal({ kind: "edit", item })}
          onDelete={(item) => setDeleteTarget(item)}
        />
      )}

      {tab === "add-ons" && (
        <AddOnSection
          addOns={addOns ?? []}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
          onAddClick={() => setAddOnModal({ kind: "new" })}
          onEdit={(item) => setAddOnModal({ kind: "edit", item })}
          onDelete={(item) => setAddOnDeleteTarget(item)}
        />
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

      <AddOnModal
        open={addOnModal.kind !== "closed"}
        item={addOnModal.kind === "edit" ? addOnModal.item : null}
        onClose={() => setAddOnModal({ kind: "closed" })}
        onSave={handleSaveAddOn}
      />

      <AddOnDeleteDialog
        item={addOnDeleteTarget}
        open={Boolean(addOnDeleteTarget)}
        isPending={deleteAddOnMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setAddOnDeleteTarget(null);
        }}
        onConfirm={() => {
          void handleDeleteAddOn();
        }}
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
