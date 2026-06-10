import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	applyInventoryMovement,
	type InventoryMovement,
} from "@/features/admin/inventory/server/inventoryMovement";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
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

export const cancelOrder = createServerFn({ method: "POST" })
	.middleware([adminAuthMiddleware()])
	.inputValidator(z.object({ orderId: z.string() }))
	.handler(async ({ data }) => {
		return prisma.$transaction(async (tx) => {
			const order = await tx.order.findUnique({
				where: { order_id: data.orderId },
				include: {
					order_items: true,
				},
			});

			if (!order) throw new Error("Order not found");

			const policy = getOrderEditPolicy(order.created_at);

			// Restore inventory for all items
			for (const item of order.order_items) {
				await applyOrderEditInventoryMovement(
					tx,
					item.snapshot_inventory,
					policy,
					"restore",
					item.quantity,
				);
			}

			// Mark order as canceled instead of deleting it
			const existingNote = order.note ?? "";
			const canceledNote = existingNote
				? `[CANCELED] ${existingNote}`
				: "[CANCELED]";

			await tx.order.update({
				where: { order_id: order.order_id },
				data: { note: canceledNote },
			});

			return { success: true };
		});
	});
