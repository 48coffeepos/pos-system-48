import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { sessionQueryOptions } from "@/features/auth/queryOptions";
import { usePosForm } from "../hooks/usePosForm";
import { createOrderMutationOptions } from "../mutationOptions";
import { posPageDataQueryOptions } from "../queryOptions";
import { usePosStore } from "../stores/usePosStore";
import type { CartItem, MenuItem, PosOrder } from "../types";
import {
	cartItemToCreateOrderItem,
	cartItemToPosOrderItem,
} from "../utils";
import { PosCartPanel } from "./PosCartPanel";
import { PosItemCustomizeDialog } from "./PosItemCustomizeDialog";
import { PosOrderConfirmDialog } from "./PosOrderConfirmDialog";
import { PosProductGrid } from "./PosProductGrid";
import { PosReceiptDialog } from "./PosReceiptDialog";

export function PosScreen() {
	const {
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
		resetCheckout,
	} = usePosStore();

	const queryClient = useQueryClient();
	const { data, isLoading, error } = useQuery(posPageDataQueryOptions);
	const { data: session } = useQuery(sessionQueryOptions);
	const createOrderMutation = useMutation(
		createOrderMutationOptions(queryClient),
	);

	const cartTotal = cart.reduce((s, c) => s + c.total_price, 0);

	const form = usePosForm();

	if (error) {
		console.error("POS page data query failed:", error);
	}

	const allMenuItems: MenuItem[] = useMemo(
		() => (data?.menuItems ?? []) as MenuItem[],
		[data],
	);

	const addOns = data?.addOns ?? [];

	const hasDiscountInCart = cart.some((c) => c.discount);
	const hasFreeDrinkInCart = cart.some((c) => c.is_free_drink);

	const menuItems = useMemo(
		() =>
			allMenuItems.filter((item) => {
				if (search && !item.name.toLowerCase().includes(search.toLowerCase()))
					return false;
				return true;
			}),
		[allMenuItems, search],
	);

	const handleCustomizeConfirm = (params: {
		lineKey: string;
		menu_id: string;
		menu_name: string;
		quantity: number;
		cup_type: string;
		cup_size: string;
		unit_price: number;
		total_price: number;
		discount?: string;
		discount_name?: string;
		discount_id?: string;
		is_free_drink?: boolean;
		selected_inventory_id?: string;
		addon_items?: Array<{
			addon_id: string;
			name: string;
			price: number;
			quantity: number;
		}>;
	}) => {
		addToCart(params as CartItem);
	};

	const handleProductClick = useCallback(
		(item: MenuItem) => {
			const hasInventory = item.inventory_items.length > 0;
			const isStandalone = item.type === "STANDALONE";

			if (!hasInventory || isStandalone) {
				const price = hasInventory
					? Number(item.inventory_items[0].price)
					: (item.price ?? 0);
				const newItem: CartItem = {
					lineKey: `${item.menu_id}-NONE-NONE`,
					menu_id: item.menu_id,
					menu_name: item.name,
					quantity: 1,
					cup_type: "NONE",
					cup_size: "NONE",
					unit_price: price,
					total_price: price,
					selected_inventory_id: hasInventory ? item.inventory_items[0].inventory.inventory_id : undefined,
				};
				addToCart(newItem);
			} else {
				setCustomizeItem(item);
			}
		},
		[setCustomizeItem, addToCart],
	);

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
				amount_tendered: values.paymentMethod === "GRAB" ? undefined : paidNum,
				change_amount: values.paymentMethod === "GRAB" ? undefined : changeAmt,
				grand_total: cartTotal,
				note: values.note || undefined,
				items: cart.map(cartItemToCreateOrderItem),
			});

			const order: PosOrder = {
				order_id: placedOrder.order_id,
				created_at: new Date(placedOrder.created_at).toISOString(),
				method: placedOrder.method,
				reference_number: placedOrder.reference_number || undefined,
				amount_tendered:
					placedOrder.amount_tendered !== null
						? Number(placedOrder.amount_tendered)
						: undefined,
				change_amount:
					placedOrder.change_amount !== null
						? Number(placedOrder.change_amount)
						: undefined,
				grand_total: Number(placedOrder.grand_total),
				note: values.note || undefined,
				items: cart.map(cartItemToPosOrderItem),
			};

			setLastOrder(order);
			setShowReceipt(true);
			resetCheckout();
			form.reset(usePosStore.getState().formValues);
			setShowPlaceOrderConfirm(false);
			toast.success(`Order #${order.order_id} placed successfully!`);
			if (placedOrder.pusherPublished === false) {
				toast.warning(
					"Order saved, but the orders list may not update automatically. Refresh if needed.",
				);
			}
		} catch (err: unknown) {
			console.error("Order placement failed:", err);
			const msg = (err as Error)?.message ?? "Unknown error";
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
		setShowPlaceOrderConfirm,
	]);

	return (
		<div
			className="flex flex-1 flex-col min-h-0"
			style={{ background: "var(--warm-beige)" }}
		>
			<div className="flex flex-col flex-1 min-h-0">
				<div className="flex flex-1 overflow-hidden min-h-0">
					<PosProductGrid
						menuItems={menuItems}
						loading={isLoading}
						search={search}
						onSearchChange={setSearch}
						onProductClick={handleProductClick}
					/>
					<PosCartPanel
						cart={cart}
						form={form}
						isPlacingOrder={createOrderMutation.isPending}
						onRemoveFromCart={removeFromCart}
						onUpdateQuantity={handleUpdateQuantity}
						onClearCart={clearCart}
					/>
				</div>
			</div>

			<PosItemCustomizeDialog
				item={customizeItem}
				addOns={addOns}
				onClose={() => setCustomizeItem(null)}
				onConfirm={handleCustomizeConfirm}
				hasDiscountInCart={hasDiscountInCart}
				hasFreeDrinkInCart={hasFreeDrinkInCart}
			/>

			<PosOrderConfirmDialog
				open={showPlaceOrderConfirm}
				total={cartTotal}
				isLoading={createOrderMutation.isPending}
				onClose={() => setShowPlaceOrderConfirm(false)}
				onConfirm={handlePlaceOrder}
			/>

			<PosReceiptDialog
				order={lastOrder}
				open={showReceipt}
				onClose={() => setShowReceipt(false)}
				cashierName={session?.user?.name || "Cashier"}
			/>
		</div>
	);
}
