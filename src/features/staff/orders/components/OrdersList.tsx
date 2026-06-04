import { CreditCardIcon, ReceiptIcon } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { PosReceiptDialog } from "@/features/staff/pos/components/PosReceiptDialog";
import type { PosOrder } from "@/features/staff/pos/types";
import { usePusherChannel } from "@/integrations/pusher/hooks/usePusherChannel";
import { formatPeso } from "@/lib/format-currency";
import orderKeys from "../keys";

interface DBOrder {
  order_id: string;
  method: string;
  reference_number: string | null;
  amount_tendered: number | null;
  change_amount: number | null;
  grand_total: number;
  created_at: string | Date;
  note: string | null;
  staff: { name: string };
  order_items: Array<{
    order_item_id: string;
    menu_id: string;
    snapshot_menu_name: string;
    discount_amount: number | null;
    quantity: number;
    discount_type: string | null;
    discount_contact: string | null;
    discount_id_number: string | null;
    line_total: number;
    unit_price: number;
    snapshot_inventory: string;
    addon_items: Array<{
      order_item_addon_id: string;
      addon_id: string;
      quantity: number;
      addon_name_snapshot: string;
      addon_price_snapshot: number;
      addon: {
        addon_id: string;
        name: string;
        price: number;
      };
    }>;
  }>;
}

interface OrdersListProps {
  orders: DBOrder[];
}

