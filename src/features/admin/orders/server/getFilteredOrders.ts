import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { DEFAULT_TIMEZONE, getTimeframeBounds } from "@/lib/day-bounds";

export const getFilteredOrders = createServerFn({ method: "GET" })
	.middleware([adminAuthMiddleware()])
	.inputValidator(
		z.object({
			timeframe: z.enum(["all", "today", "yesterday"]).optional(),
			fromDate: z.string().optional(),
			toDate: z.string().optional(),
			page: z.number().optional().default(1),
			pageSize: z.number().optional().default(10),
		}),
	)
	.handler(async ({ data }) => {
		const tz = process.env.TIMEZONE ?? DEFAULT_TIMEZONE;

		let start: Date | undefined;
		let end: Date | undefined;

		if (data.fromDate && data.toDate) {
			const offset = "+08:00";
			start = new Date(`${data.fromDate}T00:00:00${offset}`);
			end = new Date(`${data.toDate}T23:59:59.999${offset}`);
		} else if (data.timeframe && data.timeframe !== "all") {
			const bounds = getTimeframeBounds(data.timeframe, tz);
			start = bounds.start;
			end = bounds.end;
		}

		const where = start && end ? { created_at: { gte: start, lte: end } } : {};
		const skip = (data.page - 1) * data.pageSize;

		const [orders, total] = await Promise.all([
			prisma.order.findMany({
				where,
				include: {
					staff: { select: { name: true } },
					order_items: {
						include: {
							addon_items: {
								select: {
									order_item_addon_id: true,
									addon_id: true,
									addon_name_snapshot: true,
									addon_price_snapshot: true,
									quantity: true,
								},
							},
						},
					},
				},
				orderBy: { created_at: "desc" },
				skip,
				take: data.pageSize,
			}),
			prisma.order.count({ where }),
		]);

		return {
			orders: orders.map((order) => ({
				order_id: order.order_id,
				created_at: order.created_at.toISOString(),
				method: order.method,
				reference_number: order.reference_number || undefined,
				amount_tendered: order.amount_tendered
					? Number(order.amount_tendered)
					: undefined,
				change_amount: order.change_amount
					? Number(order.change_amount)
					: undefined,
				grand_total: Number(order.grand_total),
				note: order.note || undefined,
				cashier_name: order.staff?.name ?? "Cashier",
				items: order.order_items.map((item) => ({
					order_item_id: item.order_item_id,
					snapshot_menu_name: item.snapshot_menu_name,
					quantity: item.quantity,
					unit_price: Number(item.unit_price),
					discount_type: item.discount_type ?? undefined,
					discount_amount: item.discount_amount
						? Number(item.discount_amount)
						: undefined,
					discount_contact: item.discount_contact ?? undefined,
					discount_id_number: item.discount_id_number ?? undefined,
					loyalty: item.loyalty,
					line_total: Number(item.line_total),
					snapshot_inventory: item.snapshot_inventory,
					addon_items: item.addon_items.map((a) => ({
						order_item_addon_id: a.order_item_addon_id,
						addon_id: a.addon_id,
						addon_name_snapshot: a.addon_name_snapshot,
						addon_price_snapshot: Number(a.addon_price_snapshot),
						quantity: a.quantity,
					})),
				})),
			})),
			total,
			totalPages: Math.ceil(total / data.pageSize),
			page: data.page,
		};
	});
