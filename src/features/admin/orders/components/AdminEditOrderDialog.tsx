import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TrashIcon, MinusIcon, PlusIcon, PlusCircle } from "@phosphor-icons/react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { PosOrder } from "@/features/staff/pos/types";
import { formatPeso } from "@/lib/format-currency";
import { updateOrderPaymentMutationOptions, updateOrderItemsMutationOptions } from "../mutationOptions";
import { posPageDataQueryOptions } from "@/features/staff/pos/queryOptions";

interface AdminEditOrderDialogProps {
  order: PosOrder | null;
  open: boolean;
  onClose: () => void;
}

const PAYMENT_METHODS = ["CASH", "GCASH", "GRAB"] as const;

export function AdminEditOrderDialog({
  order,
  open,
  onClose,
}: AdminEditOrderDialogProps) {
  const [method, setMethod] = useState<string>("CASH");
  const [amountTendered, setAmountTendered] = useState<string>("0");
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [items, setItems] = useState<PosOrder["items"]>([]);
  const [selectedNewItem, setSelectedNewItem] = useState<string>("");

  const paymentMutation = useMutation(updateOrderPaymentMutationOptions);
  const itemsMutation = useMutation(updateOrderItemsMutationOptions);

  const { data: menuData } = useQuery({
    ...posPageDataQueryOptions,
    enabled: open,
  });

  // Flatten menu and inventory combinations for the dropdown
  const availableItems = (menuData?.menuItems || []).flatMap((menuItem) => 
    menuItem.inventory_items.map((inv) => ({
      id: `${menuItem.menu_id}::${inv.inventory.name}`,
      menu_id: menuItem.menu_id,
      snapshot_menu_name: menuItem.name,
      snapshot_inventory: inv.inventory.name,
      unit_price: inv.price,
      label: `${menuItem.name} (${inv.inventory.name}) - ${formatPeso(inv.price)}`
    }))
  );

  useEffect(() => {
    if (open && order) {
      setMethod(order.method);
      setAmountTendered(
        order.amount_tendered?.toString() ?? order.grand_total.toString(),
      );
      setReferenceNumber(order.reference_number ?? "");
      setItems(order.items || []);
      setSelectedNewItem("");
    }
  }, [open, order]);

  if (!order) return null;

  // Calculate the new grand total based on the locally edited items list
  let computedGrandTotal = 0;
  if (method !== "GRAB") {
    computedGrandTotal = items.reduce((sum, item) => {
      const discount = item.discount_type ? Number(item.discount_amount || 0) : 0;
      let itemTotal = 0;
      if (!item.loyalty) {
        itemTotal = (Number(item.unit_price) * item.quantity) - discount;
      }
      const addonsTotal = (item.addon_items || []).reduce(
        (acc, addon) => acc + Number(addon.addon_price_snapshot) * addon.quantity,
        0
      );
      return sum + itemTotal + addonsTotal;
    }, 0);
  }

  const grandTotal = computedGrandTotal;
  const parsedAmount = parseFloat(amountTendered);
  const validAmount = Number.isFinite(parsedAmount) ? parsedAmount : 0;
  const changeAmount =
    method === "CASH" ? Math.max(0, validAmount - grandTotal) : 0;
  const isAmountValid = validAmount >= grandTotal;
  const isNonCash = method !== "CASH";

  const handleUpdateQuantity = (orderItemId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.order_item_id === orderItemId) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (orderItemId: string) => {
    setItems((prev) => prev.filter((item) => item.order_item_id !== orderItemId));
  };

  const handleAddNewItem = () => {
    if (!selectedNewItem) return;
    const option = availableItems.find(i => i.id === selectedNewItem);
    if (!option) return;

    // Check if the exact same item already exists in the current list
    const existingIndex = items.findIndex(
      i => i.snapshot_menu_name === option.snapshot_menu_name && i.snapshot_inventory === option.snapshot_inventory
    );

    if (existingIndex >= 0) {
      handleUpdateQuantity(items[existingIndex].order_item_id, 1);
    } else {
      const newItem: PosOrder["items"][0] = {
        order_item_id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        // menu_id isn't in PosOrder type, but we can sneak it in or derive it in the backend
        // Actually, let's just stick to the PosOrder type limits and we'll attach menu_id when saving
        snapshot_menu_name: option.snapshot_menu_name,
        snapshot_inventory: option.snapshot_inventory,
        unit_price: option.unit_price,
        quantity: 1,
        line_total: option.unit_price,
        loyalty: false,
        addon_items: []
      };
      
      // @ts-ignore - attaching menu_id for the save payload
      newItem.menu_id = option.menu_id;

      setItems(prev => [...prev, newItem]);
    }
    
    setSelectedNewItem("");
  };

  const handleSave = async () => {
    // 1. Update items first
    try {
      if (items.length === 0) {
        alert("Cannot save an empty order. Please cancel it instead.");
        return;
      }

      await itemsMutation.mutateAsync({
        orderId: order.order_id,
        items: items.map((i) => ({
          order_item_id: i.order_item_id,
          quantity: i.quantity,
          // @ts-ignore
          menu_id: i.menu_id,
          snapshot_menu_name: i.snapshot_menu_name,
          snapshot_inventory: i.snapshot_inventory,
          unit_price: i.unit_price,
        })),
      });

      // 2. Update payment details
      await paymentMutation.mutateAsync({
        orderId: order.order_id,
        method: method as "CASH" | "GCASH" | "GRAB",
        amount_tendered: Math.max(validAmount, grandTotal),
        reference_number: isNonCash ? referenceNumber : undefined,
      });

      onClose();
    } catch (error) {
      console.error("Failed to save order updates", error);
    }
  };

  const isPending = itemsMutation.isPending || paymentMutation.isPending;

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <AlertDialogContent size="default" className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Order</AlertDialogTitle>
          <AlertDialogDescription>
            Update items, quantities, and payment details.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-(--off-white) p-3 text-sm">
            <div className="flex justify-between font-semibold">
              <span>Order No.</span>
              <span className="font-mono text-xs">{order.order_id}</span>
            </div>
            <div className="mt-1 flex justify-between font-semibold">
              <span>Grand Total</span>
              <span>{method === "GRAB" ? "--" : formatPeso(grandTotal)}</span>
            </div>
          </div>

          <div className="space-y-2 border border-(--light-gray) rounded-lg p-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-(--medium-gray) px-1">
              Order Items
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {items.length === 0 ? (
                <p className="text-xs text-red-500 px-1 py-2">Order must have at least 1 item.</p>
              ) : (
                items.map((item) => (
                  <div key={item.order_item_id} className="flex items-center justify-between bg-white rounded-md p-2 border border-(--light-gray)/40 text-xs">
                    <div className="flex-1 pr-2 truncate">
                      <span className="font-bold text-(--near-black)">{item.snapshot_menu_name}</span>
                      <span className="text-(--medium-gray) ml-1">({item.snapshot_inventory})</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 bg-(--off-white) rounded-md border border-(--light-gray)/50 p-0.5">
                        <button
                          type="button"
                          className="size-5 flex items-center justify-center rounded-sm hover:bg-gray-200"
                          onClick={() => handleUpdateQuantity(item.order_item_id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <MinusIcon className="size-3" />
                        </button>
                        <span className="w-4 text-center font-bold text-(--near-black)">{item.quantity}</span>
                        <button
                          type="button"
                          className="size-5 flex items-center justify-center rounded-sm hover:bg-gray-200"
                          onClick={() => handleUpdateQuantity(item.order_item_id, 1)}
                        >
                          <PlusIcon className="size-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="size-6 flex items-center justify-center rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        onClick={() => handleRemoveItem(item.order_item_id)}
                      >
                        <TrashIcon className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add New Item */}
            <div className="mt-3 pt-3 border-t border-(--light-gray) px-1 pb-1">
               <label className="text-xs font-bold text-(--medium-gray) mb-1 block">Add Item</label>
               <div className="flex gap-2">
                  <select 
                    value={selectedNewItem}
                    onChange={(e) => setSelectedNewItem(e.target.value)}
                    className="flex-1 h-8 rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">Select an item...</option>
                    {availableItems.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                  <Button 
                    type="button" 
                    size="sm" 
                    className="h-8 shrink-0 px-3 text-xs" 
                    disabled={!selectedNewItem}
                    onClick={handleAddNewItem}
                  >
                    <PlusCircle className="mr-1 size-3.5" /> Add
                  </Button>
               </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-(--medium-gray)">
              Payment Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="flex w-full h-9 rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {method === "CASH" && (
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-(--medium-gray)">
                Total Paid (Amount Tendered)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-medium text-(--medium-gray)">
                  ₱
                </span>
                <input
                  type="number"
                  step="0.01"
                  min={grandTotal}
                  value={amountTendered}
                  onChange={(e) => setAmountTendered(e.target.value)}
                  className="flex w-full h-9 rounded-md border border-input bg-transparent pl-7 pr-2.5 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
              {!isAmountValid && amountTendered !== "" ? (
                <p className="text-xs text-red-500">
                  Amount must be at least {formatPeso(grandTotal)}
                </p>
              ) : null}
              {isAmountValid ? (
                <p className="text-xs text-(--medium-gray)">
                  Change: {formatPeso(changeAmount)}
                </p>
              ) : null}
            </div>
          )}

          {method !== "CASH" ? (
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-(--medium-gray)">
                Reference Number
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Enter reference number"
                className="flex w-full h-9 rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          ) : null}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSave}
            disabled={isPending || !isAmountValid || items.length === 0}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
