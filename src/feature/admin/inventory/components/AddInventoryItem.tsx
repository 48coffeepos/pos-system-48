  "use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, MagnifyingGlass, CaretDown } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  createInventoryItemMutationOptions,
  addStockMutationOptions,
} from "../mutationOptions";
import inventoryKeys from "../keys";

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  type: "STANDALONE" | "CUP";
}

interface AddInventoryItemProps {
  items?: InventoryItem[];
}

const mockItems: InventoryItem[] = [
  { id: "1", name: "Espresso Beans", stock: 50, type: "STANDALONE" },
  { id: "2", name: "Milk (L)", stock: 30, type: "STANDALONE" },
  { id: "3", name: "12oz Cups", stock: 200, type: "CUP" },
  { id: "4", name: "16oz Cups", stock: 150, type: "CUP" },
];

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

type SelectionState = "idle" | "new" | "existing";

function AddInventoryItem({ items }: AddInventoryItemProps) {
  const queryClient = useQueryClient();
  const inventoryItems = items ?? mockItems;

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectionState, setSelectionState] = useState<SelectionState>("idle");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState<"STANDALONE" | "CUP">("STANDALONE");
  const [quantity, setQuantity] = useState<number | "">("");
  const [newItemQuantity, setNewItemQuantity] = useState<number>(0);
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number; width: number } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const createMutation = useMutation({
    ...createInventoryItemMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.inventory });
      handleClear();
    },
  });

  const addStockMutation = useMutation({
    ...addStockMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.inventory });
      handleClear();
    },
  });

  const isPending = createMutation.isPending || addStockMutation.isPending;

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return inventoryItems;
    const q = searchQuery.toLowerCase();
    return inventoryItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q),
    );
  }, [searchQuery, inventoryItems]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleSelectNew = () => {
    setSelectionState("new");
    setSelectedItem(null);
    setItemName("");
    setItemType("STANDALONE");
    setNewItemQuantity(0);
    setIsOpen(false);
  };

  const handleSelectExisting = (item: InventoryItem) => {
    setSelectionState("existing");
    setSelectedItem(item);
    setQuantity("");
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectionState("idle");
    setSelectedItem(null);
    setItemName("");
    setItemType("STANDALONE");
    setQuantity("");
    setNewItemQuantity(0);
  };

  const getDisplayValue = () => {
    if (selectionState === "new") return "+ Add New Item";
    if (selectedItem)
      return `${selectedItem.name} (Current: ${selectedItem.stock})`;
    return "";
  };

  const isFormValid = () => {
    if (selectionState === "new") return itemName.trim().length > 0;
    if (selectionState === "existing")
      return quantity !== "" && Number(quantity) > 0;
    return false;
  };

  const handleSubmit = () => {
    if (selectionState === "new") {
      createMutation.mutate({
        name: itemName.trim(),
        stock: newItemQuantity,
        type: itemType,
      });
    } else if (selectionState === "existing" && selectedItem && quantity !== "") {
      addStockMutation.mutate({
        itemId: selectedItem.id,
        quantity: Number(quantity),
      });
    }
  };

  return (
    <div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) shadow-sm" style={{ overflow: 'clip' }}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-(--light-gray) px-6 py-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-(--pale-yellow)">
          <Plus weight="bold" className="size-5 text-(--deep-forest)" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-(--deep-forest)">
            Add New Item
          </h3>
          <p className="text-sm text-(--medium-gray)">Update stock records</p>
        </div>
      </div>

      {/* Form Body */}
      <div className="space-y-5 px-6 py-5">
        {/* Select Item Label + Dropdown */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-(--dark-gray)">
            Select Item
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              ref={buttonRef}
              type="button"
              onClick={() => {
                if (!isOpen && buttonRef.current) {
                  const rect = buttonRef.current.getBoundingClientRect();
                  setButtonPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                  });
                }
                setIsOpen(!isOpen);
              }}
              className={cn(
                "flex h-10 w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors",
                "bg-(--pure-white)",
                selectionState !== "idle"
                  ? "border-(--deep-forest) text-(--deep-forest)"
                  : "border-(--light-gray) text-(--medium-gray)",
              )}
            >
              <span
                className={cn(
                  selectionState !== "idle"
                    ? "text-(--deep-forest)"
                    : "text-(--medium-gray)",
                )}
              >
                {getDisplayValue() || "Choose an item..."}
              </span>
              <CaretDown
                weight="bold"
                className={cn(
                  "size-4 text-(--medium-gray) transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {/* Dropdown Panel */}
            {isOpen && buttonPosition &&
              createPortal(
                <div
                  ref={dropdownRef}
                  className="animate-fade-in-up fixed z-50 rounded-xl border border-(--light-gray) bg-(--pure-white) p-1.5 shadow-lg"
                  style={{
                    top: `${buttonPosition.top + 8}px`,
                    left: `${buttonPosition.left}px`,
                    width: `${buttonPosition.width}px`,
                  }}
                >
                  {/* Search */}
                  <div className="relative mb-1">
                    <MagnifyingGlass className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-(--medium-gray)" />
                    <Input
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search items..."
                      className="h-8 w-full rounded-lg border-(--light-gray) pl-8 text-sm"
                    />
                  </div>

                  {/* + Add New Item */}
                  <button
                    type="button"
                    onClick={handleSelectNew}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                      "text-(--deep-forest) hover:bg-(--pale-yellow)",
                      selectionState === "new" && "bg-(--pale-yellow)",
                    )}
                  >
                    <div className="flex size-5 items-center justify-center rounded-md border border-(--light-gray)">
                      <Plus weight="bold" className="size-3" />
                    </div>
                    Add New Item
                  </button>

                  {/* Divider */}
                  {filteredItems.length > 0 && (
                    <div className="my-1 border-t border-(--light-gray)" />
                  )}

                  {/* Items List */}
                  <div className="max-h-48 overflow-y-auto">
                    {filteredItems.length > 0 ? (
                      <div className="space-y-0.5">
                        {filteredItems.map((item) => {
                          const isSelected =
                            selectionState === "existing" &&
                            selectedItem?.id === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleSelectExisting(item)}
                              className={cn(
                                "grid w-full grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                                "text-(--dark-gray) hover:bg-(--pale-yellow)",
                                isSelected && "bg-(--pale-yellow)",
                              )}
                            >
                              <span>{item.name}</span>
                              <div className="text-right leading-tight">
                                <p className="text-[11px] text-(--medium-gray)">
                                  Current
                                </p>
                                <p className="text-sm font-medium text-(--deep-forest)">
                                  {item.stock}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="px-3 py-4 text-center text-sm text-(--medium-gray)">
                        No items found
                      </p>
                    )}
                  </div>
                </div>,
                document.body,
              )}
          </div>
        </div>

        {/* State C: Creating New Item */}
        {selectionState === "new" && (
          <div className="animate-fade-in-up space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-(--dark-gray)">
                  Item Name
                </label>
                <p className="text-xs text-(--medium-gray)">
                  {itemName.length} / 20
                </p>
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
              <label className="text-sm font-medium text-(--dark-gray)">
                Item Type
              </label>
              <select
                value={itemType}
                onChange={(e) =>
                  setItemType(e.target.value as "STANDALONE" | "CUP")
                }
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
                  Quantity
                </label>
                <p className="text-xs text-(--medium-gray)">
                  {String(newItemQuantity).length} / 5
                </p>
              </div>
              <Input
                type="text"
                inputMode="numeric"
                value={newItemQuantity}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9]/g, "");
                  val = val.slice(0, 5);
                  setNewItemQuantity(val === "" ? 0 : Number(val));
                }}
                placeholder="0"
                maxLength={5}
                className="h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
              />
            </div>
          </div>
        )}

        {/* State D: Adding Quantity to Existing Item */}
        {selectionState === "existing" && (
          <div className="animate-fade-in-up space-y-1.5">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-(--dark-gray)">
                Add Quantity
              </label>
              <p className="text-xs text-(--medium-gray)">
                {quantity === "" ? "0" : String(quantity).length} / 5
              </p>
            </div>
            <Input
              type="text"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => {
                let val = e.target.value.replace(/[^0-9]/g, "");
                val = val.slice(0, 5);
                setQuantity(val === "" ? "" : Number(val));
              }}
              placeholder="0"
              maxLength={5}
              className="h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
            />
            <p className="text-xs text-(--medium-gray)">
              This will add to the existing quantity
            </p>
          </div>
        )}
      </div>

      {/* Footer / Action Button */}
      <div className="border-t border-(--light-gray) px-6 py-4">
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
          <Plus weight="bold" className="size-4" />
          {isPending
            ? `${selectionState === "new" ? "Creating" : "Adding"}...`
            : selectionState === "new"
              ? "Create Item"
              : "Add Quantity"}
        </button>
      </div>
    </div>
  );
}

export { AddInventoryItem };
export type { AddInventoryItemProps };
