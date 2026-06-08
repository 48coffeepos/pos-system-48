"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon, NotePencilIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  createInventoryItemMutationOptions,
  updateInventoryItemMutationOptions,
} from "../mutationOptions";
import type { InventoryItem, InventoryItemType } from "../types";

export type { InventoryItem };

interface AddInventoryItemProps {
  editingItem?: InventoryItem | null;
  onCancelEdit?: () => void;
  activeTab?: "storefront" | "admin";
}

const itemTypeOptions: Array<{ value: InventoryItemType; label: string }> = [
  {
    value: "STANDALONE",
    label: "Standalone Item (e.g., Sprite, Coke)",
  },
  {
    value: "CUP",
    label: "Cup (e.g., 12oz (Hot), 16oz (Cold))",
  },
  {
    value: "SUPPLIES",
    label: "Supplies (manual daily usage, not linked to menu)",
  },
];

function AddInventoryItem({ editingItem, onCancelEdit, activeTab = "storefront" }: AddInventoryItemProps) {
  const isEditing = !!editingItem;

  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState<InventoryItemType>("STANDALONE");
  const [inAdmin, setInAdmin] = useState<number>(0);
  const [outAdmin, setOutAdmin] = useState<number>(0);
  const [inStore, setInStore] = useState<number>(0);
  const [outStore, setOutStore] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);

  const createMutation = useMutation({
    ...createInventoryItemMutationOptions,
    onSettled: () => {
      resetForm();
    },
  });

  const updateMutation = useMutation({
    ...updateInventoryItemMutationOptions,
    onSettled: () => {
      resetForm();
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const newEndingAdmin = isEditing && editingItem && activeTab === "admin"
    ? editingItem.beginningAdmin + inAdmin - outAdmin
    : 0;
  const hasPositiveDelta = isEditing && activeTab === "admin" && inAdmin > (editingItem?.inAdmin ?? 0);

  const newEndingStore = isEditing && editingItem && activeTab === "storefront"
    ? editingItem.beginningStore + inStore - outStore
    : 0;
  useEffect(() => {
    if (editingItem) {
      setItemName(editingItem.name);
      setItemType(editingItem.type);
      setInAdmin(activeTab === "admin" ? editingItem.inAdmin : 0);
      setOutAdmin(activeTab === "admin" ? editingItem.outAdmin : 0);
      setInStore(activeTab === "storefront" ? editingItem.inStore : 0);
      setOutStore(activeTab === "storefront" ? editingItem.outStore : 0);
      setCostPrice(editingItem.costPrice);
    }
  }, [editingItem, activeTab]);

  function resetForm() {
    setItemName("");
    setItemType("STANDALONE");
    setInAdmin(0);
    setOutAdmin(0);
    setInStore(0);
    setOutStore(0);
    setCostPrice(0);
    onCancelEdit?.();
  }

  function isFormValid() {
    return itemName.trim().length > 0;
  }

  function handleSubmit() {
    if (isEditing && editingItem) {
      updateMutation.mutate({
        id: editingItem.id,
        name: itemName.trim(),
        type: itemType,
          ...(activeTab === "admin"
            ? { inAdmin, outAdmin }
            : { inStore, outStore }),
        costPrice,
      });
    } else {
      createMutation.mutate({
        name: itemName.trim(),
        type: itemType,
        costPrice,
      });
    }
  }

  return (
    <div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) shadow-sm" style={{ overflow: "clip" }}>
      <div className="flex items-center gap-3 border-b border-(--light-gray) px-6 py-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-(--pale-yellow)">
          {isEditing ? (
            <NotePencilIcon weight="bold" className="size-5 text-(--deep-forest)" />
          ) : (
            <PlusIcon weight="bold" className="size-5 text-(--deep-forest)" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-(--deep-forest)">
            {isEditing ? "Edit Item" : "Add New Item"}
          </h3>
          <p className="text-sm text-(--medium-gray)">
            {isEditing ? "Update item details" : "Add a new inventory item"}
          </p>
        </div>
      </div>

      <div className="space-y-5 px-6 py-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-(--dark-gray)">Item Name</label>
            <p className="text-xs text-(--medium-gray)">{itemName.length} / 20</p>
          </div>
          <Input
            value={itemName}
            onChange={(e) => setItemName(e.target.value.slice(0, 20))}
            maxLength={20}
            placeholder="e.g. 12oz (Hot), Coke"
            className="h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-(--dark-gray)">Item Type</label>
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value as InventoryItemType)}
            className="h-10 w-full rounded-xl border border-(--light-gray) bg-(--pure-white) px-3 text-sm text-(--dark-gray) outline-none transition-[color,box-shadow] focus-visible:border-(--deep-forest) focus-visible:ring-2 focus-visible:ring-(--deep-forest)/20"
          >
            {itemTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {isEditing && activeTab === "admin" ? (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-(--dark-gray)">Admin Stock (auto)</label>
              <div className="flex h-10 items-center rounded-xl border border-(--light-gray) bg-(--light-gray)/20 px-3 text-sm text-(--medium-gray)">
                {newEndingAdmin}
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-(--dark-gray)">In Admin</label>
                <p className="text-xs text-(--medium-gray)">{String(inAdmin).length} / 5</p>
              </div>
              <Input
                type="number"
                min={0}
                max={99999}
                step={1}
                value={inAdmin}
                onChange={(e) => {
                  const val = e.target.valueAsNumber;
                  setInAdmin(Number.isNaN(val) ? 0 : Math.min(99999, Math.max(0, Math.floor(val))));
                }}
                placeholder="0"
                className="h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
              />
              {hasPositiveDelta && (
              <p className="text-xs font-medium text-red-600">
                Use "Add Stock" to increase stock.
              </p>
            )}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-(--dark-gray)">Out Admin</label>
                <p className="text-xs text-(--medium-gray)">{String(outAdmin).length} / 5</p>
              </div>
              <Input
                type="number"
                min={0}
                max={99999}
                step={1}
                value={outAdmin}
                onChange={(e) => {
                  const val = e.target.valueAsNumber;
                  setOutAdmin(Number.isNaN(val) ? 0 : Math.min(99999, Math.max(0, Math.floor(val))));
                }}
                placeholder="0"
                className="h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
              />
            </div>

          </>
        ) : isEditing ? (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-(--dark-gray)">Store Stock (auto)</label>
              <div className="flex h-10 items-center rounded-xl border border-(--light-gray) bg-(--light-gray)/20 px-3 text-sm text-(--medium-gray)">
                {newEndingStore}
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-(--dark-gray)">In Store</label>
                <p className="text-xs text-(--medium-gray)">{String(inStore).length} / 5</p>
              </div>
              <Input
                type="number"
                min={0}
                max={99999}
                step={1}
                value={inStore}
                onChange={(e) => {
                  const val = e.target.valueAsNumber;
                  setInStore(Number.isNaN(val) ? 0 : Math.min(99999, Math.max(0, Math.floor(val))));
                }}
                placeholder="0"
                className="h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-(--dark-gray)">Out Store</label>
                <p className="text-xs text-(--medium-gray)">{String(outStore).length} / 5</p>
              </div>
              <Input
                type="number"
                min={0}
                max={99999}
                step={1}
                value={outStore}
                onChange={(e) => {
                  const val = e.target.valueAsNumber;
                  setOutStore(Number.isNaN(val) ? 0 : Math.min(99999, Math.max(0, Math.floor(val))));
                }}
                placeholder="0"
                className="h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
              />
            </div>
          </>
        ) : null}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-(--dark-gray)">Cost Price (₱)</label>
          <Input
            type="text"
            inputMode="decimal"
            value={costPrice || ""}
            onChange={(e) => {
              let val = e.target.value.replace(/[^0-9.]/g, "");
              const parts = val.split(".");
              if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("");
              if (parts[1]?.length > 2) val = parts[0] + "." + parts[1].slice(0, 2);
              setCostPrice(val === "" ? 0 : Number(val));
            }}
            placeholder="0.00"
            className="h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
          />
        </div>
      </div>

      <div className="border-t border-(--light-gray) px-6 py-4">
        {isEditing ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetForm}
              disabled={isPending}
              className={cn(
                "flex h-11 flex-1 items-center justify-center rounded-xl text-sm font-semibold transition-all",
                "border border-(--light-gray) bg-(--pure-white) text-(--medium-gray) hover:bg-(--light-gray)/20 active:scale-[0.98]",
              )}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid() || hasPositiveDelta || isPending}
              className={cn(
                "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all",
                isFormValid() && !hasPositiveDelta && !isPending
                  ? "bg-(--deep-forest) text-(--pure-white) hover:bg-(--forest-green) active:scale-[0.98]"
                  : "cursor-not-allowed bg-(--light-gray) text-(--medium-gray)",
              )}
            >
              <NotePencilIcon weight="bold" className="size-4" />
              {isPending ? "Saving..." : "Save Changes"}

            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid() || isPending}
            className={cn(
              "flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all",
              isFormValid() && !isPending
                ? "bg-(--deep-forest) text-(--pure-white) hover:bg-(--forest-green) active:scale-[0.98]"
                : "cursor-not-allowed bg-(--light-gray) text-(--medium-gray)",
            )}
          >
            <PlusIcon weight="bold" className="size-4" />
            {isPending ? "Creating..." : "Create Item"}
          </button>
        )}
      </div>
    </div>
  );
}

export { AddInventoryItem };
export type { AddInventoryItemProps };
