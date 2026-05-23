import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PosFormValues } from "../schemas/posFormSchema";
import type { CartItem, MenuItem, PosOrder } from "../types";

export const defaultPosFormValues: PosFormValues = {
	note: "",
	paymentMethod: "CASH",
	amountPaid: "",
	referenceNumber: "",
};

interface PosState {
	activeCategory: string;
	search: string;
	showReceipt: boolean;
	showPlaceOrderConfirm: boolean;
	lastOrder: PosOrder | null;
	customizeItem: MenuItem | null;
	cart: CartItem[];
	formValues: PosFormValues;

	setActiveCategory: (category: string) => void;
	setSearch: (search: string) => void;
	setShowReceipt: (show: boolean) => void;
	setShowPlaceOrderConfirm: (show: boolean) => void;
	setLastOrder: (order: PosOrder | null) => void;
	setCustomizeItem: (item: MenuItem | null) => void;
	setCart: (cart: CartItem[]) => void;
	setFormValues: (values: PosFormValues) => void;

	addToCart: (item: CartItem) => void;
	removeFromCart: (lineKey: string) => void;
	updateQuantity: (lineKey: string, quantity: number) => void;
	clearCart: () => void;
	resetCheckout: () => void;
}

export const usePosStore = create<PosState>()(
	persist(
		(set) => ({
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

			addToCart: (item) =>
				set((state) => {
					const existingIndex = state.cart.findIndex(
						(c) => c.lineKey === item.lineKey,
					);
					if (existingIndex > -1) {
						const updated = [...state.cart];
						const newQuantity = updated[existingIndex].quantity + 1;
						updated[existingIndex] = {
							...updated[existingIndex],
							quantity: newQuantity,
							total_price: updated[existingIndex].unit_price * newQuantity,
						};

						toast.success(`${item.menu_name} added to cart`);
						return { cart: updated };
					}
					toast.success(`${item.menu_name} added to cart`);

					return { cart: [...state.cart, item] };
				}),

			removeFromCart: (lineKey) =>
				set((state) => ({
					cart: state.cart.filter((c) => c.lineKey !== lineKey),
				})),

			updateQuantity: (lineKey, quantity) =>
				set((state) => {
					if (quantity <= 0) {
						return { cart: state.cart.filter((c) => c.lineKey !== lineKey) };
					}
					return {
						cart: state.cart.map((c) => {
							if (c.lineKey === lineKey) {
								return {
									...c,
									quantity,
									total_price: c.unit_price * quantity,
								};
							}
							return c;
						}),
					};
				}),

			clearCart: () => set({ cart: [] }),

			resetCheckout: () =>
				set({ cart: [], formValues: defaultPosFormValues }),
		}),
		{
			name: "staff-pos-session-v2",
			partialize: (state) => ({
				activeCategory: state.activeCategory,
				search: state.search,
				formValues: state.formValues,
			}),
		},
	),
);
