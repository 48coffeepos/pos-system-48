import { PrinterIcon } from "@phosphor-icons/react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  ReceiptThermalContent,
  THERMAL_PAGE_STYLE,
} from "@/integrations/bixolon";

interface DashboardReceiptDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "monthly" | null;
  staffName: string;
  monthlyData?: {
    totalRevenue: number;
    totalCashOut: number;
    totalCashIn: number;
    totalExpenses: number;
    inventoryExpenses: number;
    staffExpenses: number;
    monthLabel: string;
    periodStart: string;
    periodEnd: string;
    orderCount: number;
    expenseCount: number;
    revenueByMethod: Record<string, number>;
  };
}

function formatPeso(value: number) {
  return value.toFixed(2);
}

function formatTime(date: Date) {
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function DashboardReceiptDialog({
  open,
  onClose,
  mode,
  staffName,
  monthlyData,
}: DashboardReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    pageStyle: THERMAL_PAGE_STYLE,
    onAfterPrint: onClose,
  });

  if (!mode) return null;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <AlertDialogContent className="max-w-[360px] p-6">
        <ReceiptThermalContent ref={receiptRef}>
          {mode === "monthly" && monthlyData && (
            <div id="monthly-receipt">
              <div className="mb-3 text-center">
                <h2 className="text-2xl font-black tracking-tight">48 COFFEE</h2>
                <div className="text-xs font-bold leading-tight my-0.5">
                  <p>Ledesma St., Iloilo City Proper,</p>
                  <p>Iloilo City, 5000</p>
                </div>
                <h3 className="mt-0.5 text-sm font-bold uppercase">
                  MONTHLY SUMMARY
                </h3>
              </div>

              <div className="mb-3 space-y-0.5 text-xs font-bold">
                <div className="flex justify-between">
                  <span>Period :</span>
                  <span>{monthlyData.monthLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date :</span>
                  <span>{monthlyData.periodStart} - {monthlyData.periodEnd}</span>
                </div>
                <div className="flex justify-between">
                  <span>Printed :</span>
                  <span>{formatTime(new Date())}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-black pt-2 text-xs font-bold space-y-1">
                <div className="flex justify-between">
                  <span>Total Orders:</span>
                  <span>{monthlyData.orderCount}</span>
                </div>
              </div>

              <div className="mt-2 border-t border-dashed border-black pt-2 text-xs font-bold space-y-1">
                <div className="flex justify-between">
                  <span>CASH SALES:</span>
                  <span>₱{formatPeso(monthlyData.revenueByMethod?.CASH ?? 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GCASH SALES:</span>
                  <span>₱{formatPeso(monthlyData.revenueByMethod?.GCASH ?? 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GRAB SALES:</span>
                  <span />
                </div>
                <div className="flex justify-between font-black">
                  <span>TOTAL REVENUE:</span>
                  <span />
                </div>
              </div>

              <div className="mt-2 border-t border-dashed border-black pt-2 text-xs font-bold space-y-1">
                {monthlyData.staffExpenses > 0 && (
                  <div className="flex justify-between font-medium opacity-80">
                    <span>STAFF EXPENSES:</span>
                    <span>₱{formatPeso(monthlyData.staffExpenses)}</span>
                  </div>
                )}
                {monthlyData.inventoryExpenses > 0 && (
                  <div className="flex justify-between font-medium opacity-80">
                    <span>INVENTORY EXPENSES:</span>
                    <span>₱{formatPeso(monthlyData.inventoryExpenses)}</span>
                  </div>
                )}
                <div className="flex justify-between mt-1 pt-1 border-t border-dotted border-black">
                  <span>TOTAL EXPENSES:</span>
                  <span>₱{formatPeso(monthlyData.totalCashOut)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-black pt-1 text-center">
            <span className="text-xs font-bold tracking-widest uppercase">
              Signature
            </span>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs font-black uppercase">{staffName}</p>
            <p className="text-[9px] font-bold opacity-60">Admin&apos;s Name</p>
          </div>
        </ReceiptThermalContent>

        <div className="no-print mt-6 flex flex-col gap-3">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 h-12">
              Save
            </Button>
            <Button
              onClick={() => handlePrint()}
              className="flex flex-1 h-12 gap-2"
            >
              <PrinterIcon className="size-4" /> Print
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
