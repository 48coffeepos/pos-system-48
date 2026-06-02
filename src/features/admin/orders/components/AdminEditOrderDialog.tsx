import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
import type { PosOrder } from "@/features/staff/pos/types";
import { formatPeso } from "@/lib/format-currency";
import { updateOrderPaymentMutationOptions } from "../mutationOptions";

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

  const mutation = useMutation(updateOrderPaymentMutationOptions);

  useEffect(() => {
    if (open && order) {
      setMethod(order.method);
      setAmountTendered(
        order.amount_tendered?.toString() ?? order.grand_total.toString(),
      );
      setReferenceNumber(order.reference_number ?? "");
    }
  }, [open, order]);

  if (!order) return null;

  const grandTotal = order.grand_total;
  const parsedAmount = parseFloat(amountTendered);
  const validAmount = Number.isFinite(parsedAmount) ? parsedAmount : 0;
  const changeAmount =
    method === "CASH" ? Math.max(0, validAmount - grandTotal) : 0;
  const isAmountValid = validAmount >= grandTotal;

  const isNonCash = method !== "CASH";

  const handleSave = () => {
    mutation.mutate(
      {
        orderId: order.order_id,
        method: method as "CASH" | "GCASH" | "GRAB",
        amount_tendered: Math.max(validAmount, grandTotal),
        reference_number: isNonCash ? referenceNumber : undefined,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <AlertDialogContent size="default" className="sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Order Payment</AlertDialogTitle>
          <AlertDialogDescription>
            Update payment method and amount tendered for this order.
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
              <span>{formatPeso(grandTotal)}</span>
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
            {method === "CASH" && isAmountValid ? (
              <p className="text-xs text-(--medium-gray)">
                Change: {formatPeso(changeAmount)}
              </p>
            ) : null}
            {isNonCash ? (
              <p className="text-xs text-(--medium-gray)">
                Non-cash payment — change is ₱0.00
              </p>
            ) : null}
          </div>

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
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSave}
            disabled={mutation.isPending || !isAmountValid}
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
