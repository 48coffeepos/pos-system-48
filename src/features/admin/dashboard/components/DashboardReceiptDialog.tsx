import { PrinterIcon, SpinnerIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  ReceiptThermalContent,
  THERMAL_PAGE_STYLE,
} from "@/integrations/bixolon";
import {
  connectQZ,
  printCupsSalesQZ,
  printRevenueQZ,
} from "@/integrations/qz-tray";

interface CupSale {
  name: string;
  total: number;
  byMethod: Record<string, number>;
}

interface DashboardReceiptDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "cups" | "revenue" | null;
  staffName: string;
  periodLabel: string;
  cupSales: CupSale[];
  revenueByMethod: Record<string, number>;
}

function formatPeso(value: number) {
  return value.toFixed(2);
}

function formatDateTime(date: Date) {
  return date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardReceiptDialog({
  open,
  onClose,
  mode,
  staffName,
  periodLabel,
  cupSales,
  revenueByMethod,
}: DashboardReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [qzReady, setQzReady] = useState(false);
  const [qzLoading, setQzLoading] = useState(false);
  const [qzPrinting, setQzPrinting] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    pageStyle: THERMAL_PAGE_STYLE,
    onAfterPrint: onClose,
  });

  useEffect(() => {
    if (!open) return;
    setQzLoading(true);
    connectQZ()
      .then((connected) => setQzReady(connected))
      .catch(() => setQzReady(false))
      .finally(() => setQzLoading(false));
  }, [open]);

  const cashRevenue = revenueByMethod.CASH ?? 0;
  const gcashRevenue = revenueByMethod.GCASH ?? 0;
  const totalRevenue = cashRevenue + gcashRevenue;

  const handleQzPrint = async () => {
    setQzPrinting(true);
    try {
      if (mode === "cups") {
        await printCupsSalesQZ(staffName, cupSales, periodLabel);
      } else if (mode === "revenue") {
        await printRevenueQZ(
          staffName,
          cashRevenue,
          gcashRevenue,
          totalRevenue,
          periodLabel,
        );
      }
      onClose();
    } catch (err) {
      console.error("QZ Tray print failed:", err);
    } finally {
      setQzPrinting(false);
    }
  };

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
          {mode === "cups" && (
            <div id="cups-sales-receipt">
              <div className="mb-3 text-center">
                <h2 className="text-xl font-black tracking-tight">48 COFFEE</h2>
                <h3 className="mt-0.5 text-xs font-bold uppercase">
                  CUPS SALES
                </h3>
              </div>

              <div className="mb-3 space-y-0.5 text-[10px] font-bold">
                <div className="flex justify-between">
                  <span>Date :</span>
                  <span>{periodLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time :</span>
                  <span>{formatDateTime(new Date())}</span>
                </div>
              </div>

              <div className="mb-2 border-t border-dashed border-black pt-2">
                {cupSales
                  .filter((cup) => cup.total > 0)
                  .map((cup) => (
                    <div
                      key={cup.name}
                      className="mb-2 text-[10px] leading-tight"
                    >
                      <div className="flex justify-between font-bold uppercase">
                        <span>{cup.name}</span>
                        <span>{cup.total} cups</span>
                      </div>
                      <div className="mt-0.5 flex gap-2 text-[9px]">
                        <span>CASH : {cup.byMethod.CASH ?? 0}</span>
                        <span>GCASH : {cup.byMethod.GCASH ?? 0}</span>
                        <span>GRAB : {cup.byMethod.GRAB ?? 0}</span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="border-t border-dashed border-black pt-2 text-[10px] font-bold">
                <div className="mb-0.5 flex justify-between">
                  <span>TOTAL CUPS SOLD :</span>
                  <span>
                    {cupSales.reduce((sum, c) => sum + c.total, 0)} cups
                  </span>
                </div>
                <div className="flex gap-2">
                  <span>
                    CASH :{" "}
                    {cupSales.reduce(
                      (sum, c) => sum + (c.byMethod.CASH ?? 0),
                      0,
                    )}
                  </span>
                  <span>
                    GCASH :{" "}
                    {cupSales.reduce(
                      (sum, c) => sum + (c.byMethod.GCASH ?? 0),
                      0,
                    )}
                  </span>
                  <span>
                    GRAB :{" "}
                    {cupSales.reduce(
                      (sum, c) => sum + (c.byMethod.GRAB ?? 0),
                      0,
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          {mode === "revenue" && (
            <div id="revenue-receipt">
              <div className="mb-3 text-center">
                <h2 className="text-xl font-black tracking-tight">48 COFFEE</h2>
                <h3 className="mt-0.5 text-xs font-bold uppercase">
                  DAILY REVENUE
                </h3>
              </div>

              <div className="mb-3 space-y-0.5 text-[10px] font-bold">
                <div className="flex justify-between">
                  <span>Date :</span>
                  <span>{periodLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time :</span>
                  <span>{formatDateTime(new Date())}</span>
                </div>
              </div>

              <div className="mb-2 border-t border-dashed border-black pt-2 text-[10px] font-bold">
                <div className="flex justify-between mb-1">
                  <span>CASH</span>
                  <span>₱{formatPeso(cashRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GCASH</span>
                  <span>₱{formatPeso(gcashRevenue)}</span>
                </div>
              </div>

              <div className="border-t border-black pt-2 text-[11px] font-black">
                <div className="flex justify-between">
                  <span>TOTAL REVENUE</span>
                  <span>₱{formatPeso(totalRevenue)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-black pt-1 text-center">
            <span className="text-[8px] font-bold tracking-widest uppercase">
              Signature
            </span>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[10px] font-black uppercase">{staffName}</p>
            <p className="text-[8px] font-bold opacity-80">Admin&apos;s Name</p>
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
<PrinterIcon className="size-4" /> Browser Print
            </Button>
          </div>
          {qzReady ? (
            <Button
              onClick={handleQzPrint}
              disabled={qzPrinting}
              variant="outline"
              className="flex h-12 gap-2"
            >
              {qzPrinting ? (
                <><SpinnerIcon className="size-4 animate-spin" /> Printing...</>
              ) : (
                <><PrinterIcon className="size-4" /> Print via QZ Tray</>
              )}
            </Button>
          ) : qzLoading ? (
            <Button disabled variant="outline" className="h-12">
              Connecting to QZ Tray...
            </Button>
          ) : null}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
