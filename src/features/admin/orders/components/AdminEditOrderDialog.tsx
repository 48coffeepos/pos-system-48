import {
	MinusIcon,
	PencilSimpleIcon,
	PlusCircle,
	PlusIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { posBadgeDiscount, posBadgeFree } from "@/features/staff/pos/pos-ui";
import type { PosOrder } from "@/features/staff/pos/types";
import { getOrderEditPolicy } from "@/lib/day-bounds";
import { formatPeso } from "@/lib/format-currency";
import {
	cancelOrderMutationOptions,
	updateOrderItemsMutationOptions,
	updateOrderPaymentMutationOptions,
} from "../mutationOptions";
import { AdminOrderItemEditorDialog } from "./AdminOrderItemEditorDialog";

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
	const [items, setItems] = useState<PosOrder["items"]>([]);
	const [itemEditorOpen, setItemEditorOpen] = useState(false);
	const [editingLine, setEditingLine] = useState<PosOrder["items"][number] | null>(
		null,
	);

	const paymentMutation = useMutation(updateOrderPaymentMutationOptions);
	const itemsMutation = useMutation(updateOrderItemsMutationOptions);
	const cancelMutation = useMutation(cancelOrderMutationOptions);

	useEffect(() => {
		if (open && order) {
			setMethod(order.method);
			setAmountTendered(
				order.amount_tendered?.toString() ?? order.grand_total.toString(),
			);
			setReferenceNumber(order.reference_number ?? "");
			setItems(order.items || []);
			setItemEditorOpen(false);
			setEditingLine(null);
		}
	}, [open, order]);

	if (!order) return null;

	const editPolicy = getOrderEditPolicy(new Date(order.created_at));

	// Calculate the new grand total based on the locally edited items list
	let computedGrandTotal = 0;
	if (method !== "GRAB") {
		computedGrandTotal = items.reduce(
			(sum, item) => sum + Number(item.line_total ?? 0),
			0,
		);
	}

	const grandTotal = computedGrandTotal;
	const parsedAmount = parseFloat(amountTendered);
	const validAmount = Number.isFinite(parsedAmount) ? parsedAmount : 0;
	const changeAmount =
		method === "CASH" ? Math.max(0, validAmount - grandTotal) : 0;
	const isAmountValid = validAmount >= grandTotal;
	const isNonCash = method !== "CASH";

	const handleUpdateQuantity = (orderItemId: string, delta: number) => {
		setItems((prev) =>
			prev.map((item) => {
				if (item.order_item_id === orderItemId) {
					const quantity = Math.max(1, item.quantity + delta);
					return {
						...item,
						quantity,
						line_total: Number(item.unit_price) * quantity,
					};
				}
				return item;
			}),
		);
	};

	const handleRemoveItem = (orderItemId: string) => {
		setItems((prev) =>
			prev.filter((item) => item.order_item_id !== orderItemId),
		);
	};

	const handleSaveLine = (line: PosOrder["items"][number]) => {
		setItems((prev) => {
			const existingIndex = prev.findIndex(
				(item) => item.order_item_id === line.order_item_id,
			);
			if (existingIndex >= 0) {
				const next = [...prev];
				next[existingIndex] = line;
				return next;
			}
			return [...prev, line];
		});
	};

	const handleSave = async () => {
		// 1. Update items first
		try {
			if (items.length === 0) {
				alert("Cannot save an empty order. Please cancel it instead.");
				return;
			}

			await itemsMutation.mutateAsync({
				orderId: order.order_id,
				items: items.map((i) => ({
					order_item_id: i.order_item_id,
					quantity: i.quantity,
					menu_id: i.menu_id,
					snapshot_menu_name: i.snapshot_menu_name,
					snapshot_inventory: i.snapshot_inventory,
					unit_price: Number(i.unit_price),
					line_total: Number(i.line_total ?? 0),
					loyalty: i.loyalty ?? false,
					discount_type: i.discount_type ?? null,
					discount_contact: i.discount_contact ?? null,
					discount_id_number: i.discount_id_number ?? null,
					addon_items: (i.addon_items ?? []).map((addon) => ({
						addon_id: addon.addon_id,
						addon_name_snapshot: addon.addon_name_snapshot,
						addon_price_snapshot: Number(addon.addon_price_snapshot),
						quantity: addon.quantity,
					})),
				})),
			});

			// 2. Update payment details
			await paymentMutation.mutateAsync({
				orderId: order.order_id,
				method: method as "CASH" | "GCASH" | "GRAB",
				amount_tendered: Math.max(validAmount, grandTotal),
				reference_number: isNonCash ? referenceNumber : undefined,
			});

			onClose();
		} catch (error) {
			console.error("Failed to save order updates", error);
		}
	};

	const handleCancel = async () => {
		if (
			!confirm(
				"Are you sure you want to cancel this order? Inventory will be restored and the order will be disassociated from active records.",
			)
		) {
			return;
		}
		try {
			await cancelMutation.mutateAsync({ orderId: order.order_id });
			onClose();
		} catch (error) {
			console.error("Failed to cancel order", error);
		}
	};

	const isPending = itemsMutation.isPending || paymentMutation.isPending || cancelMutation.isPending;

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogContent className="bg-(--pure-white) flex flex-col max-h-[90vh]">
				<DialogHeader className="flex-row items-start justify-between gap-4 shrink-0">
					<div className="space-y-2">
						<DialogTitle className="text-lg font-bold text-(--near-black)">
							Edit Order
						</DialogTitle>
						<DialogDescription className="text-sm text-(--medium-gray)">
							Update items, quantities, and payment details.
						</DialogDescription>
					</div>
				</DialogHeader>

				{editPolicy === "historical" ? (
					<p className="text-xs text-amber-700 bg-amber-50 border border-amber-200/60 rounded-md px-2 py-1.5 shrink-0">
						Inventory will not be adjusted for orders older than yesterday.
					</p>
				) : null}

				<div className="overflow-y-auto space-y-5 px-1 overflow-x-hidden min-h-0 grow">
					<div className="rounded-lg bg-(--off-white) p-3 text-sm">
						<div className="flex justify-between font-semibold">
							<span>Order No.</span>
							<span className="font-mono text-xs">{order.order_id}</span>
						</div>
						<div className="mt-1 flex justify-between font-semibold">
							<span>Grand Total</span>
							<span>{method === "GRAB" ? "--" : formatPeso(grandTotal)}</span>
						</div>
					</div>

					<div className="space-y-3 border border-(--light-gray) rounded-lg p-3">
						<h4 className="text-xs font-bold uppercase tracking-wider text-(--medium-gray)">
							Order Items
						</h4>
						<div className="max-h-48 overflow-y-auto space-y-2">
							{items.length === 0 ? (
								<p className="text-xs text-red-500 py-1">
									Order must have at least 1 item.
								</p>
							) : (
								items.map((item) => (
									<div
										key={item.order_item_id}
										className="flex items-start justify-between gap-2 bg-white rounded-md p-2 border border-(--light-gray)/40 text-sm"
									>
										<div className="min-w-0 flex-1">
											<div className="font-bold text-(--near-black)">
												{item.snapshot_menu_name}
											</div>
											<div className="text-xs text-(--medium-gray)">
												{item.snapshot_inventory}
											</div>
											<div className="mt-1 flex flex-wrap gap-1">
												{item.loyalty ? (
													<span className={posBadgeFree}>Free</span>
												) : null}
												{item.discount_type ? (
													<span className={posBadgeDiscount}>
														{item.discount_type === "SENIOR" ? "Senior" : "PWD"}
													</span>
												) : null}
											</div>
											{item.addon_items && item.addon_items.length > 0 ? (
												<p className="mt-1 text-xs italic text-(--coral)">
													+{" "}
													{item.addon_items
														.map(
															(addon) =>
																`${addon.addon_name_snapshot} x${addon.quantity}`,
														)
														.join(", ")}
												</p>
											) : null}
											<p className="mt-1 text-xs font-semibold text-(--deep-forest)">
												{formatPeso(Number(item.line_total ?? 0))}
											</p>
										</div>
										<div className="flex shrink-0 items-center gap-1">
											<div className="flex items-center gap-1 bg-(--off-white) rounded-md border border-(--light-gray)/50 p-0.5">
												<button
													type="button"
													className="size-6 flex items-center justify-center rounded-sm hover:bg-gray-200"
													onClick={() =>
														handleUpdateQuantity(item.order_item_id, -1)
													}
													disabled={item.quantity <= 1}
												>
													<MinusIcon className="size-3.5" />
												</button>
												<span className="w-5 text-center font-bold text-(--near-black) text-sm">
													{item.quantity}
												</span>
												<button
													type="button"
													className="size-6 flex items-center justify-center rounded-sm hover:bg-gray-200"
													onClick={() =>
														handleUpdateQuantity(item.order_item_id, 1)
													}
													disabled={Boolean(item.discount_type)}
												>
													<PlusIcon className="size-3.5" />
												</button>
											</div>
											<button
												type="button"
												className="size-7 flex items-center justify-center rounded-md bg-(--off-white) text-(--deep-forest) hover:bg-(--light-mint)"
												onClick={() => {
													setEditingLine(item);
													setItemEditorOpen(true);
												}}
											>
												<PencilSimpleIcon className="size-4" />
											</button>
											<button
												type="button"
												className="size-7 flex items-center justify-center rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
												onClick={() => handleRemoveItem(item.order_item_id)}
											>
												<TrashIcon className="size-4" />
											</button>
										</div>
									</div>
								))
							)}
						</div>

						<div className="pt-3 border-t border-(--light-gray)">
							<Button
								type="button"
								size="sm"
								className="h-9 w-full text-xs"
								onClick={() => {
									setEditingLine(null);
									setItemEditorOpen(true);
								}}
							>
								<PlusCircle className="mr-1 size-4" /> Add Item
							</Button>
						</div>
					</div>

					<div className="space-y-1.5">
						<label
							htmlFor="edit-order-payment-method"
							className="text-xs font-bold uppercase tracking-wider text-(--medium-gray)"
						>
							Payment Method
						</label>
						<select
							id="edit-order-payment-method"
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

					{method === "CASH" && (
						<div className="space-y-1.5">
							<label
								htmlFor="edit-order-amount-tendered"
								className="text-xs font-bold uppercase tracking-wider text-(--medium-gray)"
							>
								Total Paid (Amount Tendered)
							</label>
							<div className="relative">
								<span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-medium text-(--medium-gray)">
									₱
								</span>
								<input
									id="edit-order-amount-tendered"
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
							{isAmountValid ? (
								<p className="text-xs text-(--medium-gray)">
									Change: {formatPeso(changeAmount)}
								</p>
							) : null}
						</div>
					)}

					{method !== "CASH" ? (
						<div className="space-y-1.5">
							<label
								htmlFor="edit-order-reference-number"
								className="text-xs font-bold uppercase tracking-wider text-(--medium-gray)"
							>
								Reference Number
							</label>
							<input
								id="edit-order-reference-number"
								type="text"
								value={referenceNumber}
								onChange={(e) => setReferenceNumber(e.target.value)}
								placeholder="Enter reference number"
								className="flex w-full h-9 rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
							/>
						</div>
					) : null}
				</div>

				<DialogFooter className="shrink-0">
					<Button
						type="button"
						variant="destructive"
						onClick={handleCancel}
						disabled={isPending}
					>
						Cancel Order
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						disabled={isPending}
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleSave}
						disabled={isPending || !isAmountValid || items.length === 0}
					>
						{isPending ? "Processing..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>

			<AdminOrderItemEditorDialog
				open={itemEditorOpen}
				editingItem={editingLine}
				onClose={() => {
					setItemEditorOpen(false);
					setEditingLine(null);
				}}
				onSave={handleSaveLine}
			/>
		</Dialog>
	);
}
