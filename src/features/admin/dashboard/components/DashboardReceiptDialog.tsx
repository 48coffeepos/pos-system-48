import { Printer } from "@phosphor-icons/react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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

	const handlePrint = useReactToPrint({
		contentRef: receiptRef,
		documentTitle: mode === "cups" ? "Cups Sales Receipt" : "Revenue Receipt",
	});

	if (!mode) return null;

	const cashRevenue = revenueByMethod.CASH ?? 0;
	const gcashRevenue = revenueByMethod.GCASH ?? 0;
	const totalRevenue = cashRevenue + gcashRevenue;

	return (
		<AlertDialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<AlertDialogContent className="max-w-[360px] p-6">
				<div
					ref={receiptRef}
					id="receipt-content"
					className="receipt-thermal font-mono text-[#1a1a1a] select-none"
				>
					{mode === "cups" && (
						<div id="cups-sales-receipt">
							<div className="mb-3 text-center">
								<h2 className="text-xl font-black tracking-tight">
									48 COFFEE
								</h2>
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
								<div className="flex justify-between">
									<span>Cashier :</span>
									<span className="uppercase">{staffName}</span>
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
												<span>
													CASH : {cup.byMethod.CASH ?? 0}
												</span>
												<span>
													GCASH : {cup.byMethod.GCASH ?? 0}
												</span>
												<span>
													GRAB : {cup.byMethod.GRAB ?? 0}
												</span>
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
								<h2 className="text-xl font-black tracking-tight">
									48 COFFEE
								</h2>
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
								<div className="flex justify-between">
									<span>Cashier :</span>
									<span className="uppercase">{staffName}</span>
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
						<p className="text-[8px] font-bold opacity-60">
							Cashier&apos;s Name
						</p>
					</div>
				</div>

				<div className="no-print mt-6 flex gap-3">
					<Button variant="outline" onClick={onClose} className="flex-1 h-12">
						Save
					</Button>
					<Button
						onClick={() => handlePrint()}
						className="flex flex-1 h-12 gap-2"
					>
						<Printer className="size-4" /> Print
					</Button>
				</div>

				<style>{`
					@media print {
						@page {
							margin: 4mm;
						}
						body * { visibility: hidden !important; }
						#receipt-content, #receipt-content * { visibility: visible !important; }
						#receipt-content {
							position: absolute !important;
							left: 0 !important;
							top: 0 !important;
							width: 80mm !important;
							padding: 3mm !important;
							margin: 0 !important;
						}
						.no-print { display: none !important; }
					}
					.receipt-thermal {
						font-family: 'Courier New', Courier, monospace;
						line-height: 1.2;
					}
				`}</style>
			</AlertDialogContent>
		</AlertDialog>
	);
}
