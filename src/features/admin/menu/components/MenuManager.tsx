import {
  CoffeeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XIcon,
} from "@phosphor-icons/react";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

import type { InventoryItem } from "@/features/admin/inventory/components/AddInventoryItem";
import { Input } from "@/components/ui/input";
import { deleteMenuMutationOptions, createAddOnMutationOptions } from "../mutationOptions";
import { getAllAddOnsQueryOptions } from "../queryOptions";
import type { MenuListItem } from "../types";
import type { AddOnFormInput } from "../schemas/add-on";
import { AddOnModal } from "./AddOnModal";
import { AddOnSection } from "./AddOnSection";
import { MenuDeleteDialog } from "./MenuDeleteDialog";
import { MenuGrid } from "./MenuGrid";
import { MenuModal } from "./MenuModal";

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
  const [addOnModalOpen, setAddOnModalOpen] = useState(false);
  const deleteMutation = useMutation(deleteMenuMutationOptions);
  const createAddOnMutation = useMutation(createAddOnMutationOptions);
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

  const hasSearchResults = filteredItems.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  const handleSaveAddOn = async (data: AddOnFormInput) => {
    await createAddOnMutation.mutateAsync({
      name: data.name.trim(),
      amount: data.amount,
    });
    setAddOnModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--deep-forest)">
            Menu Items
          </h1>
          <p className="mt-1 text-sm text-(--medium-gray)">
            Manage your coffee shop menu
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon
              weight="bold"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--medium-gray)"
            />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu or inventory..."
              className="h-10 w-64 rounded-full border-(--light-gray) bg-(--pure-white) pl-9 pr-8 text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-(--medium-gray) transition-colors hover:text-(--dark-gray)"
                aria-label="Clear search"
              >
                <XIcon weight="bold" className="size-3" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuModal({ kind: "new" })}
            className="btn-primary flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs"
          >
            <PlusIcon weight="bold" className="h-4 w-4" /> Add menu item
          </button>
        </div>
      </div>

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

      {tab === "add-ons" && (
        <AddOnSection
          addOns={addOns ?? []}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
          onAddClick={() => setAddOnModalOpen(true)}
        />
      )}

      {tab === "menu" &&
        (menuItems.length > 0 ? (
          hasSearchResults ? (
            <MenuGrid
              items={filteredItems}
              onEdit={(item) => setMenuModal({ kind: "edit", item })}
              onDelete={(item) => setDeleteTarget(item)}
            />
          ) : isSearching ? (
            <div className="flex h-64 flex-col items-center justify-center">
              <MagnifyingGlassIcon
                weight="bold"
                className="mb-3 h-12 w-12 text-(--medium-gray)"
              />
              <p className="text-sm text-(--medium-gray)">
                No results for "{searchQuery}"
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 rounded-xl border border-(--light-gray) px-5 py-2.5 text-sm font-semibold text-(--deep-forest) transition-colors hover:bg-(--off-white)"
              >
                Clear search
              </button>
            </div>
          ) : null
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
        ))}

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
        open={addOnModalOpen}
        onClose={() => setAddOnModalOpen(false)}
        onSave={handleSaveAddOn}
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
