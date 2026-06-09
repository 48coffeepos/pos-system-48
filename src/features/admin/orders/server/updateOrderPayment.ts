import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const updateOrderPaymentInput = z.object({
	orderId: z.string(),
	method: z.enum(["CASH", "GCASH", "GRAB"]),
	amount_tendered: z.number().min(0),
	reference_number: z.string().optional(),
});

export const updateOrderPayment = createServerFn({ method: "POST" })
	.middleware([adminAuthMiddleware()])
	.inputValidator(updateOrderPaymentInput)
	.handler(async ({ data }) => {
		const order = await prisma.order.findUnique({
			where: { order_id: data.orderId },
			include: {
				order_items: {
					include: { addon_items: true },
				},
			},
		});

		if (!order) {
			throw new Error("Order not found");
		}

		let newGrandTotal = Number(order.grand_total);
		const updates: any[] = [];

		// Changing from GRAB to NON-GRAB -> Restore totals
		if (order.method === "GRAB" && data.method !== "GRAB") {
			newGrandTotal = 0;
			for (const item of order.order_items) {
				let itemLineTotal = 0;
				if (!item.loyalty) {
					itemLineTotal =
						Number(item.unit_price) * item.quantity -
						Number(item.discount_amount || 0);
				}

				let addonsTotal = 0;
				for (const addon of item.addon_items) {
					const addonTotalPrice =
						Number(addon.addon_price_snapshot) * addon.quantity;
					addonsTotal += addonTotalPrice;

					updates.push(
						prisma.orderItemAddon.update({
							where: { order_item_addon_id: addon.order_item_addon_id },
							data: { total_price: addonTotalPrice },
						}),
					);
				}

				const fullLineTotal = itemLineTotal;
				newGrandTotal += fullLineTotal + addonsTotal;

				updates.push(
					prisma.orderItem.update({
						where: { order_item_id: item.order_item_id },
						data: { line_total: fullLineTotal },
					}),
				);
			}
		}
		// Changing from NON-GRAB to GRAB -> Zero out totals
		else if (order.method !== "GRAB" && data.method === "GRAB") {
			newGrandTotal = 0;
			for (const item of order.order_items) {
				for (const addon of item.addon_items) {
					updates.push(
						prisma.orderItemAddon.update({
							where: { order_item_addon_id: addon.order_item_addon_id },
							data: { total_price: 0 },
						}),
					);
				}
				updates.push(
					prisma.orderItem.update({
						where: { order_item_id: item.order_item_id },
						data: { line_total: 0 },
					}),
				);
			}
		}

		const changeAmount =
			data.method === "CASH"
				? Math.max(0, data.amount_tendered - newGrandTotal)
				: 0;

		updates.push(
			prisma.order.update({
				where: { order_id: data.orderId },
				data: {
					method: data.method,
					amount_tendered: data.amount_tendered,
					change_amount: changeAmount,
					reference_number: data.reference_number || null,
					grand_total: newGrandTotal,
				},
				select: { order_id: true },
			}),
		);

		await prisma.$transaction(updates);

		return { success: true, orderId: data.orderId };
	});
