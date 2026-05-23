import { o as __toESM } from "../_runtime.mjs";
import { L as number, M as boolean, R as object, V as string, j as array, k as _enum } from "../_libs/@better-auth/core+[...].mjs";
import { I as require_jsx_runtime, L as require_react, N as mergeProps, t as useRender } from "../_libs/@base-ui/react+[...].mjs";
import { r as useStore } from "../_libs/@tanstack/react-form+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as Button$1 } from "./button-B7PjkOIj.mjs";
import { t as Input$1 } from "./input-fxahDhdL.mjs";
import { G as r$1, P as o, T as o$1, n as e, r as n, u as r, w as e$1, y as e$2 } from "../_libs/phosphor-icons__react.mjs";
import { _ as useAppForm, d as Select$1, f as SelectContent, g as Switch$1, h as SelectValue, m as SelectTrigger, p as SelectItem } from "./tanstack-form-BSMHRPNr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CPlEDLjn.mjs";
import { a as useQuery, n as useMutation, r as queryOptions, s as useQueryClient, t as mutationOptions } from "../_libs/tanstack__react-query.mjs";
import { t as sessionQueryOptions } from "./queryOptions-CF7BS3jI.mjs";
import { a as AlertDialogDescription, i as AlertDialogContent, l as AlertDialogTitle, o as AlertDialogFooter, r as AlertDialogCancel, t as AlertDialog$1 } from "./alert-dialog-BOYnFZY-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as inventoryKeys } from "./keys-B5wYk-Lf.mjs";
import { t as formatPeso } from "./format-currency-OpqMVH6X.mjs";
import { c as posBadgeDiscount, d as posBtnOutline, f as posBtnPrimary, g as posSectionMuted, h as posMutedLabel, l as posBadgeFree, m as posCard, o as posAddonDefault, p as posBtnSecondary, s as posAddonSelected, u as posBtnGhost } from "./pos-ui-Czx3k4Q7.mjs";
import { t as PosReceiptDialog } from "./PosReceiptDialog-BH6WGUTq.mjs";
import { t as xreadingKeys } from "./keys-DoxJBujt.mjs";
import { t as PosModal } from "./PosModal-AjEJrogY.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pos-DHoygFPs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PosFormSchema = object({
	note: string(),
	paymentMethod: _enum([
		"CASH",
		"GCASH",
		"GRAB"
	]),
	amountPaid: string(),
	referenceNumber: string()
});
var defaultPosFormValues = {
	note: "",
	paymentMethod: "CASH",
	amountPaid: "",
	referenceNumber: ""
};
var usePosStore = create()(persist((set) => ({
	activeCategory: "all",
	search: "",
	showReceipt: false,
	showPlaceOrderConfirm: false,
	lastOrder: null,
	customizeItem: null,
	cart: [],
	formValues: defaultPosFormValues,
	setActiveCategory: (category) => set({ activeCategory: category }),
	setSearch: (search) => set({ search }),
	setShowReceipt: (show) => set({ showReceipt: show }),
	setShowPlaceOrderConfirm: (show) => set({ showPlaceOrderConfirm: show }),
	setLastOrder: (order) => set({ lastOrder: order }),
	setCustomizeItem: (item) => set({ customizeItem: item }),
	setCart: (cart) => set({ cart }),
	setFormValues: (values) => set({ formValues: values }),
	addToCart: (item) => set((state) => {
		const existingIndex = state.cart.findIndex((c) => c.lineKey === item.lineKey);
		if (existingIndex > -1) {
			const updated = [...state.cart];
			const newQuantity = updated[existingIndex].quantity + 1;
			updated[existingIndex] = {
				...updated[existingIndex],
				quantity: newQuantity,
				total_price: updated[existingIndex].unit_price * newQuantity
			};
			toast.success(`${item.menu_name} added to cart`);
			return { cart: updated };
		}
		toast.success(`${item.menu_name} added to cart`);
		return { cart: [...state.cart, item] };
	}),
	removeFromCart: (lineKey) => set((state) => ({ cart: state.cart.filter((c) => c.lineKey !== lineKey) })),
	updateQuantity: (lineKey, quantity) => set((state) => {
		if (quantity <= 0) return { cart: state.cart.filter((c) => c.lineKey !== lineKey) };
		return { cart: state.cart.map((c) => {
			if (c.lineKey === lineKey) return {
				...c,
				quantity,
				total_price: c.unit_price * quantity
			};
			return c;
		}) };
	}),
	clearCart: () => set({ cart: [] }),
	resetCheckout: () => set({
		cart: [],
		formValues: defaultPosFormValues
	})
}), {
	name: "staff-pos-session-v2",
	partialize: (state) => ({
		activeCategory: state.activeCategory,
		search: state.search,
		formValues: state.formValues
	})
}));
function usePosForm() {
	const formValues = usePosStore((state) => state.formValues);
	const setFormValues = usePosStore((state) => state.setFormValues);
	const form = useAppForm({
		defaultValues: formValues,
		validators: { onChange: PosFormSchema },
		onSubmit: async ({ value }) => {
			const state = usePosStore.getState();
			const cart = state.cart;
			const cartTotal = cart.reduce((s, c) => s + c.total_price, 0);
			if (cart.length === 0) {
				toast.error("Cart is empty");
				return;
			}
			const paidNum = parseFloat(value.amountPaid) || 0;
			if (value.paymentMethod !== "GRAB" && paidNum < cartTotal) {
				toast.error(`Insufficient amount. Total is ${formatPeso(cartTotal)}`);
				return;
			}
			if ((value.paymentMethod === "GCASH" || value.paymentMethod === "GRAB") && !value.referenceNumber.trim()) {
				toast.error("Please enter reference number");
				return;
			}
			state.setShowPlaceOrderConfirm(true);
		}
	});
	(0, import_react.useEffect)(() => {
		const subscription = form.store.subscribe(() => {
			setFormValues(form.state.values);
		});
		return () => subscription.unsubscribe();
	}, [form, setFormValues]);
	(0, import_react.useEffect)(() => {
		const syncFormFromStore = () => {
			form.reset(usePosStore.getState().formValues);
		};
		if (usePosStore.persist.hasHydrated()) syncFormFromStore();
		return usePosStore.persist.onFinishHydration(syncFormFromStore);
	}, [form]);
	return form;
}
var posKeys = {
	all: ["pos"],
	pageData: () => [...posKeys.all, "pageData"]
};
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
var createOrder = createServerFn({ method: "POST" }).inputValidator(createOrderInput).handler(createSsrRpc("e3a407d71f0b368fa6259013fef310651961705319bce779708ea217ccf3a181"));
var createOrderMutationOptions = (queryClient) => mutationOptions({
	mutationFn: async (input) => {
		return createOrder({ data: input });
	},
	onSuccess: async () => {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: posKeys.all }),
			queryClient.invalidateQueries({ queryKey: inventoryKeys.inventory }),
			queryClient.invalidateQueries({ queryKey: ["orders"] }),
			queryClient.invalidateQueries({ queryKey: xreadingKeys.all })
		]);
	}
});
var getPosPageData = createServerFn({ method: "GET" }).handler(createSsrRpc("f4205540128e93ef1605182971db299c76fb9ba9fbdd849c28a6275c9b62977c"));
var posPageDataQueryOptions = queryOptions({
	queryKey: posKeys.pageData(),
	queryFn: () => getPosPageData()
});
function formatCupLine(cup_type, cup_size) {
	if (!cup_type || cup_type === "NONE" || !cup_size || cup_size === "NONE") return null;
	return `${cup_type === "HOT" ? "Hot" : "Iced"} · ${cup_size}`;
}
function cartLineKey(itemId, cupType, cupSize, addonKey, isFreeDrink, discountType) {
	let key = `${itemId}-${cupType}-${cupSize}${addonKey ? `-${addonKey}` : ""}`;
	if (isFreeDrink) key += "-FREE";
	if (discountType && discountType !== "none") key += `-${discountType}`;
	return key;
}
function parseCupInfo(name) {
	const lower = name.toLowerCase();
	return {
		cup_type: lower.includes("iced") ? "ICED" : "HOT",
		cup_size: lower.includes("16oz") ? "16OZ" : "12OZ"
	};
}
var paymentOptions = [
	{
		value: "CASH",
		label: "Cash"
	},
	{
		value: "GCASH",
		label: "GCash"
	},
	{
		value: "GRAB",
		label: "Grab"
	}
];
function PosCartPanel({ cart, form, onRemoveFromCart, onUpdateQuantity, onClearCart }) {
	const paymentMethod = useStore(form.store, (state) => state.values.paymentMethod);
	const amountPaid = useStore(form.store, (state) => state.values.amountPaid);
	const paidNum = parseFloat(amountPaid) || 0;
	const isGrab = paymentMethod === "GRAB";
	const cartTotal = cart.reduce((s, c) => s + c.total_price, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			e.stopPropagation();
			form.handleSubmit();
		},
		className: "flex h-full w-96 flex-col overflow-hidden border-l border-(--light-gray) bg-(--pure-white) p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold",
					style: { color: "var(--near-black)" },
					children: "Current Order"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-[10px] font-semibold tracking-wide uppercase",
					style: { color: "var(--deep-forest)" },
					children: "Walk-in · All orders"
				})] }), cart.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					variant: "ghost",
					size: "icon",
					className: posBtnGhost,
					onClick: onClearCart,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r, {
						className: "size-4",
						style: { color: "var(--coral)" }
					})
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "-mr-1 flex-1 overflow-y-auto pr-1",
				children: [cart.map((item) => {
					const cupLine = formatCupLine(item.cup_type, item.cup_size);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center gap-3 rounded-xl p-3",
						style: { background: "var(--off-white)" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-12 shrink-0 items-center justify-center rounded-lg",
								style: { background: "var(--light-gray)" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, {
									className: "size-6",
									style: { color: "var(--medium-gray)" }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "truncate text-sm font-semibold",
										style: { color: "var(--dark-gray)" },
										children: item.menu_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-0.5 flex flex-wrap gap-1",
										children: [item.is_free_drink ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: posBadgeFree,
											children: "Free"
										}) : null, item.discount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: posBadgeDiscount,
											children: [item.discount === "SENIOR" ? "Senior" : "PWD", " 5%"]
										}) : null]
									}),
									cupLine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-[10px] font-medium",
										style: { color: "var(--medium-gray)" },
										children: cupLine
									}) : null,
									item.addon_items && item.addon_items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[9px] font-semibold italic",
										style: { color: "var(--coral)" },
										children: [
											"+",
											" ",
											item.addon_items.map((a) => `${a.name} x${a.quantity}`).join(", ")
										]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold",
										style: { color: "var(--deep-forest)" },
										children: formatPeso(item.total_price)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
										variant: "secondary",
										size: "icon-xs",
										className: posBtnSecondary,
										onClick: () => item.quantity === 1 ? onRemoveFromCart(item.lineKey) : onUpdateQuantity(item.lineKey, -1),
										children: item.quantity === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$1, { className: "size-3" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-5 text-center text-xs font-bold",
										children: item.quantity
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
										variant: "default",
										size: "icon-xs",
										className: posBtnPrimary,
										disabled: Boolean(item.discount) || Boolean(item.is_free_drink),
										onClick: () => onUpdateQuantity(item.lineKey, 1),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$2, { className: "size-3" })
									})
								]
							})
						]
					}, item.lineKey);
				}), cart.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-32 flex-col items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, {
						className: "mb-2 size-8",
						style: { color: "var(--light-gray)" }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs",
						style: { color: "var(--medium-gray)" },
						children: "Cart is empty"
					})]
				}) : null]
			}),
			cart.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
						name: "note",
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Input, {
							label: "Note",
							placeholder: "Add a note..."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
						name: "paymentMethod",
						listeners: { onChange: ({ value }) => {
							if (value === "CASH") form.setFieldValue("referenceNumber", "");
							else form.setFieldValue("amountPaid", "");
						} },
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Select, {
							label: "Payment Method",
							options: paymentOptions,
							placeholder: "Select..."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							paymentMethod !== "GRAB" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
								name: "amountPaid",
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Input, {
									label: "Amount Paid",
									placeholder: "0.00",
									type: "number",
									step: "0.01",
									min: "0"
								})
							}) : null,
							paymentMethod === "CASH" && !isGrab && amountPaid && paidNum >= cartTotal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-xl p-3",
								style: {
									background: "var(--deep-forest)",
									color: "white"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium opacity-80",
									children: "Change to give"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg font-black",
									children: formatPeso(paidNum - cartTotal)
								})]
							}) : null,
							paymentMethod === "GCASH" || paymentMethod === "GRAB" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
								name: "referenceNumber",
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Input, {
									label: "Reference Number",
									placeholder: "Ref #"
								})
							}) : null
						]
					})
				]
			}) : null,
			cart.length > 0 && !isGrab ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 pt-3",
				style: { borderTop: "1px solid var(--light-gray)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-bold",
						style: { color: "var(--near-black)" },
						children: "Total"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg font-bold",
						style: { color: "var(--deep-forest)" },
						children: formatPeso(cartTotal)
					})]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppForm, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
				type: "submit",
				disabled: cart.length === 0,
				className: cn("w-full", posBtnPrimary),
				children: ["Place Order ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r$1, { className: "size-4" })]
			}) })
		]
	});
}
var CustomizeFormSchema = object({
	discountType: _enum([
		"NONE",
		"SENIOR",
		"PWD"
	]),
	discountName: string(),
	discountId: string(),
	isFreeDrink: boolean(),
	quantity: number().min(1)
}).superRefine((data, ctx) => {
	if (data.discountType === "NONE") return;
	if (!data.discountName.trim()) ctx.addIssue({
		code: "custom",
		message: "Name is required",
		path: ["discountName"]
	});
	if (!data.discountId.trim()) ctx.addIssue({
		code: "custom",
		message: "ID is required",
		path: ["discountId"]
	});
});
function usePosItemCustomizeDialog({ item, selectedInvItem, cupItems, selectedAddons, onConfirm, onClose }) {
	const getCupInfo = (invId) => {
		const match = cupItems.find((c) => c.inventory.inventory_id === invId);
		if (!match) return {
			cup_type: "NONE",
			cup_size: "NONE"
		};
		return parseCupInfo(match.inventory.name);
	};
	return useAppForm({
		defaultValues: {
			discountType: "NONE",
			discountName: "",
			discountId: "",
			isFreeDrink: false,
			quantity: 1
		},
		validators: { onChange: CustomizeFormSchema },
		onSubmit: ({ value }) => {
			if (!item) return;
			const addonItems = Object.entries(selectedAddons).filter(([, v]) => v.quantity > 0).map(([id, v]) => ({
				addon_id: id,
				name: v.name,
				price: v.price,
				quantity: v.quantity
			}));
			const addonsTotal = addonItems.reduce((sum, a) => sum + a.price * a.quantity, 0);
			let finalUnitPrice = (cupItems.find((c) => c.inventory.inventory_id === selectedInvItem)?.price ?? item.price ?? 0) + addonsTotal;
			if (value.isFreeDrink) finalUnitPrice = 0;
			else if (value.discountType !== "NONE") finalUnitPrice = finalUnitPrice - finalUnitPrice * .05;
			const cupInfo = selectedInvItem ? getCupInfo(selectedInvItem) : {
				cup_type: "NONE",
				cup_size: "NONE"
			};
			const addonKey = addonItems.map((a) => `${a.addon_id}x${a.quantity}`).join("_");
			const lineKey = cartLineKey(item.menu_id, cupInfo.cup_type, cupInfo.cup_size, addonKey || void 0, value.isFreeDrink, value.discountType !== "NONE" ? value.discountType : void 0);
			const qty = value.quantity;
			onConfirm({
				lineKey,
				menu_id: item.menu_id,
				menu_name: item.name,
				quantity: qty,
				cup_type: cupInfo.cup_type,
				cup_size: cupInfo.cup_size,
				unit_price: finalUnitPrice,
				total_price: finalUnitPrice * qty,
				discount: value.discountType !== "NONE" ? value.discountType : void 0,
				discount_name: value.discountType !== "NONE" ? value.discountName : void 0,
				discount_id: value.discountType !== "NONE" ? value.discountId : void 0,
				is_free_drink: value.isFreeDrink || void 0,
				selected_inventory_id: selectedInvItem || void 0,
				addon_items: addonItems.length > 0 ? addonItems : void 0
			});
			onClose();
		}
	});
}
function PosItemCustomizeDialog({ item, addOns, onClose, onConfirm, hasDiscountInCart, hasFreeDrinkInCart }) {
	const [selectedInvItem, setSelectedInvItem] = (0, import_react.useState)(null);
	const [showAddons, setShowAddons] = (0, import_react.useState)(false);
	const [selectedAddons, setSelectedAddons] = (0, import_react.useState)({});
	const cupItems = item?.inventory_items?.filter((ii) => ii.inventory.type === "CUP") ?? [];
	const canUseFreeDrink = selectedInvItem !== null;
	const canDiscount = !hasDiscountInCart;
	const form = usePosItemCustomizeDialog({
		item,
		selectedInvItem,
		cupItems,
		selectedAddons,
		onConfirm,
		onClose
	});
	(0, import_react.useEffect)(() => {
		if (!item) return;
		setSelectedInvItem(cupItems.length > 0 ? cupItems[0].inventory.inventory_id : null);
		setShowAddons(false);
		setSelectedAddons({});
		form.reset();
	}, [
		item,
		cupItems.length,
		cupItems[0]?.inventory?.inventory_id,
		form
	]);
	if (!item) return null;
	const selectedCup = cupItems.find((c) => c.inventory.inventory_id === selectedInvItem);
	const basePrice = selectedCup?.price ?? item.price ?? 0;
	const incrementAddon = (addon) => {
		setSelectedAddons((prev) => {
			const existing = prev[addon.addon_id];
			return {
				...prev,
				[addon.addon_id]: {
					name: addon.name,
					price: addon.price,
					quantity: (existing?.quantity ?? 0) + 1
				}
			};
		});
	};
	const decrementAddon = (addon) => {
		setSelectedAddons((prev) => {
			const existing = prev[addon.addon_id];
			if (!existing || existing.quantity <= 1) {
				const { [addon.addon_id]: _, ...rest } = prev;
				return rest;
			}
			return {
				...prev,
				[addon.addon_id]: {
					...existing,
					quantity: existing.quantity - 1
				}
			};
		});
	};
	const liveAddonsTotal = Object.values(selectedAddons).reduce((sum, a) => sum + a.price * a.quantity, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PosModal, {
		open: Boolean(item),
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-bold text-(--deep-forest)",
				children: item.name
			}),
			cupItems.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-(--medium-gray)",
					children: "Cup options"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: cupItems.map((ci) => {
						const isSelected = selectedInvItem === ci.inventory.inventory_id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							variant: isSelected ? "default" : "outline",
							className: cn("flex h-auto flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-xs font-semibold", isSelected ? posBtnPrimary : posBtnOutline),
							onClick: () => setSelectedInvItem(ci.inventory.inventory_id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ci.inventory.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] opacity-70",
								children: formatPeso(Number(ci.price))
							})]
						}, ci.inventory.inventory_id);
					})
				}),
				selectedCup && selectedCup.inventory.stock <= 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 rounded-lg border border-(--soft-peach) bg-(--pale-yellow) px-3 py-2 text-xs font-medium text-(--coral)",
					children: "Out of stock — you can still add this item"
				})
			] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: posMutedLabel,
					children: "Add-ons"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					variant: showAddons ? "default" : "secondary",
					className: showAddons ? posBtnPrimary : posBtnSecondary,
					onClick: () => setShowAddons(!showAddons),
					children: showAddons ? "Active" : "Add?"
				})]
			}), showAddons ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: addOns.map((addon) => {
					const qty = selectedAddons[addon.addon_id]?.quantity ?? 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex items-center justify-between rounded-xl border p-2.5 transition-all", qty > 0 ? posAddonSelected : posAddonDefault),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-[10px] font-bold", qty > 0 ? "text-(--deep-forest)" : "text-(--medium-gray)"),
								children: addon.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[8px] opacity-60",
								children: ["+", formatPeso(addon.price)]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
									variant: "secondary",
									size: "icon-xs",
									className: posBtnSecondary,
									onClick: () => decrementAddon(addon),
									disabled: qty === 0,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$1, { className: "size-3" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-4 text-center text-xs font-bold",
									children: qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
									variant: "default",
									size: "icon-xs",
									className: posBtnPrimary,
									onClick: () => incrementAddon(addon),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$2, { className: "size-3" })
								})
							]
						})]
					}, addon.addon_id);
				})
			}) : null] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 border-t border-(--light-gray) pt-4",
				children: [canDiscount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
					name: "discountType",
					listeners: { onChange: ({ value }) => {
						if (value !== "NONE") form.setFieldValue("quantity", 1);
					} },
					children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: posMutedLabel,
							children: "Discount"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select$1, {
							value: field.state.value,
							onValueChange: (v) => field.handleChange(v ?? "NONE"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-8 w-auto rounded-full border-(--light-gray) bg-(--off-white) px-3 py-1 text-[10px] font-semibold text-(--deep-forest)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "None" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "NONE",
									children: "None"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "SENIOR",
									children: "Senior (5%)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "PWD",
									children: "PWD (5%)"
								})
							] })]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
					selector: (state) => state.values.discountType,
					children: (discountType) => discountType !== "NONE" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
							name: "discountName",
							children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Input, {
								label: "Name",
								placeholder: "Full name"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
							name: "discountId",
							children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Input, {
								label: "ID Number",
								placeholder: "ID #"
							})
						})]
					}) : null
				})] }) : null, canUseFreeDrink && !hasFreeDrinkInCart ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
					name: "isFreeDrink",
					children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex items-center justify-between rounded-lg p-2.5", posSectionMuted),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-(--deep-forest)",
							children: "Free Drink"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
							id: field.name,
							checked: field.state.value,
							onCheckedChange: (checked) => {
								field.handleChange(checked);
								if (checked) form.setFieldValue("quantity", 1);
							}
						})]
					})
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
				selector: (state) => ({
					isFreeDrink: state.values.isFreeDrink,
					discountType: state.values.discountType
				}),
				children: (vals) => {
					const quantityLocked = vals.isFreeDrink || vals.discountType !== "NONE";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: posMutedLabel,
							children: "Quantity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
							name: "quantity",
							children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
										variant: "secondary",
										size: "icon-xs",
										className: posBtnSecondary,
										disabled: quantityLocked || field.state.value <= 1,
										onClick: () => field.handleChange(Math.max(1, field.state.value - 1)),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$1, { className: "size-3" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-5 text-center text-xs font-bold text-(--deep-forest)",
										children: field.state.value
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
										variant: "default",
										size: "icon-xs",
										className: posBtnPrimary,
										disabled: quantityLocked,
										onClick: () => field.handleChange(field.state.value + 1),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$2, { className: "size-3" })
									})
								]
							})
						})]
					});
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
				selector: (state) => ({
					isFreeDrink: state.values.isFreeDrink,
					quantity: state.values.quantity
				}),
				children: (vals) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("mt-4 flex items-center justify-between rounded-xl px-4 py-3", posSectionMuted),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-semibold text-(--medium-gray)",
						children: ["Total", liveAddonsTotal > 0 && !vals.isFreeDrink ? " (incl. add-ons)" : ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-bold text-(--deep-forest)",
						children: formatPeso(vals.isFreeDrink ? 0 : (basePrice + liveAddonsTotal) * vals.quantity)
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					variant: "ghost",
					className: cn("flex-1", posBtnGhost),
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					className: cn("flex-1", posBtnPrimary),
					onClick: () => form.handleSubmit(),
					children: "Add to cart"
				})]
			})
		]
	});
}
function PosOrderConfirmDialog({ open, total, isLoading = false, onClose, onConfirm }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog$1, {
		open,
		onOpenChange: (isOpen) => {
			if (!isOpen) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
			className: "border-(--light-gray) bg-(--pure-white)",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					variant: "ghost",
					size: "icon",
					onClick: onClose,
					className: cn("absolute top-4 right-4 rounded-full", posBtnGhost),
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
					className: "text-(--deep-forest)",
					children: "Confirm Order"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Are you sure you want to place this order for ",
					formatPeso(total),
					"?"
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
					disabled: isLoading,
					className: posBtnOutline,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					onClick: () => {
						onConfirm();
						onClose();
					},
					disabled: isLoading,
					className: posBtnPrimary,
					children: isLoading ? "Confirming..." : "Confirm"
				})] })
			]
		})
	});
}
var badgeVariants = cva("group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!", {
	variants: { variant: {
		default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
		secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
		destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
		outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
		ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
		link: "text-primary underline-offset-4 hover:underline"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant = "default", render, ...props }) {
	return useRender({
		defaultTagName: "span",
		props: mergeProps({ className: cn(badgeVariants({ variant }), className) }, props),
		render,
		state: {
			slot: "badge",
			variant
		}
	});
}
function PosProductCard({ name, price, type, onSelect }) {
	const typeLabel = type === "CUP" ? "Cup" : type === "STANDALONE" ? "Item" : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onSelect,
		className: cn(posCard, "group relative flex h-32 cursor-pointer flex-col p-6 text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-95"),
		children: [
			typeLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: cn("absolute top-3 right-3 text-[10px]", type === "CUP" ? "bg-(--light-mint) text-(--deep-forest)" : "bg-(--off-white) text-(--medium-gray)"),
				children: typeLabel
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-1 line-clamp-2 wrap-break-word text-lg font-bold text-(--deep-forest)",
				title: name,
				children: name
			}),
			price !== null && price !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-bold",
				style: { color: "var(--deep-forest)" },
				children: formatPeso(price)
			})
		]
	});
}
function PosProductGrid({ menuItems, loading, search, onSearchChange, onProductClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col overflow-hidden p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$1, { className: "absolute top-1/2 left-4 size-5 -translate-y-1/2 text-(--medium-gray)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
				type: "text",
				value: search,
				onChange: (e) => onSearchChange(e.target.value),
				placeholder: "Search menu items...",
				className: "h-12 w-full rounded-xl border-(--light-gray) bg-(--pure-white) pl-12 pr-4 text-sm text-(--dark-gray) placeholder:text-(--medium-gray)"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto pr-2",
			children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-4 gap-4",
				children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-pulse rounded-2xl border border-(--light-gray) bg-(--off-white) p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-3 h-24 rounded-xl bg-(--light-gray)" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-2 h-4 w-3/4 rounded bg-(--light-gray)" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-1/3 rounded bg-(--light-gray)" })
					]
				}, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-4 gap-4 pt-3",
				children: menuItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosProductCard, {
					name: item.name,
					price: item.price ?? item.inventory_items[0]?.price ?? null,
					type: item.type,
					onSelect: () => onProductClick(item)
				}, item.menu_id))
			}), !loading && menuItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-64 flex-col items-center justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, { className: "mb-3 size-12 text-(--light-gray)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-(--medium-gray)",
					children: "No items found"
				})]
			}) : null]
		})]
	});
}
function PosScreen() {
	const { search, setSearch, showReceipt, setShowReceipt, showPlaceOrderConfirm, setShowPlaceOrderConfirm, lastOrder, setLastOrder, customizeItem, setCustomizeItem, cart, addToCart, removeFromCart, updateQuantity, clearCart, resetCheckout } = usePosStore();
	const queryClient = useQueryClient();
	const { data, isLoading, error } = useQuery(posPageDataQueryOptions);
	const { data: session } = useQuery(sessionQueryOptions);
	const createOrderMutation = useMutation(createOrderMutationOptions(queryClient));
	const cartTotal = cart.reduce((s, c) => s + c.total_price, 0);
	const form = usePosForm();
	if (error) console.error("POS page data query failed:", error);
	const allMenuItems = (0, import_react.useMemo)(() => data?.menuItems ?? [], [data]);
	const addOns = data?.addOns ?? [];
	const hasDiscountInCart = cart.some((c) => c.discount);
	const hasFreeDrinkInCart = cart.some((c) => c.is_free_drink);
	const menuItems = (0, import_react.useMemo)(() => allMenuItems.filter((item) => {
		if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
		return true;
	}), [allMenuItems, search]);
	const handleCustomizeConfirm = (params) => {
		addToCart(params);
	};
	const handleProductClick = (0, import_react.useCallback)((item) => {
		const hasInventory = item.inventory_items.length > 0;
		const isStandalone = item.type === "STANDALONE";
		if (!hasInventory || isStandalone) {
			const price = hasInventory ? Number(item.inventory_items[0].price) : item.price ?? 0;
			addToCart({
				lineKey: `${item.menu_id}-NONE-NONE`,
				menu_id: item.menu_id,
				menu_name: item.name,
				quantity: 1,
				cup_type: "NONE",
				cup_size: "NONE",
				unit_price: price,
				total_price: price,
				selected_inventory_id: hasInventory ? item.inventory_items[0].inventory.inventory_id : void 0
			});
		} else setCustomizeItem(item);
	}, [setCustomizeItem, addToCart]);
	const handleUpdateQuantity = (0, import_react.useCallback)((lineKey, delta) => {
		const existing = cart.find((c) => c.lineKey === lineKey);
		if (existing) updateQuantity(lineKey, existing.quantity + delta);
	}, [cart, updateQuantity]);
	const handlePlaceOrder = (0, import_react.useCallback)(async () => {
		const values = form.state.values;
		const paidNum = parseFloat(values.amountPaid) || 0;
		const changeAmt = paidNum - cartTotal;
		try {
			const placedOrder = await createOrderMutation.mutateAsync({
				method: values.paymentMethod,
				reference_number: values.referenceNumber || void 0,
				amount_tendered: values.paymentMethod === "GRAB" ? void 0 : paidNum,
				change_amount: values.paymentMethod === "GRAB" ? void 0 : changeAmt,
				grand_total: cartTotal,
				note: values.note || void 0,
				items: cart.map((c) => ({
					menu_id: c.menu_id,
					snapshot_menu_name: c.menu_name,
					snapshot_inventory: c.cup_type && c.cup_type !== "NONE" ? `${c.cup_size} ${c.cup_type}` : c.menu_name,
					quantity: c.quantity,
					unit_price: c.unit_price,
					discount_type: c.discount,
					discount_contact: c.discount_name,
					discount_id_number: c.discount_id,
					line_total: c.total_price,
					cup_type: c.cup_type,
					cup_size: c.cup_size,
					selected_inventory_id: c.selected_inventory_id,
					addon_items: c.addon_items?.map((a) => ({
						addon_id: a.addon_id,
						addon_name_snapshot: a.name,
						addon_price_snapshot: a.price,
						quantity: a.quantity
					}))
				}))
			});
			const order = {
				order_id: placedOrder.order_id,
				created_at: new Date(placedOrder.created_at).toISOString(),
				method: placedOrder.method,
				reference_number: placedOrder.reference_number || void 0,
				amount_tendered: placedOrder.amount_tendered !== null ? Number(placedOrder.amount_tendered) : void 0,
				change_amount: placedOrder.change_amount !== null ? Number(placedOrder.change_amount) : void 0,
				grand_total: Number(placedOrder.grand_total),
				note: values.note || void 0,
				items: cart.map((c) => ({
					snapshot_menu_name: c.menu_name,
					quantity: c.quantity,
					unit_price: c.unit_price,
					discount_type: c.discount,
					discount_contact: c.discount_name,
					discount_id_number: c.discount_id,
					line_total: c.total_price,
					snapshot_inventory: c.cup_type && c.cup_type !== "NONE" ? `${c.cup_size} ${c.cup_type}` : c.menu_name,
					addon_items: c.addon_items?.map((a) => ({
						addon_id: a.addon_id,
						addon_name_snapshot: a.name,
						addon_price_snapshot: a.price,
						quantity: a.quantity
					}))
				}))
			};
			setLastOrder(order);
			setShowReceipt(true);
			resetCheckout();
			form.reset(usePosStore.getState().formValues);
			setShowPlaceOrderConfirm(false);
			toast.success(`Order #${order.order_id} placed successfully!`);
		} catch (err) {
			console.error("Order placement failed:", err);
			const msg = err?.message ?? "Unknown error";
			toast.error(`Failed to place order: ${msg}`);
		}
	}, [
		cart,
		cartTotal,
		resetCheckout,
		createOrderMutation,
		form,
		setLastOrder,
		setShowReceipt,
		setShowPlaceOrderConfirm
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col overflow-x-auto",
		style: { background: "var(--warm-beige)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col h-full min-w-5xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosProductGrid, {
						menuItems,
						loading: isLoading,
						search,
						onSearchChange: setSearch,
						onProductClick: handleProductClick
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosCartPanel, {
						cart,
						form,
						onRemoveFromCart: removeFromCart,
						onUpdateQuantity: handleUpdateQuantity,
						onClearCart: clearCart
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosItemCustomizeDialog, {
				item: customizeItem,
				addOns,
				onClose: () => setCustomizeItem(null),
				onConfirm: handleCustomizeConfirm,
				hasDiscountInCart,
				hasFreeDrinkInCart
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosOrderConfirmDialog, {
				open: showPlaceOrderConfirm,
				total: cartTotal,
				isLoading: createOrderMutation.isPending,
				onClose: () => setShowPlaceOrderConfirm(false),
				onConfirm: handlePlaceOrder
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosReceiptDialog, {
				order: lastOrder,
				open: showReceipt,
				onClose: () => setShowReceipt(false),
				cashierName: session?.user?.name || "Cashier"
			})
		]
	});
}
var SplitComponent = PosScreen;
//#endregion
export { SplitComponent as component };
