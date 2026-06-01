import { Printer, X } from "@phosphor-icons/react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	ReceiptThermalContent,
	THERMAL_PAGE_STYLE,
} from "@/integrations/bixolon";
import { cn } from "@/lib/utils";
import { posBtnGhost, posBtnOutline, posBtnPrimary } from "../pos-ui";
import type { PosOrder } from "../types";

interface PosReceiptDialogProps {
	order: PosOrder | null;
	open: boolean;
	onClose: () => void;
	cashierName?: string;
}

export function PosReceiptDialog({
	order,
	open,
	onClose,
	cashierName = "Cashier",
}: PosReceiptDialogProps) {
	const contentRef = useRef<HTMLDivElement>(null);

	const handlePrint = useReactToPrint({
		contentRef,
		pageStyle: THERMAL_PAGE_STYLE,
		onAfterPrint: onClose,
	});

	if (!order) return null;

	const hasDiscount = order.items?.some(
		(i) => i.discount_type && i.discount_type !== "none",
	);
	const orderNote = order.note;

	return (
		<AlertDialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<AlertDialogContent className="w-[calc(100vw-1rem)] max-w-[380px] border-(--light-gray) bg-(--pure-white) p-0">
				<div className="flex flex-col max-h-[85vh] p-3 sm:p-6">
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className={cn("absolute top-2 right-2 rounded-full md:top-4 md:right-4", posBtnGhost)}
						aria-label="Close"
					>
						<X className="size-4 md:size-5" />
					</Button>
					<div className="flex-1 overflow-y-auto min-h-0 scrollbar-none">
						<ReceiptThermalContent ref={contentRef} className="overflow-x-hidden">
							<div className="mb-2 text-center md:mb-4">
								<h2 className="text-xl font-black tracking-tight md:text-3xl">48 COFFEE</h2>
								<div className="text-[10px] font-bold leading-tight md:text-[12px] my-1">
									<p>Ledesma St., Iloilo City Proper,</p>
									<p>Iloilo City, 5000</p>
								</div>
								<h3 className="mt-0.5 text-xs font-bold tracking-widest md:text-base">
									ORDER SLIP
								</h3>
							</div>

							<div className="mb-3 space-y-0.5 text-[11px] font-bold md:mb-4 md:text-[13px]">
								<div className="flex justify-between">
									<span>Order No. :</span>
									<span>{order.order_id}</span>
								</div>
								<div className="flex justify-between">
									<span>Date :</span>
									<span>
										{new Date(order.created_at).toLocaleDateString("en-GB")}
									</span>
								</div>
								<div className="flex justify-between">
									<span>Time :</span>
									<span>
										{new Date(order.created_at).toLocaleTimeString("en-US", {
											hour12: true,
										})}
									</span>
								</div>
							</div>

							<div className="mb-1 border-b border-black pb-0.5 text-[11px] font-black md:mb-2 md:pb-1 md:text-[13px]">
								WALK-IN
							</div>

							<div className="mb-1 grid grid-cols-[35px_1fr_60px] border-b border-black pb-0.5 text-[10px] font-bold md:mb-1 md:grid-cols-[45px_1fr_70px] md:pb-1 md:text-[12px]">
								<span>Qty</span>
								<span>Menu Description</span>
								<span className="text-right">Total Price</span>
							</div>

							<div className="mb-2 space-y-2 md:mb-4 md:space-y-3">
								{order.items?.map((item, idx) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: Items are uniquely identified by their index
									<div key={idx} className="text-[10px] leading-tight md:text-[12px]">
										<div className="grid grid-cols-[35px_1fr_60px] font-bold md:grid-cols-[45px_1fr_70px]">
											<span>{Math.round(item.quantity)}x</span>
											<span className="uppercase break-words">
												{item.snapshot_menu_name}
												{item.snapshot_inventory && item.snapshot_inventory !== item.snapshot_menu_name
													? <span className="font-semibold opacity-80"> {item.snapshot_inventory}</span>
													: null}
											</span>
											<span className="text-right">
												{(item.line_total || 0).toFixed(2)}
											</span>
										</div>
										{item.addon_items && item.addon_items.length > 0 ? (
											<div className="mt-0.5 grid grid-cols-[35px_1fr_60px] text-[9px] md:grid-cols-[45px_1fr_70px] md:text-[11px]">
												<span />
												<span className="break-words whitespace-normal">
													+{" "}
													{item.addon_items
														.map((a) => `${a.addon_name_snapshot} x${a.quantity}`)
														.join(", ")}
												</span>
												<span />
											</div>
										) : null}
									</div>
								))}
							</div>

							<div className="space-y-0.5 border-t border-black pt-1 text-[11px] font-bold md:space-y-1 md:pt-2 md:text-[13px]">
								<div className="flex justify-between">
									<span>Total Quantity :</span>
									<span>
										{order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0}x
									</span>
								</div>
								<div className="flex justify-between pt-0.5 text-xs font-black md:pt-1 md:text-sm">
									<span>Total Paid Sales :</span>
									<span>{order.grand_total.toFixed(2)}</span>
								</div>
							</div>

							{hasDiscount || orderNote ? (
								<div className="mt-1 space-y-0.5 border-t border-dotted border-black pt-1 text-[10px] font-bold md:mt-2 md:space-y-1 md:pt-2 md:text-[12px]">
									{hasDiscount
										? order.items
												?.filter(
													(i) => i.discount_type && i.discount_type !== "none",
												)
												.map((item, idx) => (
													// biome-ignore lint/suspicious/noArrayIndexKey: Secret
													<div key={idx} className="space-y-0.5">
														<div className="flex justify-between uppercase">
															<span>NAME: {item.discount_contact}</span>
														</div>
														<div className="flex justify-between uppercase">
															<span>ID NO: {item.discount_id_number}</span>
														</div>
													</div>
												))
										: null}
									{orderNote ? (
										<div className="flex justify-between uppercase pt-1">
											<span>NOTE: {orderNote}</span>
										</div>
									) : null}
								</div>
							) : null}

							<div className="mt-2 space-y-1 border-t border-dotted border-black pt-1 text-[11px] font-bold md:mt-4 md:space-y-2 md:pt-2 md:text-[13px]">
								{order.method !== "CASH" ? (
									<>
										<div className="flex justify-between">
											<span>Payment Method :</span>
											<span>{order.method}</span>
										</div>
										{order.reference_number ? (
											<div className="flex justify-between">
												<span>Reference No :</span>
												<span>{order.reference_number}</span>
											</div>
										) : null}
									</>
								) : null}

								{order.method === "CASH" ? (
									<>
										<div className="flex justify-between">
											<span>Amount PAID :</span>
											<span>{(order.amount_tendered || 0).toFixed(2)}</span>
										</div>
										<div className="flex justify-between text-xs font-black md:text-sm">
											<span>CHANGE :</span>
											<span>{(order.change_amount || 0).toFixed(2)}</span>
										</div>
									</>
								) : null}
							</div>

							{hasDiscount ? (
								<div className="mt-3 flex items-center gap-1 text-[10px] font-bold md:mt-6 md:gap-2 md:text-[12px]">
									<div className="flex size-3 items-center justify-center border border-black md:size-4">
										<div className="size-1.5 bg-black md:size-2" />
									</div>
									<span>SENIOR CITIZEN / PWD</span>
								</div>
							) : null}

							<div className="mt-4 border-t border-black pt-0.5 text-center md:mt-8 md:pt-1">
								<span className="text-[10px] font-bold tracking-widest uppercase md:text-[12px]">
									Signature
								</span>
							</div>

							<div className="mt-3 text-center md:mt-6">
								<p className="text-[11px] font-black uppercase md:text-[13px]">{cashierName}</p>
								<p className="text-[8px] font-bold opacity-60 md:text-[10px]">
									Cashier&apos;s Name
								</p>
							</div>
						</ReceiptThermalContent>
					</div>

					<div className="no-print flex gap-2 pt-2 bg-(--pure-white) md:gap-3 md:pt-3">
						<Button
							variant="outline"
							onClick={onClose}
							className={cn("h-8 flex-1 text-[9px] md:h-12 md:text-sm", posBtnOutline)}
						>
							Save
						</Button>
						<Button
							onClick={() => handlePrint()}
							className={cn("flex h-8 flex-1 gap-1 text-[9px] md:h-12 md:gap-2 md:text-sm", posBtnPrimary)}
						>
							<Printer className="size-3 md:size-4" /> Print
						</Button>
					</div>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
