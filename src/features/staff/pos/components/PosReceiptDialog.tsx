import { Printer, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	loadBixolonSDK,
	printOrderReceipt,
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
	const [bixolonReady, setBixolonReady] = useState(false);
	const [bixolonLoading, setBixolonLoading] = useState(false);

	const handlePrint = useReactToPrint({
		contentRef,
		pageStyle: THERMAL_PAGE_STYLE,
		onAfterPrint: onClose,
	});

	useEffect(() => {
		if (!open) return;

		setBixolonLoading(true);
		loadBixolonSDK()
			.then((loaded) => {
				setBixolonReady(loaded);
			})
			.catch(() => {
				setBixolonReady(false);
			})
			.finally(() => {
				setBixolonLoading(false);
			});
	}, [open]);

	const handleDirectPrint = () => {
		if (!order) return;
		try {
			printOrderReceipt(order, cashierName);
			onClose();
		} catch (err) {
			console.error("BIXOLON direct print failed:", err);
		}
	};

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
						className={cn("absolute top-2 right-2 rounded-full lg:top-4 lg:right-4", posBtnGhost)}
						aria-label="Close"
					>
						<X className="size-4 lg:size-5" />
					</Button>
					<div className="flex-1 overflow-y-auto min-h-0 scrollbar-none">
						<ReceiptThermalContent ref={contentRef} className="overflow-x-hidden">
							<div className="mb-2 text-center lg:mb-4">
								<h2 className="text-base font-black tracking-tight lg:text-2xl">48 COFFEE</h2>
								<h3 className="mt-0.5 text-[10px] font-bold tracking-widest lg:text-sm">
									ORDER SLIP
								</h3>
							</div>

							<div className="mb-2 space-y-0.5 text-[9px] font-bold lg:mb-4 lg:text-[11px]">
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

							<div className="mb-1 border-b border-black pb-0.5 text-[9px] font-black lg:mb-2 lg:pb-1 lg:text-[11px]">
								WALK-IN
							</div>

							<div className="mb-1 grid grid-cols-[30px_1fr_50px] border-b border-black pb-0.5 text-[8px] font-bold lg:mb-1 lg:grid-cols-[40px_1fr_60px] lg:pb-1 lg:text-[10px]">
								<span>Qty</span>
								<span>Menu Description</span>
								<span className="text-right">Total Price</span>
							</div>

							<div className="mb-2 space-y-2 lg:mb-4 lg:space-y-3">
								{order.items?.map((item, idx) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: Items are uniquely identified by their index
									<div key={idx} className="text-[8px] leading-tight lg:text-[10px]">
										<div className="grid grid-cols-[30px_1fr_50px] font-bold lg:grid-cols-[40px_1fr_60px]">
											<span>{Math.round(item.quantity)}x</span>
											<span className="truncate uppercase">{item.snapshot_menu_name}</span>
											<span className="text-right">
												{(item.line_total || 0).toFixed(2)}
											</span>
										</div>
										{item.snapshot_inventory &&
										item.snapshot_inventory !== item.snapshot_menu_name ? (
											<div className="mt-0.5 grid grid-cols-[30px_1fr_50px] text-[7px] font-bold opacity-75 lg:grid-cols-[40px_1fr_60px] lg:text-[9px]">
												<span />
												<span className="truncate uppercase">{item.snapshot_inventory}</span>
												<span />
											</div>
										) : null}
										{item.addon_items && item.addon_items.length > 0 ? (
											<div className="mt-0.5 grid grid-cols-[30px_1fr_50px] text-[7px] opacity-70 lg:grid-cols-[40px_1fr_60px] lg:text-[9px]">
												<span />
												<span className="truncate">
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

							<div className="space-y-0.5 border-t border-black pt-1 text-[9px] font-bold lg:space-y-1 lg:pt-2 lg:text-[11px]">
								<div className="flex justify-between">
									<span>Total Quantity :</span>
									<span>
										{order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0}x
									</span>
								</div>
								<div className="flex justify-between pt-0.5 text-[10px] font-black lg:pt-1 lg:text-xs">
									<span>Total Paid Sales :</span>
									<span>{order.grand_total.toFixed(2)}</span>
								</div>
							</div>

							{hasDiscount || orderNote ? (
								<div className="mt-1 space-y-0.5 border-t border-dotted border-black pt-1 text-[8px] font-bold lg:mt-2 lg:space-y-1 lg:pt-2 lg:text-[9px]">
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

							<div className="mt-2 space-y-1 border-t border-dotted border-black pt-1 text-[9px] font-bold lg:mt-4 lg:space-y-2 lg:pt-2 lg:text-[11px]">
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
										<div className="flex justify-between text-[10px] font-black lg:text-sm">
											<span>CHANGE :</span>
											<span>{(order.change_amount || 0).toFixed(2)}</span>
										</div>
									</>
								) : null}
							</div>

							{hasDiscount ? (
								<div className="mt-3 flex items-center gap-1 text-[8px] font-bold lg:mt-6 lg:gap-2 lg:text-[10px]">
									<div className="flex size-3 items-center justify-center border border-black lg:size-4">
										<div className="size-1.5 bg-black lg:size-2" />
									</div>
									<span>SENIOR CITIZEN / PWD</span>
								</div>
							) : null}

							<div className="mt-4 border-t border-black pt-0.5 text-center lg:mt-8 lg:pt-1">
								<span className="text-[8px] font-bold tracking-widest uppercase lg:text-[9px]">
									Signature
								</span>
							</div>

							<div className="mt-3 text-center lg:mt-6">
								<p className="text-[9px] font-black uppercase lg:text-[11px]">{cashierName}</p>
								<p className="text-[7px] font-bold opacity-60 lg:text-[9px]">
									Cashier&apos;s Name
								</p>
							</div>
						</ReceiptThermalContent>
					</div>

					<div className="no-print flex flex-col gap-2 pt-2 bg-(--pure-white) lg:gap-3 lg:pt-3">
						<div className="flex gap-2 lg:gap-3">
							<Button
								variant="outline"
								onClick={onClose}
								className={cn("h-8 flex-1 text-[9px] lg:h-12 lg:text-sm", posBtnOutline)}
							>
								Save
							</Button>
							<Button
								onClick={() => handlePrint()}
								className={cn("flex h-8 flex-1 gap-1 text-[9px] lg:h-12 lg:gap-2 lg:text-sm", posBtnPrimary)}
							>
								<Printer className="size-3 lg:size-4" /> Print
							</Button>
						</div>
						{bixolonReady ? (
							<Button
								onClick={handleDirectPrint}
								className={cn("flex h-7 w-full gap-1 text-[8px] lg:h-10 lg:gap-2 lg:text-xs", posBtnOutline)}
							>
								<Printer className="size-3 lg:size-3.5" /> Direct Print (BIXOLON)
							</Button>
						) : bixolonLoading ? (
							<Button
								disabled
								className={cn(
									"flex h-7 w-full gap-1 text-[8px] opacity-50 lg:h-10 lg:gap-2 lg:text-xs",
									posBtnOutline,
								)}
							>
								Detecting printer...
							</Button>
						) : null}
					</div>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
