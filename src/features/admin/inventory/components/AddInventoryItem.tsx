"use client";

import { NotePencilIcon, PlusIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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

const MAX_ITEM_NAME_LENGTH = 100;

function AddInventoryItem({
  editingItem,
  onCancelEdit,
  activeTab = "storefront",
}: AddInventoryItemProps) {
  const isEditing = !!editingItem;

  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState<InventoryItemType>("STANDALONE");
  const [inAdmin, setInAdmin] = useState<number>(0);
  const [inAdminRaw, setInAdminRaw] = useState("0");
  const [outAdmin, setOutAdmin] = useState<number>(0);
  const [outAdminRaw, setOutAdminRaw] = useState("0");
  const [inStore, setInStore] = useState<number>(0);
  const [inStoreRaw, setInStoreRaw] = useState("0");
  const [outStore, setOutStore] = useState<number>(0);
  const [outStoreRaw, setOutStoreRaw] = useState("0");
  const [costPrice, setCostPrice] = useState<number>(0);
  const [costPriceRaw, setCostPriceRaw] = useState("0");

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

  const newEndingAdmin =
    isEditing && editingItem && activeTab === "admin"
      ? editingItem.beginningAdmin + inAdmin - outAdmin
      : 0;
  const hasPositiveDelta =
    isEditing && activeTab === "admin" && inAdmin > (editingItem?.inAdmin ?? 0);

  const newEndingStore =
    isEditing && editingItem && activeTab === "storefront"
      ? editingItem.beginningStore + inStore - outStore
      : 0;
  useEffect(() => {
    if (editingItem) {
      const ia = activeTab === "admin" ? editingItem.inAdmin : 0;
      const oa = activeTab === "admin" ? editingItem.outAdmin : 0;
      const is_ = activeTab === "storefront" ? editingItem.inStore : 0;
      const os_ = activeTab === "storefront" ? editingItem.outStore : 0;
      setItemName(editingItem.name);
      setItemType(editingItem.type);
      setInAdmin(ia);
      setInAdminRaw(String(ia));
      setOutAdmin(oa);
      setOutAdminRaw(String(oa));
      setInStore(is_);
      setInStoreRaw(String(is_));
      setOutStore(os_);
      setOutStoreRaw(String(os_));
      setCostPrice(editingItem.costPrice);
      setCostPriceRaw(String(editingItem.costPrice));
    }
  }, [editingItem, activeTab]);

  function resetForm() {
    setItemName("");
    setItemType("STANDALONE");
    setInAdmin(0);
    setInAdminRaw("0");
    setOutAdmin(0);
    setOutAdminRaw("0");
    setInStore(0);
    setInStoreRaw("0");
    setOutStore(0);
    setOutStoreRaw("0");
    setCostPrice(0);
    setCostPriceRaw("0");
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
    <div
      className="rounded-2xl border border-(--light-gray) bg-(--pure-white) shadow-sm"
      style={{ overflow: "clip" }}
    >
      <div className="flex items-center gap-3 border-b border-(--light-gray) px-6 py-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-(--pale-yellow)">
          {isEditing ? (
            <NotePencilIcon
              weight="bold"
              className="size-5 text-(--deep-forest)"
            />
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
            <Label htmlFor="itemName">Item Name</Label>
            <p className="text-xs text-(--medium-gray)">
              {itemName.length} / {MAX_ITEM_NAME_LENGTH}
            </p>
          </div>
          <Input
            value={itemName}
            onChange={(e) =>
              setItemName(e.target.value.slice(0, MAX_ITEM_NAME_LENGTH))
            }
            maxLength={MAX_ITEM_NAME_LENGTH}
            placeholder="e.g. 12oz (Hot), Coke"
            className="h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="itemType"
            className="text-sm font-medium text-(--dark-gray)"
          >
            Item Type
          </Label>
          <select
            id="itemType"
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
              <Label className="text-sm font-medium text-(--dark-gray)">
                Admin Stock (auto)
              </Label>
              <div className="flex h-10 items-center rounded-xl border border-(--light-gray) bg-(--light-gray)/20 px-3 text-sm text-(--medium-gray)">
                {newEndingAdmin}
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm font-medium text-(--dark-gray)">
                  In Admin
                </Label>
                <p className="text-xs text-(--medium-gray)">
                  {String(inAdmin).length} / 5
                </p>
              </div>
              <Input
                type="number"
                min={0}
                max={99999}
                step={1}
                value={inAdminRaw}
                onChange={(e) => {
                  const next = e.target.value;
                  setInAdminRaw(next);
                  if (next === "") return;
                  const val = parseFloat(next);
                  if (!Number.isNaN(val)) {
                    setInAdmin(Math.min(99999, Math.max(0, Math.floor(val))));
                  }
                }}
                onBlur={() => {
                  const parsed = parseFloat(inAdminRaw);
                  if (inAdminRaw === "" || Number.isNaN(parsed)) {
                    setInAdminRaw(String(inAdmin));
                  }
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
                <Label className="text-sm font-medium text-(--dark-gray)">
                  Out Admin
                </Label>
                <p className="text-xs text-(--medium-gray)">
                  {String(outAdmin).length} / 5
                </p>
              </div>
              <Input
                type="number"
                min={0}
                max={99999}
                step={1}
                value={outAdminRaw}
                onChange={(e) => {
                  const next = e.target.value;
                  setOutAdminRaw(next);
                  if (next === "") return;
                  const val = parseFloat(next);
                  if (!Number.isNaN(val)) {
                    setOutAdmin(Math.min(99999, Math.max(0, Math.floor(val))));
                  }
                }}
                onBlur={() => {
                  const parsed = parseFloat(outAdminRaw);
                  if (outAdminRaw === "" || Number.isNaN(parsed)) {
                    setOutAdminRaw(String(outAdmin));
                  }
                }}
                placeholder="0"
                className="h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
              />
            </div>
          </>
        ) : isEditing ? (
          <>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-(--dark-gray)">
                Store Stock (auto)
              </Label>
              <div className="flex h-10 items-center rounded-xl border border-(--light-gray) bg-(--light-gray)/20 px-3 text-sm text-(--medium-gray)">
                {newEndingStore}
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm font-medium text-(--dark-gray)">
                  In Store
                </Label>
                <p className="text-xs text-(--medium-gray)">
                  {String(inStore).length} / 5
                </p>
              </div>
              <Input
                type="number"
                min={0}
                max={99999}
                step={1}
                value={inStoreRaw}
                onChange={(e) => {
                  const next = e.target.value;
                  setInStoreRaw(next);
                  if (next === "") return;
                  const val = parseFloat(next);
                  if (!Number.isNaN(val)) {
                    setInStore(Math.min(99999, Math.max(0, Math.floor(val))));
                  }
                }}
                onBlur={() => {
                  const parsed = parseFloat(inStoreRaw);
                  if (inStoreRaw === "" || Number.isNaN(parsed)) {
                    setInStoreRaw(String(inStore));
                  }
                }}
                placeholder="0"
                className="h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm font-medium text-(--dark-gray)">
                  Out Store
                </Label>
                <p className="text-xs text-(--medium-gray)">
                  {String(outStore).length} / 5
                </p>
              </div>
              <Input
                type="number"
                min={0}
                max={99999}
                step={1}
                value={outStoreRaw}
                onChange={(e) => {
                  const next = e.target.value;
                  setOutStoreRaw(next);
                  if (next === "") return;
                  const val = parseFloat(next);
                  if (!Number.isNaN(val)) {
                    setOutStore(Math.min(99999, Math.max(0, Math.floor(val))));
                  }
                }}
                onBlur={() => {
                  const parsed = parseFloat(outStoreRaw);
                  if (outStoreRaw === "" || Number.isNaN(parsed)) {
                    setOutStoreRaw(String(outStore));
                  }
                }}
                placeholder="0"
                className="h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
              />
            </div>
          </>
        ) : null}

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-(--dark-gray)">
            Cost Price (₱)
          </Label>
          <Input
            type="text"
            inputMode="decimal"
            value={costPriceRaw}
            onChange={(e) => {
              const raw = e.target.value;
              let clean = raw.replace(/[^0-9.]/g, "");
              const parts = clean.split(".");
              if (parts.length > 2)
                clean = `${parts[0]}.${parts.slice(1).join("")}`;
              if (parts[1]?.length > 2)
                clean = `${parts[0]}.${parts[1].slice(0, 2)}`;
              setCostPriceRaw(clean);
              if (clean === "") return;
              const num = Number(clean);
              if (!Number.isNaN(num)) {
                setCostPrice(num);
              }
            }}
            onBlur={() => {
              const parsed = parseFloat(costPriceRaw);
              if (costPriceRaw === "" || Number.isNaN(parsed)) {
                setCostPriceRaw(String(costPrice));
              }
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

export type { AddInventoryItemProps };
export { AddInventoryItem };
