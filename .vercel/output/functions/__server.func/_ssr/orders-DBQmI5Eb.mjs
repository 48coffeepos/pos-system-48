import { o as __toESM } from "../_runtime.mjs";
import { I as require_jsx_runtime, L as require_react } from "../_libs/@base-ui/react+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { N as e, _ as o } from "../_libs/phosphor-icons__react.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CPlEDLjn.mjs";
import { a as useQuery, r as queryOptions, s as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { t as formatPeso } from "./format-currency-OpqMVH6X.mjs";
import { t as PosReceiptDialog } from "./PosReceiptDialog-BH6WGUTq.mjs";
import { t as require_pusher } from "../_libs/pusher-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-DBQmI5Eb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_pusher = /* @__PURE__ */ __toESM(require_pusher());
var pusherClient = null;
function hasPusherCredentials() {
	return Boolean(typeof import.meta !== "undefined" && "ap1");
}
function getPusherClient() {
	if (!hasPusherCredentials()) return null;
	if (!pusherClient) pusherClient = new import_pusher.default("c701878b5ced7638a54f", { cluster: "ap1" });
	return pusherClient;
}
function usePusherChannel(channelName, eventName, handler) {
	const handlerRef = (0, import_react.useRef)(handler);
	handlerRef.current = handler;
	const isEnabled = hasPusherCredentials();
	const wrappedHandler = (0, import_react.useCallback)((data) => {
		handlerRef.current(data);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!isEnabled) return;
		const pusher = getPusherClient();
		if (!pusher) return;
		const channel = pusher.subscribe(channelName);
		channel.bind(eventName, wrappedHandler);
		return () => {
			channel.unbind(eventName, wrappedHandler);
			pusher.unsubscribe(channelName);
		};
	}, [
		channelName,
		eventName,
		wrappedHandler,
		isEnabled
	]);
}
var orderKeys = { all: ["orders"] };
function OrdersList({ orders = [] }) {
	const [selectedOrder, setSelectedOrder] = (0, import_react.useState)(null);
	const [timeframe, setTimeframe] = (0, import_react.useState)("today");
	const queryClient = useQueryClient();
	const pusherProcessedRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	usePusherChannel("orders", "new-order", (data) => {
		const raw = data;
		if (pusherProcessedRef.current.has(raw.order_id)) return;
		pusherProcessedRef.current.add(raw.order_id);
		queryClient.invalidateQueries({ queryKey: orderKeys.all });
		setSelectedOrder({
			order_id: raw.order_id,
			created_at: new Date(raw.created_at).toISOString(),
			method: raw.method,
			reference_number: raw.reference_number || void 0,
			amount_tendered: raw.amount_tendered !== null ? raw.amount_tendered : void 0,
			change_amount: raw.change_amount !== null ? raw.change_amount : void 0,
			grand_total: raw.grand_total,
			note: raw.note || void 0,
			cashier_name: raw.staff?.name || "Cashier",
			items: raw.order_items.map((item) => ({
				snapshot_menu_name: item.snapshot_menu_name,
				quantity: item.quantity,
				unit_price: item.unit_price,
				discount_type: item.discount_type || void 0,
				discount_contact: item.discount_contact || void 0,
				discount_id_number: item.discount_id_number || void 0,
				line_total: item.line_total,
				note: item.note || void 0,
				snapshot_inventory: item.snapshot_inventory,
				addon_items: item.addon_items.map((ai) => ({
					addon_id: ai.addon_id,
					addon_name_snapshot: ai.addon_name_snapshot,
					addon_price_snapshot: ai.addon_price_snapshot,
					quantity: ai.quantity
				}))
			}))
		});
	});
	const handlePrint = (0, import_react.useCallback)(() => {
		window.print();
	}, []);
	const filteredOrders = orders.filter((order) => {
		const orderDate = new Date(order.created_at);
		const todayStr = (/* @__PURE__ */ new Date()).toDateString();
		const yesterdayDate = /* @__PURE__ */ new Date();
		yesterdayDate.setDate(yesterdayDate.getDate() - 1);
		const yesterdayStr = yesterdayDate.toDateString();
		const orderDateStr = orderDate.toDateString();
		if (timeframe === "today") return orderDateStr === todayStr;
		return orderDateStr === yesterdayStr;
	});
	const viewReceipt = (order) => {
		setSelectedOrder({
			order_id: order.order_id,
			created_at: new Date(order.created_at).toISOString(),
			method: order.method,
			reference_number: order.reference_number || void 0,
			amount_tendered: order.amount_tendered !== null ? order.amount_tendered : void 0,
			change_amount: order.change_amount !== null ? order.change_amount : void 0,
			grand_total: order.grand_total,
			note: order.note || void 0,
			cashier_name: order.staff?.name || "Cashier",
			items: order.order_items.map((item) => ({
				snapshot_menu_name: item.snapshot_menu_name,
				quantity: item.quantity,
				unit_price: item.unit_price,
				discount_type: item.discount_type || void 0,
				discount_contact: item.discount_contact || void 0,
				discount_id_number: item.discount_id_number || void 0,
				line_total: item.line_total,
				note: item.note || void 0,
				snapshot_inventory: item.snapshot_inventory,
				addon_items: item.addon_items.map((ai) => ({
					addon_id: ai.addon_id,
					addon_name_snapshot: ai.addon_name_snapshot,
					addon_price_snapshot: ai.addon_price_snapshot,
					quantity: ai.quantity
				}))
			}))
		});
	};
	const getMethodBadgeClass = (method) => {
		switch (method.toUpperCase()) {
			case "CASH": return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
			case "GCASH": return "bg-blue-50 text-blue-700 border-blue-200/50";
			case "GRAB": return "bg-orange-50 text-orange-700 border-orange-200/50";
			default: return "bg-gray-50 text-gray-700 border-gray-200/50";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold text-(--deep-forest)",
					children: "Recent Transactions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-(--medium-gray) mt-0.5",
					children: "A real-time list of all placed orders"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex self-start gap-1.5 rounded-full bg-(--light-gray)/30 p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTimeframe("today"),
						className: `rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${timeframe === "today" ? "bg-(--deep-forest) text-white shadow-sm" : "text-(--medium-gray) hover:bg-(--light-gray)/50"}`,
						children: "Today"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTimeframe("yesterday"),
						className: `rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${timeframe === "yesterday" ? "bg-(--deep-forest) text-white shadow-sm" : "text-(--medium-gray) hover:bg-(--light-gray)/50"}`,
						children: "Yesterday"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full overflow-x-auto rounded-xl border border-(--light-gray)/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full border-collapse text-left table-fixed",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-(--light-gray)/40 bg-(--off-white) text-xs font-bold uppercase tracking-wider text-(--medium-gray)",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 pl-6 w-[20%]",
								children: "Order No"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 w-[20%]",
								children: "Date & Time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 w-[20%]",
								children: "Payment"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 w-[20%]",
								children: "Total"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 pr-6 no-print w-[20%]",
								children: "Receipt"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-(--light-gray)/40",
						children: filteredOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: 5,
							className: "p-8 text-center text-sm font-medium text-(--medium-gray)",
							children: [
								"No transactions found for",
								" ",
								timeframe === "today" ? "today" : "yesterday",
								"."
							]
						}) }) : filteredOrders.map((order) => {
							const dateObj = new Date(order.created_at);
							const formattedDate = dateObj.toLocaleDateString("en-GB");
							const formattedTime = dateObj.toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
								hour12: true
							});
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "group hover:bg-(--off-white)/50 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 pl-6 font-mono font-bold text-sm text-(--near-black)",
										children: order.order_id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 text-xs font-medium text-(--near-black)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col gap-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formattedDate }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-(--medium-gray)",
												children: formattedTime
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col gap-1 items-start",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getMethodBadgeClass(order.method)}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, { className: "size-3" }), order.method]
											}), order.reference_number && order.method !== "GCASH" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] font-mono text-(--medium-gray)",
												children: ["Ref: ", order.reference_number]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 font-black text-sm text-(--near-black)",
										children: formatPeso(order.grand_total)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 pr-6 no-print",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => viewReceipt(order),
											className: "inline-flex items-center gap-1.5 rounded-lg border border-(--light-gray) bg-white px-3 py-1.5 text-xs font-bold text-(--near-black) transition-all hover:bg-gray-50 active:scale-95 shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, { className: "size-3.5" }), "View Slip"]
										})
									})
								]
							}, order.order_id);
						})
					})]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosReceiptDialog, {
			order: selectedOrder,
			open: !!selectedOrder,
			onClose: () => setSelectedOrder(null),
			onPrint: handlePrint,
			cashierName: selectedOrder?.cashier_name || "Cashier"
		})]
	});
}
var getOrders = createServerFn({ method: "GET" }).handler(createSsrRpc("d1985c7d1aa5854d58ef7daa42eecf6135a88e29f8ea7c0484c76a4f5a8372f9"));
var getOrdersQueryOptions = queryOptions({
	queryKey: orderKeys.all,
	queryFn: () => getOrders()
});
function StaffOrders() {
	const { data: orders, isLoading, error } = useQuery(getOrdersQueryOptions);
	if (error) console.error("Failed to fetch orders:", error);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen",
		style: { background: "var(--warm-beige)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-64 items-center justify-center rounded-2xl border border-(--light-gray) bg-(--pure-white)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 animate-spin rounded-full border-4 border-(--deep-forest) border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-(--medium-gray)",
						children: "Loading orders..."
					})]
				})
			}) : !orders || orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-(--light-gray) bg-(--pure-white) p-12 text-center shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, { className: "mx-auto size-16 text-(--medium-gray)/30 animate-pulse" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 text-lg font-bold text-(--deep-forest)",
						children: "No orders yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-(--medium-gray)",
						children: "Place an order in the POS screen to get started."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrdersList, { orders })
		})
	});
}
//#endregion
export { StaffOrders as component };
