import { createServerFn } from "@tanstack/react-start";

import {
	applyInventoryMovement,
	trackNegativeStock,
	type InventoryMovement,
	type NegativeStockItem,
} from "@/features/admin/inventory/server/inventoryMovement";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { seniorPwdDiscountAmount } from "@/features/staff/pos/utils/order-discount";
import type { Discount_Type, Prisma } from "@/generated/prisma/client.js";
import { prisma } from "@/integrations/prisma/db";
import { getOrderEditPolicy, type OrderEditPolicy } from "@/lib/day-bounds";
import { updateOrderItemsInput } from "../schemas/updateOrderItems";

type TransactionClient = Omit<
	Prisma.TransactionClient,
	"$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

function movementForEdit(
	policy: OrderEditPolicy,
	direction: "deduct" | "restore",
): InventoryMovement["kind"] | null {
	if (policy === "historical") return null;
	if (policy === "today") {
		return direction === "deduct" ? "sale" : "sale_reversal";
	}
	return direction === "deduct" ? "beginning_sale" : "beginning_sale_reversal";
}

async function applyOrderEditInventoryMovement(
	tx: TransactionClient,
	snapshotInventory: string,
	policy: OrderEditPolicy,
	direction: "deduct" | "restore",
	quantity: number,
) {
	const kind = movementForEdit(policy, direction);
	if (!kind || quantity <= 0) return null;

	const inv = await tx.inventory.findUnique({
		where: { name: snapshotInventory },
	});
	if (!inv) return null;

	return applyInventoryMovement(tx, inv.inventory_id, { kind, quantity });
}

function computeLineTotals(
	unitPrice: number,
	quantity: number,
	loyalty: boolean,
	discountType: Discount_Type | null | undefined,
	isGrab: boolean,
	addons: Array<{ addon_price_snapshot: number; quantity: number }>,
) {
	let lineTotal = 0;
	let discountAmount = 0;

	if (!loyalty && !isGrab) {
		const subtotal = unitPrice * quantity;
		if (discountType) {
			discountAmount = seniorPwdDiscountAmount(subtotal);
		}
		lineTotal = subtotal - discountAmount;
	}

	const addonsTotal = isGrab
		? 0
		: addons.reduce(
				(sum, addon) => sum + addon.addon_price_snapshot * addon.quantity,
				0,
			);

	return { lineTotal, discountAmount, addonsTotal };
}

