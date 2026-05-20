import { useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import { z } from "zod";
import { useAppForm } from "@/integrations/tanstack-form";
import { formatPeso } from "@/lib/format-currency";
import { StaffHeader } from "@/features/staff/components/StaffHeader";
import { PosProductGrid } from "./PosProductGrid";
import { PosCartPanel } from "./PosCartPanel";
import { PosCupPickerDialog } from "./PosCupPickerDialog";
import { PosOrderConfirmDialog } from "./PosOrderConfirmDialog";
import { PosReceiptDialog } from "./PosReceiptDialog";
import { posPageDataQueryOptions } from "../queryOptions";
import { createOrderMutationOptions } from "../mutationOptions";
import { usePosStore } from "../stores/usePosStore";
import type { MenuItem, CartItem, PosOrder } from "../types";

const posFormSchema = z.object({
	note: z.string(),
	paymentMethod: z.enum(["CASH", "GCASH", "GRAB"]),
	amountPaid: z.string(),
	referenceNumber: z.string(),
});

export function PosScreen() {
	const {
		activeCategory,
		setActiveCategory,
		search,
		setSearch,
		showReceipt,
		setShowReceipt,
		showPlaceOrderConfirm,
		setShowPlaceOrderConfirm,
		lastOrder,
		setLastOrder,
		customizeItem,
		setCustomizeItem,
		cart,
		addToCart,
		removeFromCart,
		updateQuantity,
		clearCart,
	} = usePosStore();

	const queryClient = useQueryClient();
	const { data, isLoading, error } = useQuery(posPageDataQueryOptions);
	const createOrderMutation = useMutation(createOrderMutationOptions(queryClient));

	const cartTotal = cart.reduce((s, c) => s + c.total_price, 0);

	const form = useAppForm({
		defaultValues: {
			note: "",
			paymentMethod: "CASH" as "CASH" | "GCASH" | "GRAB",
			amountPaid: "",
			referenceNumber: "",
		},
		validators: {
			onChange: posFormSchema,
		},
		onSubmit: async ({ value }) => {
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
			setShowPlaceOrderConfirm(true);
		},
	});

	if (error) {
		console.error("POS page data query failed:", error);
	}

	const allMenuItems: MenuItem[] = useMemo(
		() => (data?.menuItems ?? []) as MenuItem[],
		[data],
	);

	const addOns = data?.addOns ?? [];
	const categories = data?.categories ?? [];

	const menuItems = useMemo(
		() =>
			allMenuItems.filter((item) => {
				if (activeCategory !== "all" && item.category !== activeCategory)
					return false;
				if (
					search &&
					!item.name.toLowerCase().includes(search.toLowerCase())
				)
					return false;
				return true;
			}),
		[allMenuItems, activeCategory, search],
	);

	const handleCustomizeConfirm = useCallback(
		(params: {
			lineKey: string;
			menu_item_id: number;
			menu_name: string;
			category: string;
			cup_type: string;
			cup_size: string;
			unit_price: number;
			total_price: number;
			discount?: string;
			discount_name?: string;
			discount_id?: string;
			is_free_drink?: boolean;
			addon_items?: Array<{ addon_id: number; name: string; price: number; quantity: number }>;
		}) => {
			addToCart({ ...params, quantity: 1 } as CartItem);
			toast.success(`${params.menu_name} added to cart`);
		},
		[addToCart],
	);

	const handleProductClick = useCallback((item: MenuItem) => {
		if (item.type === "STANDALONE") {
			handleCustomizeConfirm({
				lineKey: `${item.id}-NONE-NONE`,
				menu_item_id: item.id,
				menu_name: item.name,
				category: item.category,
				cup_type: "NONE",
				cup_size: "NONE",
				unit_price: item.price ?? 0,
				total_price: item.price ?? 0,
			});
		} else {
			setCustomizeItem(item);
		}
	}, [handleCustomizeConfirm, setCustomizeItem]);

	const handleUpdateQuantity = useCallback(
		(lineKey: string, delta: number) => {
			const existing = cart.find((c) => c.lineKey === lineKey);
			if (existing) {
				updateQuantity(lineKey, existing.quantity + delta);
			}
		},
		[cart, updateQuantity],
	);

	const handlePlaceOrder = useCallback(async () => {
		const values = form.state.values;
		const paidNum = parseFloat(values.amountPaid) || 0;
		const changeAmt = paidNum - cartTotal;

		try {
			const placedOrder = await createOrderMutation.mutateAsync({
				method: values.paymentMethod,
				reference_number: values.referenceNumber || undefined,
				paid: values.paymentMethod === "GRAB" ? undefined : paidNum,
				change: values.paymentMethod === "GRAB" ? undefined : changeAmt,
				total: cartTotal,
				items: cart.map((c) => ({
					menu_item_id: c.menu_item_id,
					name: c.menu_name,
					quantity: c.quantity,
					unit_price: c.unit_price,
					discount: c.discount,
					discount_name: c.discount_name,
					discount_id: c.discount_id,
					subtotal: c.unit_price * c.quantity,
					total: c.total_price,
					note: values.note || undefined,
					cup_type: c.cup_type,
					cup_size: c.cup_size,
					addon_items: c.addon_items?.map((a) => ({
						addon_id: a.addon_id,
						quantity: a.quantity,
					})),
				})),
			});

			const order: PosOrder = {
				order_number: placedOrder.order_id,
				created_at: new Date(placedOrder.created_at).toISOString(),
				method: placedOrder.method,
				reference_number: placedOrder.reference_number || undefined,
				paid: placedOrder.paid !== null ? placedOrder.paid : undefined,
				change: placedOrder.change !== null ? placedOrder.change : undefined,
				total: placedOrder.total,
				items: cart.map((c) => ({
					name: c.menu_name,
					quantity: c.quantity,
					unit_price: c.unit_price,
					discount: c.discount,
					discount_name: c.discount_name,
					discount_id: c.discount_id,
					subtotal: c.unit_price * c.quantity,
					total: c.total_price,
					note: values.note,
					cup_type: c.cup_type,
					cup_size: c.cup_size,
					addon_items: c.addon_items,
				})),
			};

			setLastOrder(order);
			setShowReceipt(true);
			clearCart();
			form.reset();
			setShowPlaceOrderConfirm(false);
			toast.success(`Order #${order.order_number} placed successfully!`);
		} catch (err: any) {
			console.error("Order placement failed:", err);
			toast.error("Failed to place order: " + (err.message || "Unknown error"));
		}
	}, [cart, cartTotal, clearCart, createOrderMutation, form, setLastOrder, setShowReceipt, setShowPlaceOrderConfirm]);

	const handlePrint = useCallback(() => {
		window.print();
	}, []);

	return (
		<div
			className="flex h-screen flex-col overflow-x-auto"
			style={{ background: "var(--warm-beige)" }}
		>
			<div className="flex flex-col h-full min-w-[1024px]">
				<Toaster position="top-right" richColors />
				<StaffHeader />

				<div className="flex flex-1 overflow-hidden">
				<PosProductGrid
					menuItems={menuItems}
					loading={isLoading}
					search={search}
					activeCategory={activeCategory}
					categories={categories.map((c: string) => ({
						key: c,
						label: c
							.split("_")
							.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
							.join(" "),
					}))}
					onSearchChange={setSearch}
					onCategoryChange={setActiveCategory}
					onProductClick={handleProductClick}
				/>
				<PosCartPanel
					cart={cart}
					form={form}
					onRemoveFromCart={removeFromCart}
					onUpdateQuantity={handleUpdateQuantity}
					onClearCart={clearCart}
					onPlaceOrderClick={() => {
						form.handleSubmit();
					}}
				/>
			</div>
			</div>

			<PosCupPickerDialog
				item={customizeItem}
				addOns={addOns}
				onClose={() => setCustomizeItem(null)}
				onConfirm={handleCustomizeConfirm}
			/>

			<PosOrderConfirmDialog
				open={showPlaceOrderConfirm}
				total={cartTotal}
				onClose={() => setShowPlaceOrderConfirm(false)}
				onConfirm={handlePlaceOrder}
			/>

			<PosReceiptDialog
				order={lastOrder}
				open={showReceipt}
				onClose={() => setShowReceipt(false)}
				onPrint={handlePrint}
				cashierName="Cashier"
			/>
		</div>
	);
}
