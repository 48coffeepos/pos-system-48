import { o as __toESM } from "../_runtime.mjs";
import { c as auth, m as prisma } from "./auth-BTxLf562.mjs";
import { L as number, R as object, V as string, j as array, k as _enum } from "../_libs/@better-auth/core+[...].mjs";
import { i as getRequestHeaders, r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
import { t as require_pusher } from "../_libs/pusher+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createOrder-DP0Sy2W7.js
var import_pusher = /* @__PURE__ */ __toESM(require_pusher());
var pusherInstance = null;
function hasPusherCredentials() {
	return Boolean(process.env.PUSHER_APP_ID && process.env.VITE_PUSHER_KEY && process.env.PUSHER_SECRET && process.env.VITE_PUSHER_CLUSTER);
}
function getPusher() {
	if (!hasPusherCredentials()) return null;
	if (!pusherInstance) pusherInstance = new import_pusher.default({
		appId: process.env.PUSHER_APP_ID,
		key: process.env.VITE_PUSHER_KEY,
		secret: process.env.PUSHER_SECRET,
		cluster: process.env.VITE_PUSHER_CLUSTER,
		useTLS: true
	});
	return pusherInstance;
}
var createOrderInput = object({
	method: _enum([
		"CASH",
		"GCASH",
		"GRAB"
	]),
	reference_number: string().optional(),
	amount_tendered: number().optional(),
	change_amount: number().optional(),
	grand_total: number(),
	note: string().optional(),
	items: array(object({
		menu_id: string(),
		snapshot_menu_name: string(),
		snapshot_inventory: string(),
		quantity: number(),
		unit_price: number(),
		discount_type: _enum(["PWD", "SENIOR"]).optional(),
		discount_contact: string().optional(),
		discount_id_number: string().optional(),
		line_total: number(),
		note: string().optional(),
		cup_type: string(),
		cup_size: string(),
		selected_inventory_id: string().optional(),
		addon_items: array(object({
			addon_id: string(),
			addon_name_snapshot: string(),
			addon_price_snapshot: number(),
			quantity: number()
		})).optional()
	}))
});
var createOrder_createServerFn_handler = createServerRpc({
	id: "e3a407d71f0b368fa6259013fef310651961705319bce779708ea217ccf3a181",
	name: "createOrder",
	filename: "src/features/staff/pos/server/createOrder.ts"
}, (opts) => createOrder.__executeServer(opts));
var createOrder = createServerFn({ method: "POST" }).inputValidator(createOrderInput).handler(createOrder_createServerFn_handler, async ({ data }) => {
	const order = await prisma.$transaction(async (tx) => {
		const headers = getRequestHeaders();
		const session = await auth.api.getSession({ headers });
		let userId;
		if (session?.user) userId = session.user.id;
		else {
			let fallbackUser = await tx.user.findFirst();
			if (!fallbackUser) fallbackUser = await tx.user.create({ data: {
				id: crypto.randomUUID(),
				name: "Default Staff",
				email: "staff@example.com",
				role: "STAFF"
			} });
			userId = fallbackUser.id;
		}
		const lastOrder = await tx.order.findFirst({
			where: { order_id: { startsWith: "100-" } },
			orderBy: { order_id: "desc" },
			select: { order_id: true }
		});
		let nextNumber = 1;
		if (lastOrder) {
			const parts = lastOrder.order_id.split("-");
			const currentNum = parseInt(parts[1], 10);
			if (!isNaN(currentNum)) nextNumber = currentNum + 1;
		}
		const generatedOrderId = `100-${String(nextNumber).padStart(6, "0")}`;
		const order = await tx.order.create({
			data: {
				order_id: generatedOrderId,
				staff_id: userId,
				method: data.method,
				reference_number: data.reference_number || null,
				amount_tendered: data.amount_tendered !== void 0 ? data.amount_tendered : null,
				change_amount: data.change_amount !== void 0 ? data.change_amount : null,
				grand_total: data.grand_total,
				note: data.note || null,
				order_items: { create: data.items.map((item) => ({
					menu_id: item.menu_id,
					snapshot_menu_name: item.snapshot_menu_name,
					snapshot_price: item.unit_price,
					snapshot_inventory: item.snapshot_inventory,
					unit_price: item.unit_price,
					quantity: item.quantity,
					line_total: item.line_total,
					discount_amount: 5,
					discount_type: item.discount_type || null,
					discount_id_number: item.discount_id_number || null,
					discount_contact: item.discount_contact || null,
					addon_items: item.addon_items ? { create: item.addon_items.map((addon) => ({
						addon_id: addon.addon_id,
						addon_name_snapshot: addon.addon_name_snapshot,
						addon_price_snapshot: addon.addon_price_snapshot,
						quantity: addon.quantity,
						total_price: addon.addon_price_snapshot * addon.quantity
					})) } : void 0
				})) }
			},
			include: { order_items: { include: { addon_items: true } } }
		});
		for (const item of data.items) {
			if (item.selected_inventory_id) {
				await tx.inventory.update({
					where: { inventory_id: item.selected_inventory_id },
					data: { stock: { decrement: item.quantity } }
				});
				continue;
			}
			const menuInventoryLinks = await tx.menuInventory.findMany({
				where: { menu_id: item.menu_id },
				select: { inventory_id: true }
			});
			for (const link of menuInventoryLinks) await tx.inventory.update({
				where: { inventory_id: link.inventory_id },
				data: { stock: { decrement: item.quantity } }
			});
		}
		return {
			...order,
			amount_tendered: order.amount_tendered ? Number(order.amount_tendered) : null,
			change_amount: order.change_amount ? Number(order.change_amount) : null,
			grand_total: Number(order.grand_total),
			order_items: order.order_items.map((item) => ({
				...item,
				snapshot_price: Number(item.snapshot_price),
				unit_price: Number(item.unit_price),
				line_total: Number(item.line_total),
				discount_amount: item.discount_amount ? Number(item.discount_amount) : null,
				addon_items: item.addon_items.map((addon) => ({
					...addon,
					addon_price_snapshot: Number(addon.addon_price_snapshot),
					total_price: Number(addon.total_price)
				}))
			}))
		};
	});
	try {
		const pusher = getPusher();
		if (pusher) await pusher.trigger("orders", "new-order", order);
		else throw Error("Cannot send new order to order list automatically.");
	} catch (err) {
		console.error("Failed to publish Pusher event:", err);
	}
	return order;
});
//#endregion
export { createOrder_createServerFn_handler };
