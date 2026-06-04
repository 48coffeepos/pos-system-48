import { PrinterIcon } from "@phosphor-icons/react";
import { useRef, useState, useEffect } from "react";
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
  mode: "monthly" | "dailyRevenue" | null;
  staffName: string;
  monthlyData?: {
    totalRevenue: number;
    totalCashOut: number;
    totalCashIn: number;
    totalExpenses: number;
    monthLabel: string;
    periodStart: string;
    periodEnd: string;
    orderCount: number;
    expenseCount: number;
    revenueByMethod: Record<string, number>;
  };
  dailyData?: {
    totalCashSales: number;
    totalGcashSales: number;
    totalRevenue: number;
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
  dailyData,
}: DashboardReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [grabAmount, setGrabAmount] = useState<string>("");
  const [step, setStep] = useState<"form" | "receipt">("form");

  useEffect(() => {
    if (open) {
      if (mode === "dailyRevenue") {
        setStep("form");
        setGrabAmount("");
      } else {
        setStep("receipt");
      }
    }
  }, [open, mode]);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    pageStyle: THERMAL_PAGE_STYLE,
    onAfterPrint: onClose,
  });

  if (!mode) return null;

  const targetDate = new Date();
  const displayDate = targetDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const displayTime = targetDate.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <AlertDialogContent className="max-w-[360px] p-6">
        {step === "form" ? (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-(--near-black)">Daily Sales Receipt</h2>
              <p className="text-xs text-(--medium-gray) mt-1">Please enter manual sales before generating the receipt.</p>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-(--medium-gray)">
                Manual Grab Sales
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-(--medium-gray)">
                  ₱
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={grabAmount}
                  onChange={(e) => setGrabAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex w-full h-12 rounded-xl border border-(--light-gray) bg-(--off-white) pl-8 pr-3 py-2 text-sm shadow-sm outline-none focus-visible:border-(--deep-forest)"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={() => setStep("receipt")}
                className="flex-1 h-12 rounded-xl bg-(--deep-forest) text-white hover:bg-(--deep-forest)/90"
              >
                Generate Receipt
              </Button>
            </div>
          </div>
        ) : (
          <>
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
                <div className="flex justify-between mt-0.5">
                  <span>TOTAL EXPENSES:</span>
                  <span>₱{formatPeso(monthlyData.totalCashOut)}</span>
                </div>
              </div>

              <div className="mt-2 border-t border-dashed border-black pt-2 text-sm font-black">
                <div className="flex justify-between">
                  <span>TOTAL SALES:</span>
                  <span />
                </div>
              </div>
            </div>
          )}

          {mode === "dailyRevenue" && dailyData && (
            <div id="revenue-receipt">
              <div className="mb-3 text-center">
                <h2 className="text-2xl font-black tracking-tight">48 COFFEE</h2>
                <div className="text-xs font-bold leading-tight my-0.5">
                  <p>Ledesma St., Iloilo City Proper,</p>
                  <p>Iloilo City, 5000</p>
                </div>
                <h3 className="mt-0.5 text-sm font-bold uppercase">
                  DAILY SALES
                </h3>
              </div>

              <div className="mb-3 space-y-0.5 text-xs font-bold">
                <div className="flex justify-between">
                  <span>Date :</span>
                  <span>{displayDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time :</span>
                  <span>{displayTime}</span>
                </div>
              </div>

              <div className="mb-2 border-t border-dashed border-black pt-2 text-xs font-bold">
                <div className="flex justify-between mb-1">
                  <span>CASH SALES:</span>
                  <span className="tabular-nums">₱{formatPeso(dailyData.totalCashSales)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>GCASH SALES:</span>
                  <span className="tabular-nums">₱{formatPeso(dailyData.totalGcashSales)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GRAB SALES:</span>
                  <span className="tabular-nums">₱{formatPeso(Number.isNaN(parseFloat(grabAmount)) ? 0 : parseFloat(grabAmount || "0"))}</span>
                </div>
              </div>

              <div className="border-t border-black pt-2 text-sm font-black">
                <div className="flex justify-between">
                  <span>TOTAL SALES:</span>
                  <span className="tabular-nums">₱{formatPeso(dailyData.totalRevenue + (Number.isNaN(parseFloat(grabAmount)) ? 0 : parseFloat(grabAmount || "0")))}</span>
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
            <div className="flex gap-3 mt-2">
              <Button variant="outline" onClick={onClose} className="flex-1 h-12">
                Close
              </Button>
              <Button
                onClick={() => handlePrint()}
                className="flex flex-1 h-12 gap-2"
              >
                <PrinterIcon className="size-4" /> Print
              </Button>
            </div>
          </div>
        </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