export const updateOrderItems = createServerFn({ method: "POST" })
	.middleware([adminAuthMiddleware()])
	.inputValidator(updateOrderItemsInput)
	.handler(async ({ data }) => {
		return prisma.$transaction(async (tx) => {
			const negativeStockByName = new Map<string, NegativeStockItem>();

			const trackDeduct = async (
				snapshotInventory: string,
				policy: OrderEditPolicy,
				quantity: number,
			) => {
				const updated = await applyOrderEditInventoryMovement(
					tx,
					snapshotInventory,
					policy,
					"deduct",
					quantity,
				);
				if (updated) trackNegativeStock(negativeStockByName, updated);
			};

			const order = await tx.order.findUnique({
				where: { order_id: data.orderId },
				include: {
					order_items: {
						include: { addon_items: true },
					},
				},
			});

			if (!order) throw new Error("Order not found");

			const policy = getOrderEditPolicy(order.created_at);
			const isGrab = order.method === "GRAB";

			const existingItemsMap = new Map(
				order.order_items.map((item) => [item.order_item_id, item]),
			);

			const requestedItemIds = new Set(data.items.map((i) => i.order_item_id));

			for (const existingItem of order.order_items) {
				if (!requestedItemIds.has(existingItem.order_item_id)) {
					await applyOrderEditInventoryMovement(
						tx,
						existingItem.snapshot_inventory,
						policy,
						"restore",
						existingItem.quantity,
					);

					await tx.orderItem.delete({
						where: { order_item_id: existingItem.order_item_id },
					});
				}
			}

			let newGrandTotal = 0;

			for (const requestedItem of data.items) {
				const addonPayload = requestedItem.addon_items ?? [];

				if (requestedItem.order_item_id.startsWith("new-")) {
					if (
						!requestedItem.snapshot_inventory ||
						requestedItem.unit_price === undefined ||
						!requestedItem.snapshot_menu_name
					) {
						throw new Error("Missing data for new item");
					}

					await trackDeduct(
						requestedItem.snapshot_inventory,
						policy,
						requestedItem.quantity,
					);

					const loyalty = requestedItem.loyalty ?? false;
					const discountType = requestedItem.discount_type ?? null;
					const lineTotal = isGrab
						? 0
						: (requestedItem.line_total ??
							(() => {
								const computed = computeLineTotals(
									requestedItem.unit_price ?? 0,
									requestedItem.quantity,
									loyalty,
									discountType,
									isGrab,
									addonPayload,
								);
								return computed.lineTotal + computed.addonsTotal;
							})());
					const discountAmount = discountType
						? seniorPwdDiscountAmount(lineTotal)
						: 0;

					newGrandTotal += lineTotal;

					const created = await tx.orderItem.create({
						data: {
							order_id: data.orderId,
							menu_id: requestedItem.menu_id || null,
							snapshot_menu_name: requestedItem.snapshot_menu_name,
							snapshot_price: requestedItem.unit_price,
							snapshot_inventory: requestedItem.snapshot_inventory,
							unit_price: requestedItem.unit_price,
							quantity: requestedItem.quantity,
							line_total: isGrab ? 0 : lineTotal,
							loyalty,
							discount_amount: discountAmount,
							discount_type: discountType,
							discount_id_number: requestedItem.discount_id_number || null,
							discount_contact: requestedItem.discount_contact || null,
						},
					});

					if (addonPayload.length > 0) {
						await tx.orderItemAddon.createMany({
							data: addonPayload.map((addon) => ({
								order_item_id: created.order_item_id,
								addon_id: addon.addon_id,
								addon_name_snapshot: addon.addon_name_snapshot,
								addon_price_snapshot: addon.addon_price_snapshot,
								quantity: addon.quantity,
								total_price: isGrab
									? 0
									: addon.addon_price_snapshot * addon.quantity,
							})),
						});
					}
				} else {
					const existingItem = existingItemsMap.get(
						requestedItem.order_item_id,
					);
					if (!existingItem) {
						throw new Error(
							`Item ${requestedItem.order_item_id} not found in order`,
						);
					}

					const nextInventory =
						requestedItem.snapshot_inventory ?? existingItem.snapshot_inventory;
					const nextUnitPrice =
						requestedItem.unit_price ?? Number(existingItem.unit_price);
					const inventoryChanged =
						nextInventory !== existingItem.snapshot_inventory;

					if (inventoryChanged) {
						await applyOrderEditInventoryMovement(
							tx,
							existingItem.snapshot_inventory,
							policy,
							"restore",
							existingItem.quantity,
						);
						await trackDeduct(
							nextInventory,
							policy,
							requestedItem.quantity,
						);
					} else {
						const quantityDiff =
							requestedItem.quantity - existingItem.quantity;
						if (quantityDiff > 0) {
							await trackDeduct(
								existingItem.snapshot_inventory,
								policy,
								quantityDiff,
							);
						} else if (quantityDiff < 0) {
							await applyOrderEditInventoryMovement(
								tx,
								existingItem.snapshot_inventory,
								policy,
								"restore",
								Math.abs(quantityDiff),
							);
						}
					}

					const loyalty =
						requestedItem.loyalty !== undefined
							? requestedItem.loyalty
							: existingItem.loyalty;
					const discountType =
						requestedItem.discount_type !== undefined
							? requestedItem.discount_type
							: existingItem.discount_type;

					const lineTotal = isGrab
						? 0
						: (requestedItem.line_total ??
							(() => {
								const computed = computeLineTotals(
									nextUnitPrice,
									requestedItem.quantity,
									loyalty,
									discountType,
									isGrab,
									addonPayload,
								);
								return computed.lineTotal + computed.addonsTotal;
							})());
					const discountAmount = discountType
						? seniorPwdDiscountAmount(lineTotal)
						: 0;

					newGrandTotal += lineTotal;

					await tx.orderItemAddon.deleteMany({
						where: { order_item_id: existingItem.order_item_id },
					});

					if (addonPayload.length > 0) {
						await tx.orderItemAddon.createMany({
							data: addonPayload.map((addon) => ({
								order_item_id: existingItem.order_item_id,
								addon_id: addon.addon_id,
								addon_name_snapshot: addon.addon_name_snapshot,
								addon_price_snapshot: addon.addon_price_snapshot,
								quantity: addon.quantity,
								total_price: isGrab
									? 0
									: addon.addon_price_snapshot * addon.quantity,
							})),
						});
					}

					await tx.orderItem.update({
						where: { order_item_id: existingItem.order_item_id },
						data: {
							menu_id: requestedItem.menu_id ?? existingItem.menu_id,
							snapshot_menu_name:
								requestedItem.snapshot_menu_name ??
								existingItem.snapshot_menu_name,
							snapshot_inventory: nextInventory,
							snapshot_price: nextUnitPrice,
							unit_price: nextUnitPrice,
							quantity: requestedItem.quantity,
							loyalty,
							discount_amount: discountAmount,
							discount_type: discountType,
							discount_id_number:
								requestedItem.discount_id_number !== undefined
									? requestedItem.discount_id_number
									: existingItem.discount_id_number,
							discount_contact:
								requestedItem.discount_contact !== undefined
									? requestedItem.discount_contact
									: existingItem.discount_contact,
							line_total: isGrab ? 0 : lineTotal,
						},
					});
				}
			}

			const currentAmountTendered = Number(order.amount_tendered || 0);
			const changeAmount =
				order.method === "CASH"
					? Math.max(0, currentAmountTendered - newGrandTotal)
					: 0;

			await tx.order.update({
				where: { order_id: order.order_id },
				data: {
					grand_total: newGrandTotal,
					change_amount: changeAmount,
				},
			});

			return {
				success: true,
				negative_stock_items: Array.from(negativeStockByName.values()),
			};
		});
	});
