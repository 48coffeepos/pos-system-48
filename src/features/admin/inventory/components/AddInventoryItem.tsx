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

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  adminStock: number;
  type: "STANDALONE" | "CUP";
  costPrice: number;
}

interface AddInventoryItemProps {
  editingItem?: InventoryItem | null;
  onCancelEdit?: () => void;
  activeTab?: "storefront" | "admin";
}

const itemTypeOptions = [
  {
    value: "STANDALONE" as const,
    label: "Standalone Item (e.g., Sprite, Coke)",
  },
  {
    value: "CUP" as const,
    label: "Cup (e.g., 12oz (Hot), 16oz (Cold))",
  },
];

function AddInventoryItem({ editingItem, onCancelEdit, activeTab = "storefront" }: AddInventoryItemProps) {
  const isEditing = !!editingItem;

  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState<"STANDALONE" | "CUP">("STANDALONE");
  const [quantity, setQuantity] = useState<number>(0);
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

  useEffect(() => {
    if (editingItem) {
      setItemName(editingItem.name);
      setItemType(editingItem.type);
      setQuantity(activeTab === "admin" ? editingItem.adminStock : editingItem.stock);
      setCostPrice(editingItem.costPrice);
    }
  }, [editingItem, activeTab]);

  function resetForm() {
    setItemName("");
    setItemType("STANDALONE");
    setQuantity(0);
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
          ? { adminStock: quantity }
          : { stock: quantity }),
        costPrice,
      });
    } else {
      createMutation.mutate({
        name: itemName.trim(),
        stock: quantity,
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
            onChange={(e) => setItemType(e.target.value as "STANDALONE" | "CUP")}
            className="h-10 w-full rounded-xl border border-(--light-gray) bg-(--pure-white) px-3 text-sm text-(--dark-gray) outline-none transition-[color,box-shadow] focus-visible:border-(--deep-forest) focus-visible:ring-2 focus-visible:ring-(--deep-forest)/20"
          >
            {itemTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-(--dark-gray)">
              {isEditing && activeTab === "admin" ? "Admin Stock" : isEditing ? "Stock" : "Quantity"}
            </label>
            <p className="text-xs text-(--medium-gray)">{String(quantity).length} / 5</p>
          </div>
          <Input
            type="text"
            inputMode="numeric"
            value={quantity}
            onChange={(e) => {
              let val = e.target.value.replace(/[^0-9]/g, "");
              val = val.slice(0, 5);
              setQuantity(val === "" ? 0 : Number(val));
            }}
            placeholder="0"
            maxLength={5}
            className="h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
          />
        </div>

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
              disabled={!isFormValid() || isPending}
              className={cn(
                "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all",
                isFormValid() && !isPending
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
