import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	applyInventoryMovement,
	type InventoryMovement,
} from "@/features/admin/inventory/server/inventoryMovement";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { seniorPwdDiscountAmount } from "@/features/staff/pos/utils/order-discount";
import type { Prisma } from "@/generated/prisma/client.js";
import { prisma } from "@/integrations/prisma/db";
import { getOrderEditPolicy, type OrderEditPolicy } from "@/lib/day-bounds";

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
	if (!kind || quantity <= 0) return;

	const inv = await tx.inventory.findUnique({
		where: { name: snapshotInventory },
	});
	if (!inv) return;

	await applyInventoryMovement(tx, inv.inventory_id, { kind, quantity });
}

export const updateOrderItemsInput = z.object({
	orderId: z.string(),
	items: z
		.array(
			z.object({
				order_item_id: z.string(),
				quantity: z.number().int().min(1),
				menu_id: z.string().optional(),
				snapshot_menu_name: z.string().optional(),
				snapshot_inventory: z.string().optional(),
				unit_price: z.number().optional(),
			}),
		)
		.min(1, "Order must have at least one item"),
});

export const updateOrderItems = createServerFn({ method: "POST" })
	.middleware([adminAuthMiddleware()])
	.inputValidator(updateOrderItemsInput)
	.handler(async ({ data }) => {
		return prisma.$transaction(async (tx) => {
			const order = await tx.order.findUnique({
				where: { order_id: data.orderId },
				include: {
					order_items: {
						include: { addon_items: true },
					},
				},
			});

			if (!order) throw new Error("Order not found");

			// Yesterday edits adjust beginning_store after the nightly ledger roll.
			const policy = getOrderEditPolicy(order.created_at);

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
			const isGrab = order.method === "GRAB";

			for (const requestedItem of data.items) {
				if (requestedItem.order_item_id.startsWith("new-")) {
					if (
						!requestedItem.snapshot_inventory ||
						!requestedItem.unit_price ||
						!requestedItem.snapshot_menu_name
					) {
						throw new Error("Missing data for new item");
					}

					await applyOrderEditInventoryMovement(
						tx,
						requestedItem.snapshot_inventory,
						policy,
						"deduct",
						requestedItem.quantity,
					);

					const subtotal = requestedItem.unit_price * requestedItem.quantity;
					const newLineTotal = isGrab ? 0 : subtotal;

					newGrandTotal += newLineTotal;

					await tx.orderItem.create({
						data: {
							order_id: data.orderId,
							menu_id: requestedItem.menu_id || null,
							snapshot_menu_name: requestedItem.snapshot_menu_name,
							snapshot_price: requestedItem.unit_price,
							snapshot_inventory: requestedItem.snapshot_inventory,
							unit_price: requestedItem.unit_price,
							quantity: requestedItem.quantity,
							line_total: newLineTotal,
							loyalty: false,
							discount_amount: 0,
						},
					});
				} else {
					const existingItem = existingItemsMap.get(
						requestedItem.order_item_id,
					);
					if (!existingItem) {
						throw new Error(
							`Item ${requestedItem.order_item_id} not found in order`,
						);
					}

					const quantityDiff = requestedItem.quantity - existingItem.quantity;

					if (quantityDiff > 0) {
						await applyOrderEditInventoryMovement(
							tx,
							existingItem.snapshot_inventory,
							policy,
							"deduct",
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

					let newLineTotal = 0;
					let discountAmount = Number(existingItem.discount_amount || 0);
					let addonsTotal = 0;

					if (!existingItem.loyalty && !isGrab) {
						const subtotal =
							Number(existingItem.unit_price) * requestedItem.quantity;

						if (existingItem.discount_type) {
							discountAmount = seniorPwdDiscountAmount(subtotal);
						}
						newLineTotal = subtotal - discountAmount;
					}

					for (const addon of existingItem.addon_items) {
						const newAddonTotal = isGrab
							? 0
							: Number(addon.addon_price_snapshot) * addon.quantity;
						addonsTotal += newAddonTotal;

						if (addon.total_price.toNumber() !== newAddonTotal) {
							await tx.orderItemAddon.update({
								where: { order_item_addon_id: addon.order_item_addon_id },
								data: { total_price: newAddonTotal },
							});
						}
					}

					const fullLineTotal = newLineTotal;
					newGrandTotal += fullLineTotal + addonsTotal;

					await tx.orderItem.update({
						where: { order_item_id: existingItem.order_item_id },
						data: {
							quantity: requestedItem.quantity,
							discount_amount: discountAmount,
							line_total: fullLineTotal,
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

			return { success: true };
		});
	});
