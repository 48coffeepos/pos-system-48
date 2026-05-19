import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import { formatPeso } from "@/lib/format-currency";
import { StaffHeader } from "@/features/staff/components/StaffHeader";
import { PosProductGrid } from "./PosProductGrid";
import { PosCartPanel } from "./PosCartPanel";
import { PosCupPickerDialog } from "./PosCupPickerDialog";
import { PosOrderConfirmDialog } from "./PosOrderConfirmDialog";
import { PosReceiptDialog } from "./PosReceiptDialog";
import { posPageDataQueryOptions } from "../queryOptions";
import { createOrderMutationOptions } from "../mutationOptions";
import type { MenuItem, CartItem, PosOrder } from "../types";

export function PosScreen() {
	const [activeCategory, setActiveCategory] = useState("all");
	const [search, setSearch] = useState("");
	const [showReceipt, setShowReceipt] = useState(false);
	const [showPlaceOrderConfirm, setShowPlaceOrderConfirm] = useState(false);
	const [lastOrder, setLastOrder] = useState<PosOrder | null>(null);
	const [customizeItem, setCustomizeItem] = useState<MenuItem | null>(null);
	const [amountPaid, setAmountPaid] = useState("");
	const [referenceNumber, setReferenceNumber] = useState("");

	const [cart, setCart] = useState<CartItem[]>([]);
	const [paymentMethod, setPaymentMethod] = useState("CASH");
	const [note, setNote] = useState("");

	const queryClient = useQueryClient();
	const { data, isLoading, error } = useQuery(posPageDataQueryOptions);
	const createOrderMutation = useMutation(createOrderMutationOptions(queryClient));

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

	const cartTotal = cart.reduce((s, c) => s + c.total_price, 0);

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
			setCart((prev) => {
				const existing = prev.find((c) => c.lineKey === params.lineKey);
				if (existing) {
					return prev.map((c) =>
						c.lineKey === params.lineKey
							? {
									...c,
									quantity: c.quantity + 1,
									total_price: (c.quantity + 1) * c.unit_price,
								}
							: c,
					);
				}
				return [...prev, { ...params, quantity: 1 } as CartItem];
			});
			toast.success(`${params.menu_name} added to cart`);
		},
		[],
	);

	const handleProductClick = useCallback((item: MenuItem) => {
		const temps = item.temperatures ?? [];
		if (temps.length === 0) {
			handleCustomizeConfirm({
				lineKey: `${item.id}-NONE-NONE`,
				menu_item_id: item.id,
				menu_name: item.name,
				category: item.category,
				cup_type: "NONE",
				cup_size: "NONE",
				unit_price: item.price,
				total_price: item.price,
			});
		} else {
			setCustomizeItem(item);
		}
	}, [handleCustomizeConfirm]);


	const removeFromCart = useCallback((lineKey: string) => {
		setCart((prev) => prev.filter((c) => c.lineKey !== lineKey));
	}, []);

	const updateQuantity = useCallback(
		(lineKey: string, delta: number) => {
			setCart((prev) =>
				prev.map((c) => {
					if (c.lineKey !== lineKey) return c;
					const currentQty = c.quantity || 0;
					const newQty = currentQty + delta;
					if (newQty <= 0) return c;
					return { ...c, quantity: newQty, total_price: newQty * (c.unit_price || 0) };
				}),
			);
		},
		[],
	);

	const clearCart = useCallback(() => {
		setCart([]);
	}, []);

	const validateOrder = useCallback(() => {
		if (cart.length === 0) {
			toast.error("Cart is empty");
			return false;
		}
		const paidNum = parseFloat(amountPaid) || 0;
		if (paymentMethod !== "GRAB" && paidNum < cartTotal) {
			toast.error(`Insufficient amount. Total is ${formatPeso(cartTotal)}`);
			return false;
		}
		if (
			(paymentMethod === "GCASH" || paymentMethod === "GRAB") &&
			!referenceNumber.trim()
		) {
			toast.error("Please enter reference number");
			return false;
		}
		return true;
	}, [cart, amountPaid, cartTotal, paymentMethod, referenceNumber]);

	const handlePlaceOrder = useCallback(async () => {
		if (!validateOrder()) return;

		const paidNum = parseFloat(amountPaid) || 0;
		const changeAmt = paidNum - cartTotal;

		try {
			const placedOrder = await createOrderMutation.mutateAsync({
				method: paymentMethod,
				reference_number: referenceNumber || undefined,
				paid: paymentMethod === "GRAB" ? undefined : paidNum,
				change: paymentMethod === "GRAB" ? undefined : changeAmt,
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
					note: note || undefined,
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
					note,
					cup_type: c.cup_type,
					cup_size: c.cup_size,
					addon_items: c.addon_items,
				})),
			};

			setLastOrder(order);
			setShowReceipt(true);
			clearCart();
			setAmountPaid("");
			setReferenceNumber("");
			setShowPlaceOrderConfirm(false);
			toast.success(`Order #${order.order_number} placed successfully!`);
		} catch (err: any) {
			console.error("Order placement failed:", err);
			toast.error("Failed to place order: " + (err.message || "Unknown error"));
		}
	}, [cart, amountPaid, cartTotal, paymentMethod, referenceNumber, note, validateOrder, clearCart, createOrderMutation]);

	const handlePrint = useCallback(() => {
		window.print();
	}, []);

	return (
		<div
			className="flex h-screen flex-col"
			style={{ background: "var(--warm-beige)" }}
		>
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
					paymentMethod={paymentMethod}
					note={note}
					amountPaid={amountPaid}
					referenceNumber={referenceNumber}
					onRemoveFromCart={removeFromCart}
					onUpdateQuantity={updateQuantity}
					onClearCart={clearCart}
					onPaymentMethodChange={setPaymentMethod}
					onNoteChange={setNote}
					onAmountPaidChange={setAmountPaid}
					onReferenceNumberChange={setReferenceNumber}
					onPlaceOrderClick={() => {
						if (validateOrder()) setShowPlaceOrderConfirm(true);
					}}
				/>
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
