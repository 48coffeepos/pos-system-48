import { o as __toESM } from "../_runtime.mjs";
import { I as require_jsx_runtime, L as require_react } from "../_libs/@base-ui/react+[...].mjs";
import { n as cn, t as Button$1 } from "./button-B7PjkOIj.mjs";
import { r as n, v as c } from "../_libs/phosphor-icons__react.mjs";
import { i as AlertDialogContent, t as AlertDialog$1 } from "./alert-dialog-BOYnFZY-.mjs";
import { a as loadBixolonSDK, d as posBtnOutline, f as posBtnPrimary, t as THERMAL_PAGE_STYLE, u as posBtnGhost, v as printOrderReceipt } from "./pos-ui-Czx3k4Q7.mjs";
import { t as Z } from "../_libs/react-to-print.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PosReceiptDialog-BH6WGUTq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PosReceiptDialog({ order, open, onClose, cashierName = "Cashier" }) {
	const contentRef = (0, import_react.useRef)(null);
	const [bixolonReady, setBixolonReady] = (0, import_react.useState)(false);
	const [bixolonLoading, setBixolonLoading] = (0, import_react.useState)(false);
	const handlePrint = Z({
		contentRef,
		pageStyle: THERMAL_PAGE_STYLE,
		onAfterPrint: onClose
	});
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setBixolonLoading(true);
		loadBixolonSDK().then((loaded) => {
			setBixolonReady(loaded);
		}).catch(() => {
			setBixolonReady(false);
		}).finally(() => {
			setBixolonLoading(false);
		});
	}, [open]);
	const handleDirectPrint = () => {
		if (!order) return;
		try {
			printOrderReceipt(order, cashierName);
			onClose();
		} catch (err) {
			console.error("BIXOLON direct print failed:", err);
		}
	};
	if (!order) return null;
	const hasDiscount = order.items?.some((i) => i.discount_type && i.discount_type !== "none");
	const orderNote = order.note;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog$1, {
		open,
		onOpenChange: (isOpen) => {
			if (!isOpen) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
			className: "max-w-[380px] border-(--light-gray) bg-(--pure-white) p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					variant: "ghost",
					size: "icon",
					onClick: onClose,
					className: cn("absolute top-4 right-4 rounded-full", posBtnGhost),
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: contentRef,
					id: "receipt-content",
					className: "receipt-thermal font-mono text-[#1a1a1a] select-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-black tracking-tight",
								children: "48 COFFEE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-0.5 text-sm font-bold tracking-widest",
								children: "ORDER SLIP"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 space-y-0.5 text-[11px] font-bold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Order No. :" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order.order_id })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Date :" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(order.created_at).toLocaleDateString("en-GB") })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Time :" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(order.created_at).toLocaleTimeString("en-US", { hour12: true }) })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 border-b border-black pb-1 text-[11px] font-black",
							children: "WALK-IN"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 grid grid-cols-[40px_1fr_60px] border-b border-black pb-1 text-[10px] font-bold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Qty" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Menu Description" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-right",
									children: "Total Price"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 space-y-3",
							children: order.items?.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] leading-tight",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-[40px_1fr_60px] font-bold",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [Math.round(item.quantity), "x"] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "uppercase",
												children: item.snapshot_menu_name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-right",
												children: (item.line_total || 0).toFixed(2)
											})
										]
									}),
									item.snapshot_inventory && item.snapshot_inventory !== item.snapshot_menu_name ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-0.5 grid grid-cols-[40px_1fr_60px] text-[9px] font-bold opacity-75",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "uppercase",
												children: item.snapshot_inventory
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
										]
									}) : null,
									item.addon_items && item.addon_items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-0.5 grid grid-cols-[40px_1fr_60px] text-[9px] opacity-70",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"+",
												" ",
												item.addon_items.map((a) => `${a.addon_name_snapshot} x${a.quantity}`).join(", ")
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
										]
									}) : null
								]
							}, idx))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 border-t border-black pt-2 text-[11px] font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Quantity :" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0, "x"] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between pt-1 text-xs font-black",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Paid Sales :" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order.grand_total.toFixed(2) })]
							})]
						}),
						hasDiscount || orderNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-1 border-t border-dotted border-black pt-2 text-[9px] font-bold",
							children: [hasDiscount ? order.items?.filter((i) => i.discount_type && i.discount_type !== "none").map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-between uppercase",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["NAME: ", item.discount_contact] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-between uppercase",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["ID NO: ", item.discount_id_number] })
								})]
							}, idx)) : null, orderNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-between uppercase pt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["NOTE: ", orderNote] })
							}) : null]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-2 border-t border-dotted border-black pt-2 text-[11px] font-bold",
							children: [order.method !== "CASH" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Payment Method :" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order.method })]
							}), order.reference_number ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reference No :" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order.reference_number })]
							}) : null] }) : null, order.method === "CASH" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Amount PAID :" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: (order.amount_tendered || 0).toFixed(2) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm font-black",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CHANGE :" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: (order.change_amount || 0).toFixed(2) })]
							})] }) : null]
						}),
						hasDiscount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-center gap-2 text-[10px] font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-4 items-center justify-center border border-black",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-2 bg-black" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SENIOR CITIZEN / PWD" })]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 border-t border-black pt-1 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-bold tracking-widest uppercase",
								children: "Signature"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-black uppercase",
								children: cashierName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[9px] font-bold opacity-60",
								children: "Cashier's Name"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "no-print mt-8 flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							variant: "outline",
							onClick: onClose,
							className: cn("h-12 flex-1", posBtnOutline),
							children: "Save"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							onClick: () => handlePrint(),
							className: cn("flex h-12 flex-1 gap-2", posBtnPrimary),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, { className: "size-4" }), " Print"]
						})]
					}), bixolonReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
						onClick: handleDirectPrint,
						className: cn("flex h-10 w-full gap-2 text-xs", posBtnOutline),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, { className: "size-3.5" }), " Direct Print (BIXOLON)"]
					}) : bixolonLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						disabled: true,
						className: cn("flex h-10 w-full gap-2 text-xs opacity-50", posBtnOutline),
						children: "Detecting printer..."
					}) : null]
				})
			]
		})
	});
}
//#endregion
export { PosReceiptDialog as t };
