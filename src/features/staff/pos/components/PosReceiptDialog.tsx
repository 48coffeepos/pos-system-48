import { Printer } from "@phosphor-icons/react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { posBtnOutline, posBtnPrimary } from "../pos-ui";
import type { PosOrder } from "../types";

interface PosReceiptDialogProps {
	order: PosOrder | null;
	open: boolean;
	onClose: () => void;
	onPrint: () => void;
	cashierName?: string;
}

export function PosReceiptDialog({
	order,
	open,
	onClose,
	onPrint,
	cashierName = "Cashier",
}: PosReceiptDialogProps) {
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
			<AlertDialogContent className="max-w-[380px] border-(--light-gray) bg-(--pure-white) p-8">
				<div
					id="receipt-content"
					className="receipt-thermal font-mono text-[#1a1a1a] select-none"
				>
					<div className="mb-4 text-center">
						<h2 className="text-2xl font-black tracking-tight">48 COFFEE</h2>
						<h3 className="mt-0.5 text-sm font-bold tracking-widest">
							ORDER SLIP
						</h3>
					</div>

					<div className="mb-4 space-y-0.5 text-[11px] font-bold">
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

					<div className="mb-2 border-b border-black pb-1 text-[11px] font-black">
						WALK-IN
					</div>

					<div className="mb-1 grid grid-cols-[40px_1fr_60px] border-b border-black pb-1 text-[10px] font-bold">
						<span>Qty</span>
						<span>Menu Description</span>
						<span className="text-right">Total Price</span>
					</div>

					<div className="mb-4 space-y-3">
						{order.items?.map((item, idx) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Items are uniquely identified by their index
							<div key={idx} className="text-[10px] leading-tight">
								<div className="grid grid-cols-[40px_1fr_60px] font-bold">
									<span>{Math.round(item.quantity)}x</span>
									<span className="uppercase">{item.snapshot_menu_name}</span>
									<span className="text-right">
										{(item.line_total || 0).toFixed(2)}
									</span>
								</div>
								{item.snapshot_inventory &&
								item.snapshot_inventory !== item.snapshot_menu_name ? (
									<div className="mt-0.5 grid grid-cols-[40px_1fr_60px] text-[9px] font-bold opacity-75">
										<span />
										<span className="uppercase">{item.snapshot_inventory}</span>
										<span />
									</div>
								) : null}
								{item.addon_items && item.addon_items.length > 0 ? (
									<div className="mt-0.5 grid grid-cols-[40px_1fr_60px] text-[9px] opacity-70">
										<span />
										<span>
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

					<div className="space-y-1 border-t border-black pt-2 text-[11px] font-bold">
						<div className="flex justify-between">
							<span>Total Quantity :</span>
							<span>
								{order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0}x
							</span>
						</div>
						<div className="flex justify-between pt-1 text-xs font-black">
							<span>Total Paid Sales :</span>
							<span>{order.grand_total.toFixed(2)}</span>
						</div>
					</div>

					{hasDiscount || orderNote ? (
						<div className="mt-2 space-y-1 border-t border-dotted border-black pt-2 text-[9px] font-bold">
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

					<div className="mt-4 space-y-2 border-t border-dotted border-black pt-2 text-[11px] font-bold">
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
								<div className="flex justify-between text-sm font-black">
									<span>CHANGE :</span>
									<span>{(order.change_amount || 0).toFixed(2)}</span>
								</div>
							</>
						) : null}
					</div>

					{hasDiscount ? (
						<div className="mt-6 flex items-center gap-2 text-[10px] font-bold">
							<div className="flex size-4 items-center justify-center border border-black">
								<div className="size-2 bg-black" />
							</div>
							<span>SENIOR CITIZEN / PWD</span>
						</div>
					) : null}

					<div className="mt-8 border-t border-black pt-1 text-center">
						<span className="text-[9px] font-bold tracking-widest uppercase">
							Signature
						</span>
					</div>

					<div className="mt-6 text-center">
						<p className="text-[11px] font-black uppercase">{cashierName}</p>
						<p className="text-[9px] font-bold opacity-60">
							Cashier&apos;s Name
						</p>
					</div>
				</div>

				<div className="no-print mt-8 flex gap-3">
					<Button
						variant="outline"
						onClick={onClose}
						className={cn("h-12 flex-1", posBtnOutline)}
					>
						Save
					</Button>
					<Button
						onClick={onPrint}
						className={cn("flex h-12 flex-1 gap-2", posBtnPrimary)}
					>
						<Printer className="size-4" /> Print
					</Button>
				</div>

				<style>{`
					@media print {
						body * { visibility: hidden !important; }
						#receipt-content, #receipt-content * { visibility: visible !important; }
						#receipt-content {
							position: absolute !important;
							left: 0 !important;
							top: 0 !important;
							width: 100% !important;
							padding: 0 !important;
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
