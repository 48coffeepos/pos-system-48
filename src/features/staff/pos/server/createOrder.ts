import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import type {
	Discount_Type,
	Payment_Method,
} from "@/generated/prisma/enums.js";
import { auth } from "@/integrations/better-auth/auth";
import { prisma } from "@/integrations/prisma/db";
import { getPusher } from "@/integrations/pusher/server";

const createOrderInput = z.object({
	method: z.enum(["CASH", "GCASH", "GRAB"]),
	reference_number: z.string().optional(),
	amount_tendered: z.number().optional(),
	change_amount: z.number().optional(),
	grand_total: z.number(),
	note: z.string().optional(),
	items: z.array(
		z.object({
			menu_id: z.string(),
			snapshot_menu_name: z.string(),
			snapshot_inventory: z.string(),
			quantity: z.number(),
			unit_price: z.number(),
			discount_type: z.enum(["PWD", "SENIOR"]).optional(),
			discount_contact: z.string().optional(),
			discount_id_number: z.string().optional(),
			line_total: z.number(),
			note: z.string().optional(),
			cup_type: z.string(),
			cup_size: z.string(),
			selected_inventory_id: z.string().optional(),
			addon_items: z
				.array(
					z.object({
						addon_id: z.string(),
						addon_name_snapshot: z.string(),
						addon_price_snapshot: z.number(),
						quantity: z.number(),
					}),
				)
				.optional(),
		}),
	),
});

export const createOrder = createServerFn({ method: "POST" })
	.inputValidator(createOrderInput)
	.handler(async ({ data }) => {
		const order = await prisma.$transaction(async (tx) => {
			const headers = getRequestHeaders();
			const session = await auth.api.getSession({ headers });

			let userId: string;
			if (session?.user) {
				userId = session.user.id;
			} else {
				let fallbackUser = await tx.user.findFirst();
				if (!fallbackUser) {
					fallbackUser = await tx.user.create({
						data: {
							id: crypto.randomUUID(),
							name: "Default Staff",
							email: "staff@example.com",
							role: "STAFF",
						},
					});
				}
				userId = fallbackUser.id;
			}

			const lastOrder = await tx.order.findFirst({
				where: { order_id: { startsWith: "100-" } },
				orderBy: { order_id: "desc" },
				select: { order_id: true },
			});

			let nextNumber = 1;
			if (lastOrder) {
				const parts = lastOrder.order_id.split("-");
				const currentNum = parseInt(parts[1], 10);
				if (!isNaN(currentNum)) {
					nextNumber = currentNum + 1;
				}
			}

			const paddedNumber = String(nextNumber).padStart(6, "0");
			const generatedOrderId = `100-${paddedNumber}`;

			const order = await tx.order.create({
				data: {
					order_id: generatedOrderId,
					staff_id: userId,
					method: data.method as Payment_Method,
					reference_number: data.reference_number || null,
					amount_tendered:
						data.amount_tendered !== undefined ? data.amount_tendered : null,
					change_amount:
						data.change_amount !== undefined ? data.change_amount : null,
					grand_total: data.grand_total,
					note: data.note || null,
					order_items: {
						create: data.items.map((item) => ({
							menu_id: item.menu_id,
							snapshot_menu_name: item.snapshot_menu_name,
							snapshot_price: item.unit_price,
							snapshot_inventory: item.snapshot_inventory,
							unit_price: item.unit_price,
							quantity: item.quantity,
							line_total: item.line_total,
							discount_amount: 5,
							discount_type: (item.discount_type as Discount_Type) || null,
							discount_id_number: item.discount_id_number || null,
							discount_contact: item.discount_contact || null,
							addon_items: item.addon_items
								? {
										create: item.addon_items.map((addon) => ({
											addon_id: addon.addon_id,
											addon_name_snapshot: addon.addon_name_snapshot,
											addon_price_snapshot: addon.addon_price_snapshot,
											quantity: addon.quantity,
											total_price: addon.addon_price_snapshot * addon.quantity,
										})),
									}
								: undefined,
						})),
					},
				},
				include: {
					order_items: {
						include: {
							addon_items: true,
						},
					},
				},
			});

			for (const item of data.items) {
				if (item.selected_inventory_id) {
					await tx.inventory.update({
						where: { inventory_id: item.selected_inventory_id },
						data: { stock: { decrement: item.quantity } },
					});
					continue;
				}

				const menuInventoryLinks = await tx.menuInventory.findMany({
					where: { menu_id: item.menu_id },
					select: { inventory_id: true },
				});

				for (const link of menuInventoryLinks) {
					await tx.inventory.update({
						where: { inventory_id: link.inventory_id },
						data: { stock: { decrement: item.quantity } },
					});
				}
			}

			return {
				...order,
				amount_tendered: order.amount_tendered
					? Number(order.amount_tendered)
					: null,
				change_amount: order.change_amount ? Number(order.change_amount) : null,
				grand_total: Number(order.grand_total),
				order_items: order.order_items.map((item) => ({
					...item,
					snapshot_price: Number(item.snapshot_price),
					unit_price: Number(item.unit_price),
					line_total: Number(item.line_total),
					discount_amount: item.discount_amount
						? Number(item.discount_amount)
						: null,
					addon_items: item.addon_items.map((addon) => ({
						...addon,
						addon_price_snapshot: Number(addon.addon_price_snapshot),
						total_price: Number(addon.total_price),
					})),
				})),
			};
		});

		try {
			const pusher = getPusher();
			if (pusher) {
				await pusher.trigger("orders", "new-order", order);
			} else {
				throw Error("Cannot send new order to order list automatically.");
			}
		} catch (err) {
			console.error("Failed to publish Pusher event:", err);
		}

		return order;
	});
