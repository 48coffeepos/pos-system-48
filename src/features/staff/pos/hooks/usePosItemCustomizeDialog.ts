import { useAppForm } from "@/integrations/tanstack-form";
import {
	CustomizeFormSchema,
	type CustomizeFormValues,
} from "../schemas/customizeFormSchema";
import type { MenuItem } from "../types";
import { cartLineKey, parseCupInfo } from "../utils";

interface CupItem {
	price: number;
	inventory: {
		inventory_id: string;
		name: string;
		stock: number;
		type: string;
	};
}

interface UsePosItemCustomizeDialogProps {
	item: MenuItem | null;
	selectedInvItem: string | null;
	cupItems: CupItem[];
	selectedAddons: Record<
		string,
		{ name: string; price: number; quantity: number }
	>;
	onConfirm: (params: {
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
		addon_items?: Array<{
			addon_id: string;
			name: string;
			price: number;
			quantity: number;
		}>;
	}) => void;
	onClose: () => void;
}

export function usePosItemCustomizeDialog({
	item,
	selectedInvItem,
	cupItems,
	selectedAddons,
	onConfirm,
	onClose,
}: UsePosItemCustomizeDialogProps) {
	const getCupInfo = (invId: string) => {
		const match = cupItems.find(
			(c: CupItem) => c.inventory.inventory_id === invId,
		);
		if (!match) return { cup_type: "NONE", cup_size: "NONE" };
		return parseCupInfo(match.inventory.name);
	};

	const defaultValues: CustomizeFormValues = {
		discountType: "NONE" as const,
		discountName: "",
		discountId: "",
		isFreeDrink: false,
		quantity: 1,
	};

	return useAppForm({
		defaultValues,
		validators: { onChange: CustomizeFormSchema },
		onSubmit: ({ value }) => {
			if (!item) return;

			const addonItems = Object.entries(selectedAddons)
				.filter(([, v]) => v.quantity > 0)
				.map(([id, v]) => ({
					addon_id: id,
					name: v.name,
					price: v.price,
					quantity: v.quantity,
				}));

			const addonsTotal = addonItems.reduce(
				(sum, a) => sum + a.price * a.quantity,
				0,
			);

			const selectedCup = cupItems.find(
				(c) => c.inventory.inventory_id === selectedInvItem,
			);
			const basePrice = selectedCup?.price ?? item.price ?? 0;

			let finalUnitPrice = basePrice + addonsTotal;

			if (value.isFreeDrink) {
				finalUnitPrice = 0;
			} else if (value.discountType !== "NONE") {
				finalUnitPrice = finalUnitPrice - finalUnitPrice * 0.05;
			}

			const cupInfo = selectedInvItem
				? getCupInfo(selectedInvItem)
				: { cup_type: "NONE", cup_size: "NONE" };

			const addonKey = addonItems
				.map((a) => `${a.addon_id}x${a.quantity}`)
				.join("_");

			const lineKey = cartLineKey(
				item.menu_id,
				cupInfo.cup_type,
				cupInfo.cup_size,
				addonKey || undefined,
				value.isFreeDrink,
				value.discountType !== "NONE" ? value.discountType : undefined,
			);

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
				discount:
					value.discountType !== "NONE" ? value.discountType : undefined,
				discount_name:
					value.discountType !== "NONE" ? value.discountName : undefined,
				discount_id:
					value.discountType !== "NONE" ? value.discountId : undefined,
				is_free_drink: value.isFreeDrink || undefined,
				addon_items: addonItems.length > 0 ? addonItems : undefined,
			});

			onClose();
		},
	});
}
