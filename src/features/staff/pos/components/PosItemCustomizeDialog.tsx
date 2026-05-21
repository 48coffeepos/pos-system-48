import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { formatPeso } from "@/lib/format-currency";
import type { MenuItem } from "../types";
import { cartLineKey, parseCupInfo } from "../utils";
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
	const [itemDiscountType, setItemDiscountType] = useState<
		"NONE" | "SENIOR" | "PWD"
	>("NONE");
	const [itemDiscountName, setItemDiscountName] = useState("");
	const [itemDiscountId, setItemDiscountId] = useState("");
	const [isFreeDrink, setIsFreeDrink] = useState(false);

	const cupItems =
		item?.inventory_items?.filter((ii) => ii.inventory.type === "CUP") ?? [];

	const canUseFreeDrink = selectedInvItem !== null;

	useEffect(() => {
		if (!item) return;

		setSelectedInvItem(
			cupItems.length > 0 ? cupItems[0].inventory.inventory_id : null,
		);
		setShowAddons(false);
		setSelectedAddons({});
		setItemDiscountType("NONE");
		setItemDiscountName("");
		setItemDiscountId("");
		setIsFreeDrink(false);
	}, [item, cupItems.length, cupItems[0]?.inventory?.inventory_id]);

	const canDiscount = !hasDiscountInCart;

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

	const getCupInfo = (invId: string) => {
		const match = cupItems.find((c) => c.inventory.inventory_id === invId);
		if (!match) return { cup_type: "NONE", cup_size: "NONE" };
		return parseCupInfo(match.inventory.name);
	};

	const handleConfirm = () => {
		if (
			itemDiscountType !== "NONE" &&
			(!itemDiscountName.trim() || !itemDiscountId.trim())
		) {
			toast.error("Please enter name and ID for senior/PWD discount");
			return;
		}

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

		let finalUnitPrice = basePrice + addonsTotal;

		if (isFreeDrink) {
			finalUnitPrice = 0;
		} else if (itemDiscountType !== "NONE") {
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
			isFreeDrink,
			itemDiscountType !== "NONE" ? itemDiscountType : undefined,
		);

		onConfirm({
			lineKey,
			menu_id: item.menu_id,
			menu_name: item.name,
			cup_type: cupInfo.cup_type,
			cup_size: cupInfo.cup_size,
			unit_price: finalUnitPrice,
			total_price: finalUnitPrice,
			discount: itemDiscountType !== "NONE" ? itemDiscountType : undefined,
			discount_name: itemDiscountType !== "NONE" ? itemDiscountName : undefined,
			discount_id: itemDiscountType !== "NONE" ? itemDiscountId : undefined,
			is_free_drink: isFreeDrink || undefined,
			addon_items: addonItems.length > 0 ? addonItems : undefined,
		});

		onClose();
	};

	const liveAddonsTotal = Object.values(selectedAddons).reduce(
		(sum, a) => sum + a.price * a.quantity,
		0,
	);

	return (
		<PosModal open={Boolean(item)} onClose={onClose}>
			<h2 className="font-bold text-foreground">{item.name}</h2>

			{cupItems.length > 0 ? (
				<>
					<p className="text-xs font-medium text-muted-foreground">
						Cup options
					</p>
					<div className="flex flex-wrap gap-2">
						{cupItems.map((ci) => {
							const isSelected = selectedInvItem === ci.inventory.inventory_id;
							return (
								<Button
									key={ci.inventory.inventory_id}
									variant={isSelected ? "default" : "outline"}
									className="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-xs font-semibold h-auto"
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
					<p className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
						Add-ons
					</p>
					<Button
						variant={showAddons ? "default" : "secondary"}
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
									className={`flex items-center justify-between rounded-xl border p-2.5 transition-all ${qty > 0 ? "border-amber-400 bg-amber-50" : "border-border bg-muted"}`}
								>
									<div className="flex flex-col gap-0.5">
										<span
											className={`text-[10px] font-bold ${qty > 0 ? "text-foreground" : "text-muted-foreground"}`}
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
			<div className="mt-4 border-t border-border pt-4">
				{canDiscount ? (
					<>
						<div className="mb-3 flex items-center justify-between">
							<p className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
								Discount
							</p>
							<Select
								value={itemDiscountType}
								onValueChange={(v) => setItemDiscountType(v ?? "NONE")}
							>
								<SelectTrigger className="w-auto rounded-full text-[10px] font-semibold h-8 px-3 py-1">
									<SelectValue placeholder="None" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="NONE">None</SelectItem>
									<SelectItem value="SENIOR">Senior (5%)</SelectItem>
									<SelectItem value="PWD">PWD (5%)</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{itemDiscountType !== "NONE" ? (
							<div className="mb-3 space-y-2">
								<Input
									type="text"
									value={itemDiscountName}
									onChange={(e) => setItemDiscountName(e.target.value)}
									placeholder="Name"
									className="h-9 w-full rounded-lg border border-border px-3 text-xs outline-none bg-background"
								/>
								<Input
									type="text"
									value={itemDiscountId}
									onChange={(e) => setItemDiscountId(e.target.value)}
									placeholder="ID Number"
									className="h-9 w-full rounded-lg border border-border px-3 text-xs outline-none bg-background"
								/>
							</div>
						) : null}
					</>
				) : null}

				{canUseFreeDrink && !hasFreeDrinkInCart ? (
					<div className="flex items-center justify-between rounded-lg bg-muted p-2.5">
						<span className="text-xs font-semibold text-foreground">
							Free Drink
						</span>
						<Switch checked={isFreeDrink} onCheckedChange={setIsFreeDrink} />
					</div>
				) : null}
			</div>

			<div className="mt-4 flex items-center justify-between rounded-xl bg-muted px-4 py-3">
				<span className="text-xs font-semibold text-muted-foreground">
					Total{liveAddonsTotal > 0 && !isFreeDrink ? " (incl. add-ons)" : ""}
				</span>
				<span className="text-sm font-bold text-foreground">
					{formatPeso(isFreeDrink ? 0 : basePrice + liveAddonsTotal)}
				</span>
			</div>

			<div className="mt-4 flex gap-2">
				<Button variant="ghost" className="flex-1" onClick={onClose}>
					Cancel
				</Button>
				<Button className="flex-1" onClick={handleConfirm}>
					Add to cart
				</Button>
			</div>
		</PosModal>
	);
}
