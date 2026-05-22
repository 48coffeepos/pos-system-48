import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { formatPeso } from "@/lib/format-currency";
import { usePosItemCustomizeDialog } from "../hooks/usePosItemCustomizeDialog";
import {
	posAddonDefault,
	posAddonSelected,
	posBtnGhost,
	posBtnOutline,
	posBtnPrimary,
	posBtnSecondary,
	posMutedLabel,
	posSectionMuted,
} from "../pos-ui";
import type { MenuItem } from "../types";
import { PosModal } from "./ui/PosModal";

interface AddOnItem {
	addon_id: string;
	name: string;
	price: number;
}

interface PosItemCustomizeDialogProps {
	item: MenuItem | null;
	addOns: AddOnItem[];
	onClose: () => void;
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
	hasDiscountInCart: boolean;
	hasFreeDrinkInCart: boolean;
}

export function PosItemCustomizeDialog({
	item,
	addOns,
	onClose,
	onConfirm,
	hasDiscountInCart,
	hasFreeDrinkInCart,
}: PosItemCustomizeDialogProps) {
	const [selectedInvItem, setSelectedInvItem] = useState<string | null>(null);
	const [showAddons, setShowAddons] = useState(false);
	const [selectedAddons, setSelectedAddons] = useState<
		Record<string, { name: string; price: number; quantity: number }>
	>({});

	const cupItems =
		item?.inventory_items?.filter((ii) => ii.inventory.type === "CUP") ?? [];

	const canUseFreeDrink = selectedInvItem !== null;
	const canDiscount = !hasDiscountInCart;

	const form = usePosItemCustomizeDialog({
		item,
		selectedInvItem,
		cupItems,
		selectedAddons,
		onConfirm,
		onClose,
	});

	useEffect(() => {
		if (!item) return;

		setSelectedInvItem(
			cupItems.length > 0 ? cupItems[0].inventory.inventory_id : null,
		);
		setShowAddons(false);
		setSelectedAddons({});
		form.reset();
	}, [item, cupItems.length, cupItems[0]?.inventory?.inventory_id, form]);

	if (!item) return null;

	const selectedCup = cupItems.find(
		(c) => c.inventory.inventory_id === selectedInvItem,
	);
	const basePrice = selectedCup?.price ?? item.price ?? 0;

	const incrementAddon = (addon: AddOnItem) => {
		setSelectedAddons((prev) => {
			const existing = prev[addon.addon_id];
			return {
				...prev,
				[addon.addon_id]: {
					name: addon.name,
					price: addon.price,
					quantity: (existing?.quantity ?? 0) + 1,
				},
			};
		});
	};

	const decrementAddon = (addon: AddOnItem) => {
		setSelectedAddons((prev) => {
			const existing = prev[addon.addon_id];
			if (!existing || existing.quantity <= 1) {
				const { [addon.addon_id]: _, ...rest } = prev;
				return rest;
			}
			return {
				...prev,
				[addon.addon_id]: { ...existing, quantity: existing.quantity - 1 },
			};
		});
	};

	const liveAddonsTotal = Object.values(selectedAddons).reduce(
		(sum, a) => sum + a.price * a.quantity,
		0,
	);

	return (
		<PosModal open={Boolean(item)} onClose={onClose}>
			<h2 className="font-bold text-(--deep-forest)">{item.name}</h2>

			{cupItems.length > 0 ? (
				<>
					<p className="text-xs font-medium text-(--medium-gray)">
						Cup options
					</p>
					<div className="flex flex-wrap gap-2">
						{cupItems.map((ci) => {
							const isSelected = selectedInvItem === ci.inventory.inventory_id;
							return (
								<Button
									key={ci.inventory.inventory_id}
									variant={isSelected ? "default" : "outline"}
									className={cn(
										"flex h-auto flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-xs font-semibold",
										isSelected ? posBtnPrimary : posBtnOutline,
									)}
									onClick={() => setSelectedInvItem(ci.inventory.inventory_id)}
								>
									<span>{ci.inventory.name}</span>
									<span className="text-[9px] opacity-70">
										{formatPeso(Number(ci.price))}
									</span>
								</Button>
							);
						})}
					</div>
				</>
			) : null}

			{/* Add-ons */}
			<div>
				<div className="flex items-center justify-between">
					<p className={posMutedLabel}>Add-ons</p>
					<Button
						variant={showAddons ? "default" : "secondary"}
						className={showAddons ? posBtnPrimary : posBtnSecondary}
						onClick={() => setShowAddons(!showAddons)}
					>
						{showAddons ? "Active" : "Add?"}
					</Button>
				</div>
				{showAddons ? (
					<div className="space-y-2">
						{addOns.map((addon) => {
							const qty = selectedAddons[addon.addon_id]?.quantity ?? 0;
							return (
								<div
									key={addon.addon_id}
									className={cn(
										"flex items-center justify-between rounded-xl border p-2.5 transition-all",
										qty > 0 ? posAddonSelected : posAddonDefault,
									)}
								>
									<div className="flex flex-col gap-0.5">
										<span
											className={cn(
												"text-[10px] font-bold",
												qty > 0
													? "text-(--deep-forest)"
													: "text-(--medium-gray)",
											)}
										>
											{addon.name}
										</span>
										<span className="text-[8px] opacity-60">
											+{formatPeso(addon.price)}
										</span>
									</div>
									<div className="flex items-center gap-1.5">
										<Button
											variant="secondary"
											size="icon-xs"
											className={posBtnSecondary}
											onClick={() => decrementAddon(addon)}
											disabled={qty === 0}
										>
											<MinusIcon className="size-3" />
										</Button>
										<span className="w-4 text-center text-xs font-bold">
											{qty}
										</span>
										<Button
											variant="default"
											size="icon-xs"
											className={posBtnPrimary}
											onClick={() => incrementAddon(addon)}
										>
											<PlusIcon className="size-3" />
										</Button>
									</div>
								</div>
							);
						})}
					</div>
				) : null}
			</div>

			{/* Discount & Free Drink */}
			<div className="mt-4 border-t border-(--light-gray) pt-4">
				{canDiscount ? (
					<>
						<form.AppField
							name="discountType"
							listeners={{
								onChange: ({ value }) => {
									if (value !== "NONE") form.setFieldValue("quantity", 1);
								},
							}}
						>
							{(field) => (
								<div className="mb-3 flex items-center justify-between">
									<p className={posMutedLabel}>Discount</p>
									<Select
										value={field.state.value}
										onValueChange={(v) => field.handleChange(v ?? "NONE")}
									>
										<SelectTrigger className="h-8 w-auto rounded-full border-(--light-gray) bg-(--off-white) px-3 py-1 text-[10px] font-semibold text-(--deep-forest)">
											<SelectValue placeholder="None" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="NONE">None</SelectItem>
											<SelectItem value="SENIOR">Senior (5%)</SelectItem>
											<SelectItem value="PWD">PWD (5%)</SelectItem>
										</SelectContent>
									</Select>
								</div>
							)}
						</form.AppField>

						<form.Subscribe selector={(state) => state.values.discountType}>
							{(discountType) =>
								discountType !== "NONE" ? (
									<div className="mb-3 space-y-2">
										<form.AppField name="discountName">
											{(field) => (
												<field.Input label="Name" placeholder="Full name" />
											)}
										</form.AppField>
										<form.AppField name="discountId">
											{(field) => (
												<field.Input label="ID Number" placeholder="ID #" />
											)}
										</form.AppField>
									</div>
								) : null
							}
						</form.Subscribe>
					</>
				) : null}

				{canUseFreeDrink && !hasFreeDrinkInCart ? (
					<form.AppField name="isFreeDrink">
						{(field) => (
							<div
								className={cn(
									"flex items-center justify-between rounded-lg p-2.5",
									posSectionMuted,
								)}
							>
								<span className="text-xs font-semibold text-(--deep-forest)">
									Free Drink
								</span>
								<Switch
									id={field.name}
									checked={field.state.value}
									onCheckedChange={(checked) => {
										field.handleChange(checked);
										if (checked) form.setFieldValue("quantity", 1);
									}}
								/>
							</div>
						)}
					</form.AppField>
				) : null}
			</div>

			{/* Quantity */}
			<form.Subscribe
				selector={(state) => ({
					isFreeDrink: state.values.isFreeDrink,
					discountType: state.values.discountType,
				})}
			>
				{(vals) => {
					const quantityLocked =
						vals.isFreeDrink || vals.discountType !== "NONE";
					return (
						<div className="mt-4 flex items-center justify-between">
							<p className={posMutedLabel}>Quantity</p>
							<form.AppField name="quantity">
								{(field) => (
									<div className="flex items-center gap-2">
										<Button
											variant="secondary"
											size="icon-xs"
											className={posBtnSecondary}
											disabled={quantityLocked || field.state.value <= 1}
											onClick={() =>
												field.handleChange(Math.max(1, field.state.value - 1))
											}
										>
											<MinusIcon className="size-3" />
										</Button>
										<span className="w-5 text-center text-xs font-bold text-(--deep-forest)">
											{field.state.value}
										</span>
										<Button
											variant="default"
											size="icon-xs"
											className={posBtnPrimary}
											disabled={quantityLocked}
											onClick={() => field.handleChange(field.state.value + 1)}
										>
											<PlusIcon className="size-3" />
										</Button>
									</div>
								)}
							</form.AppField>
						</div>
					);
				}}
			</form.Subscribe>

			<form.Subscribe
				selector={(state) => ({
					isFreeDrink: state.values.isFreeDrink,
					quantity: state.values.quantity,
				})}
			>
				{(vals) => (
					<div
						className={cn(
							"mt-4 flex items-center justify-between rounded-xl px-4 py-3",
							posSectionMuted,
						)}
					>
						<span className="text-xs font-semibold text-(--medium-gray)">
							Total
							{liveAddonsTotal > 0 && !vals.isFreeDrink
								? " (incl. add-ons)"
								: ""}
						</span>
						<span className="text-sm font-bold text-(--deep-forest)">
							{formatPeso(
								vals.isFreeDrink
									? 0
									: (basePrice + liveAddonsTotal) * vals.quantity,
							)}
						</span>
					</div>
				)}
			</form.Subscribe>

			<div className="mt-4 flex gap-2">
				<Button
					variant="ghost"
					className={cn("flex-1", posBtnGhost)}
					onClick={onClose}
				>
					Cancel
				</Button>
				<Button
					className={cn("flex-1", posBtnPrimary)}
					onClick={() => form.handleSubmit()}
				>
					Add to cart
				</Button>
			</div>
		</PosModal>
	);
}