export function OrdersList({ orders = [] }: OrdersListProps) {
  const [selectedOrder, setSelectedOrder] = useState<PosOrder | null>(null);
  const [timeframe, setTimeframe] = useState<"today" | "yesterday">("today");

  const queryClient = useQueryClient();
  const pusherProcessedRef = useRef<Set<string>>(new Set());

  usePusherChannel("orders", "new-order", (data: unknown) => {
    const raw = data as DBOrder;

    if (pusherProcessedRef.current.has(raw.order_id)) return;
    pusherProcessedRef.current.add(raw.order_id);

    queryClient.invalidateQueries({ queryKey: orderKeys.all });

    const mapped: PosOrder = {
      order_id: raw.order_id,
      created_at: new Date(raw.created_at).toISOString(),
      method: raw.method,
      reference_number: raw.reference_number || undefined,
      amount_tendered:
        raw.amount_tendered !== null ? raw.amount_tendered : undefined,
      change_amount: raw.change_amount !== null ? raw.change_amount : undefined,
      grand_total: raw.grand_total,
      note: raw.note || undefined,
      cashier_name: raw.staff?.name || "Cashier",
      items: raw.order_items.map((item) => ({
        snapshot_menu_name: item.snapshot_menu_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_type: item.discount_type || undefined,
        discount_contact: item.discount_contact || undefined,
        discount_id_number: item.discount_id_number || undefined,
        line_total: item.line_total,
        snapshot_inventory: item.snapshot_inventory,
        addon_items: item.addon_items.map((ai) => ({
          addon_id: ai.addon_id,
          addon_name_snapshot: ai.addon_name_snapshot,
          addon_price_snapshot: ai.addon_price_snapshot,
          quantity: ai.quantity,
        })),
      })),
    };
    setSelectedOrder(mapped);
  });

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at);
    const todayStr = new Date().toDateString();

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toDateString();

    const orderDateStr = orderDate.toDateString();

    if (timeframe === "today") {
      return orderDateStr === todayStr;
    }
    return orderDateStr === yesterdayStr;
  });

  const viewReceipt = (order: DBOrder) => {
    const mapped: PosOrder = {
      order_id: order.order_id,
      created_at: new Date(order.created_at).toISOString(),
      method: order.method,
      reference_number: order.reference_number || undefined,
      amount_tendered:
        order.amount_tendered !== null ? order.amount_tendered : undefined,
      change_amount:
        order.change_amount !== null ? order.change_amount : undefined,
      grand_total: order.grand_total,
      note: order.note || undefined,
      cashier_name: order.staff?.name || "Cashier",
      items: order.order_items.map((item) => ({
        snapshot_menu_name: item.snapshot_menu_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_type: item.discount_type || undefined,
        discount_contact: item.discount_contact || undefined,
        discount_id_number: item.discount_id_number || undefined,
        line_total: item.line_total,
        snapshot_inventory: item.snapshot_inventory,
        addon_items: item.addon_items.map((ai) => ({
          addon_id: ai.addon_id,
          addon_name_snapshot: ai.addon_name_snapshot,
          addon_price_snapshot: ai.addon_price_snapshot,
          quantity: ai.quantity,
        })),
      })),
    };
    setSelectedOrder(mapped);
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
      case "CASH":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "GCASH":
        return "bg-blue-50 text-blue-700 border-blue-200/50";
      case "GRAB":
        return "bg-orange-50 text-orange-700 border-orange-200/50";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200/50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-(--deep-forest)">
              Recent Transactions
            </h2>
            <p className="text-xs text-(--medium-gray) mt-0.5">
              A real-time list of all placed orders
            </p>
          </div>

          {/* Timeframe Pill Switcher */}
          <div className="flex self-start gap-1.5 rounded-full bg-(--light-gray)/30 p-1">
            <button
              type="button"
              onClick={() => setTimeframe("today")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                timeframe === "today"
                  ? "bg-(--deep-forest) text-white shadow-sm"
                  : "text-(--medium-gray) hover:bg-(--light-gray)/50"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("yesterday")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                timeframe === "yesterday"
                  ? "bg-(--deep-forest) text-white shadow-sm"
                  : "text-(--medium-gray) hover:bg-(--light-gray)/50"
              }`}
            >
              Yesterday
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-(--light-gray)/40">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr className="border-b border-(--light-gray)/40 bg-(--off-white) text-xs font-bold uppercase tracking-wider text-(--medium-gray)">
                <th className="p-4 pl-6">Order No</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Total</th>
                <th className="p-4 pr-6 no-print">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--light-gray)/40">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-sm font-medium text-(--medium-gray)"
                  >
                    No transactions found for{" "}
                    {timeframe === "today" ? "today" : "yesterday"}.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const dateObj = new Date(order.created_at);
                  const formattedDate = dateObj.toLocaleDateString("en-GB");
                  const formattedTime = dateObj.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });

                  return (
                    <tr
                      key={order.order_id}
                      className="group hover:bg-(--off-white)/50 transition-colors"
                    >
                      {/* Order Number */}
                      <td className="p-4 pl-6 font-mono font-bold text-sm text-(--near-black)">
                        {order.order_id}
                      </td>

                      {/* Date and Time */}
                      <td className="p-4 text-xs font-medium text-(--near-black)">
                        <div className="flex flex-col gap-0.5">
                          <span>{formattedDate}</span>
                          <span className="text-(--medium-gray)">
                            {formattedTime}
                          </span>
                        </div>
                      </td>

                      {/* Payment Method & details */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getMethodBadgeClass(
                              order.method,
                            )}`}
                          >
                            <CreditCardIcon className="size-3" />
                            {order.method}
                          </span>
                          {order.reference_number &&
                            order.method !== "GCASH" && (
                              <span className="text-[10px] font-mono text-(--medium-gray)">
                                Ref: {order.reference_number}
                              </span>
                            )}
                        </div>
                      </td>

                      {/* Total Price */}
                      <td className="p-4 font-black text-sm text-(--near-black)">
                        {formatPeso(order.grand_total)}
                      </td>

                      {/* Action Button */}
                      <td className="p-4 pr-6 no-print">
                        <button
                          onClick={() => viewReceipt(order)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-(--light-gray) bg-white px-3 py-1.5 text-xs font-bold text-(--near-black) transition-all hover:bg-gray-50 active:scale-95 shadow-sm"
                        >
                          <ReceiptIcon className="size-3.5" />
                          View Slip
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PosReceiptDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        cashierName={selectedOrder?.cashier_name || "Cashier"}
      />
    </div>
  );
}
