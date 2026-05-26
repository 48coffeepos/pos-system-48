import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TodayOrdersTable } from "@/features/admin/orders/components/TodayOrdersTable";
import { getTodayOrdersQueryOptions } from "@/features/admin/orders/queryOptions";
import { sessionQueryOptions } from "@/features/auth/queryOptions";
import type { PaymentMethodFilter } from "../constants";
import { getDashboardDataQueryOptions } from "../queryOptions";
import { CupSalesBreakdown } from "./CupSalesBreakdown";
import { DashboardReceiptDialog } from "./DashboardReceiptDialog";
import { RevenueCard } from "./RevenueCard";

export function AdminDashboardScreen() {
  const { data } = useSuspenseQuery(getDashboardDataQueryOptions);
  const { data: session } = useSuspenseQuery(sessionQueryOptions);
  const { data: todayOrders } = useSuspenseQuery(getTodayOrdersQueryOptions);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethodFilter>("all");
  const [receiptMode, setReceiptMode] = useState<
    "select" | "cups" | "revenue" | null
  >(null);

  const { revenue, cupSales, periodLabel } = data;
  const staffName = session?.user?.name ?? "Admin";

  return (
    <div className="space-y-5">
      <RevenueCard
        revenueByMethod={revenue.byMethod}
        ordersByMethod={revenue.ordersByMethod}
        selectedPayment={selectedPayment}
        onPaymentChange={setSelectedPayment}
        periodLabel={periodLabel}
        onExportClick={() => setReceiptMode("select")}
      />

      <CupSalesBreakdown
        cupSales={cupSales}
        selectedPayment={selectedPayment}
      />

      <TodayOrdersTable data={todayOrders} limit={10} />

      <Dialog
        open={receiptMode === "select"}
        onOpenChange={(open) => {
          if (!open) setReceiptMode(null);
        }}
      >
        <DialogContent className="max-w-sm" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Print Receipt</DialogTitle>
            <DialogDescription>
              Print a thermal receipt for today&apos;s data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Button
              type="button"
              onClick={() => setReceiptMode("cups")}
              className="h-auto w-full rounded-xl px-4 py-2 text-xs font-semibold bg-(--deep-forest) text-white hover:bg-(--deep-forest)/90"
            >
              Cups Sales Receipt
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setReceiptMode("revenue")}
              className="h-auto w-full rounded-xl border-(--light-gray) bg-(--off-white) px-4 py-2 text-xs font-semibold text-(--dark-gray) hover:bg-(--off-white)"
            >
              Revenue Receipt
            </Button>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setReceiptMode(null)}
              className="text-xs font-semibold text-(--dark-gray)"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DashboardReceiptDialog
        open={receiptMode === "cups" || receiptMode === "revenue"}
        onClose={() => setReceiptMode(null)}
        mode={receiptMode === "select" ? null : receiptMode}
        staffName={staffName}
        periodLabel={periodLabel}
        cupSales={cupSales}
        revenueByMethod={revenue.byMethod}
      />
    </div>
  );
}
