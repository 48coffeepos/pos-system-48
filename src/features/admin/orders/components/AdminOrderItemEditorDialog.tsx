import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { PosItemCustomizeDialog } from "@/features/staff/pos/components/PosItemCustomizeDialog";
import { posPageDataQueryOptions } from "@/features/staff/pos/queryOptions";
import type { MenuItem, PosOrder } from "@/features/staff/pos/types";
import { snapshotInventoryLabel } from "@/features/staff/pos/utils/cart-order";

type OrderItem = PosOrder["items"][number];

interface AdminOrderItemEditorDialogProps {
	open: boolean;
	editingItem: OrderItem | null;
	onClose: () => void;
	onSave: (item: OrderItem) => void;
}

export function AdminOrderItemEditorDialog({
	open,
	editingItem,
	onClose,
	onSave,
}: AdminOrderItemEditorDialogProps) {
	const [selectedMenuId, setSelectedMenuId] = useState<string>("");
	const { data: menuData } = useQuery({
		...posPageDataQueryOptions,
		enabled: open,
	});

	const menuItems = (menuData?.menuItems ?? []) as MenuItem[];
	const addOns = menuData?.addOns ?? [];

	const selectedMenu = useMemo(() => {
		if (editingItem?.menu_id) {
			return menuItems.find((m) => m.menu_id === editingItem.menu_id) ?? null;
		}
		return menuItems.find((m) => m.menu_id === selectedMenuId) ?? null;
	}, [editingItem, menuItems, selectedMenuId]);

	const hasDiscountInCart = false;

	const handleCustomizeConfirm = (params: {
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
		const orderItemId =
			editingItem?.order_item_id ??
			`new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

		const cupLine = {
			cup_type: params.cup_type,
			cup_size: params.cup_size,
			menu_name: params.menu_name,
		};

		onSave({
			order_item_id: orderItemId,
			menu_id: params.menu_id,
			snapshot_menu_name: params.menu_name,
			snapshot_inventory: snapshotInventoryLabel(cupLine),
			unit_price: params.unit_price,
			quantity: params.quantity,
			line_total: params.total_price,
			loyalty: params.is_free_drink ?? false,
			discount_type: params.discount,
			discount_contact: params.discount_name,
			discount_id_number: params.discount_id,
			addon_items: (params.addon_items ?? []).map((addon, index) => ({
				order_item_addon_id:
					editingItem?.addon_items?.[index]?.order_item_addon_id ??
					`new-addon-${orderItemId}-${index}`,
				addon_id: addon.addon_id,
				addon_name_snapshot: addon.name,
				addon_price_snapshot: addon.price,
				quantity: addon.quantity,
			})),
		});
		onClose();
	};

	if (!open) return null;

	if (!editingItem && !selectedMenu) {
		return (
			<Dialog open onOpenChange={(isOpen) => !isOpen && onClose()}>
				<DialogContent className="w-[calc(100vw-1rem)] max-w-md">
					<DialogHeader>
						<DialogTitle>Add Order Item</DialogTitle>
					</DialogHeader>
					<div className="space-y-2">
						<label
							htmlFor="admin-order-menu-select"
							className="text-sm font-medium text-(--deep-forest)"
						>
							Select menu item
						</label>
						<select
							id="admin-order-menu-select"
							value={selectedMenuId}
							onChange={(e) => setSelectedMenuId(e.target.value)}
							className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
						>
							<option value="">Choose item...</option>
							{menuItems.map((menuItem) => (
								<option key={menuItem.menu_id} value={menuItem.menu_id}>
									{menuItem.name}
								</option>
							))}
						</select>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<PosItemCustomizeDialog
			item={selectedMenu}
			addOns={addOns}
			onClose={onClose}
			onConfirm={handleCustomizeConfirm}
			hasDiscountInCart={hasDiscountInCart}
			initialLine={editingItem}
		/>
	);
}
