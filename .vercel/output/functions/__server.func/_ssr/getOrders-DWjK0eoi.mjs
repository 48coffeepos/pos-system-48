import { m as prisma } from "./auth-BTxLf562.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/getOrders-DWjK0eoi.js
var getOrders_createServerFn_handler = createServerRpc({
	id: "d1985c7d1aa5854d58ef7daa42eecf6135a88e29f8ea7c0484c76a4f5a8372f9",
	name: "getOrders",
	filename: "src/features/staff/orders/server/getOrders.ts"
}, (opts) => getOrders.__executeServer(opts));
var getOrders = createServerFn({ method: "GET" }).handler(getOrders_createServerFn_handler, async () => {
	return (await prisma.order.findMany({
		include: {
			staff: true,
			order_items: { include: { addon_items: { include: { addon: true } } } }
		},
		orderBy: { created_at: "desc" }
	})).map((order) => ({
		...order,
		amount_tendered: order.amount_tendered ? Number(order.amount_tendered) : null,
		change_amount: order.change_amount ? Number(order.change_amount) : null,
		grand_total: Number(order.grand_total),
		note: order.note || null,
		staff: { name: order.staff?.name || "Cashier" },
		order_items: order.order_items.map((item) => ({
			...item,
			snapshot_price: Number(item.snapshot_price),
			unit_price: Number(item.unit_price),
			line_total: Number(item.line_total),
			discount_amount: item.discount_amount ? Number(item.discount_amount) : null,
			addon_items: item.addon_items.map((addon) => ({
				...addon,
				addon_price_snapshot: Number(addon.addon_price_snapshot),
				total_price: Number(addon.total_price),
				addon: {
					...addon.addon,
					price: Number(addon.addon.price)
				}
			}))
		}))
	}));
});
//#endregion
export { getOrders_createServerFn_handler };
