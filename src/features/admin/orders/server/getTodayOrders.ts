import { createServerFn } from "@tanstack/react-start";

import { prisma } from "@/integrations/prisma/db";
import { parseCupInfoKey } from "@/lib/cup-utils";
import { getTodayBounds } from "@/lib/day-bounds";

export const getTodayOrders = createServerFn({ method: "GET" }).handler(
	async () => {
		const { start, end } = getTodayBounds();

		const [orders, allCups] = await Promise.all([
			prisma.order.findMany({
				where: { created_at: { gte: start, lte: end } },
				include: {
					staff: { select: { name: true } },
					order_items: {
						include: {
							addon_items: {
								select: {
									addon_name_snapshot: true,
									addon_price_snapshot: true,
									quantity: true,
								},
							},
						},
					},
				},
				orderBy: { created_at: "desc" },
			}),
			prisma.inventory.findMany({
				where: { type: "CUP" },
				select: { name: true },
			}),
		]);

		const cupNameByKey = new Map<string, string>();
		for (const cup of allCups) {
			const key = parseCupInfoKey(cup.name);
			if (!cupNameByKey.has(key)) {
				cupNameByKey.set(key, cup.name);
			}
		}

		function resolveCupName(snapshotInventory: string): string {
			const key = parseCupInfoKey(snapshotInventory);
			return cupNameByKey.get(key) ?? snapshotInventory;
		}

		const rows: Array<{
			time: string;
			order_id: string;
			staff_name: string;
			method: string;
			note: string | null;
			menu_name: string;
			cup: string;
			quantity: number;
			unit_price: number;
			line_total: number;
			discount_type: string | null;
			addons_summary: string;
		}> = [];

		for (const order of orders) {
			for (const item of order.order_items) {
				const addons = item.addon_items.map(
					(a) =>
						`${a.addon_name_snapshot} (+${Number(a.addon_price_snapshot)})`,
				);

				rows.push({
					time: order.created_at.toLocaleTimeString("en-US", {
						hour: "numeric",
						minute: "2-digit",
						hour12: true,
					}),
					order_id: order.order_id.slice(-6),
					staff_name: order.staff?.name ?? "Cashier",
					method: order.method,
					note: order.note ?? null,
					menu_name: item.snapshot_menu_name,
					cup: resolveCupName(item.snapshot_inventory),
					quantity: item.quantity,
					unit_price: Number(item.unit_price),
					line_total: Number(item.line_total),
					discount_type: item.discount_type ?? null,
					addons_summary: addons.length > 0 ? addons.join(", ") : "",
				});
			}
		}

		return rows;
	},
);
