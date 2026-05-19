import { useEffect, useState } from "react";
import { Minus, Plus } from "@phosphor-icons/react";
import { toast } from "sonner";
import { formatPeso } from "@/lib/format-currency";
import { PosModal } from "./ui/PosModal";
import type { MenuItem } from "../types";
import { cartLineKey, getCupSizes } from "../utils";

interface AddOnItem {
	id: number;
	name: string;
	price: number;
}

interface PosCupPickerDialogProps {
	item: MenuItem | null;
	addOns: AddOnItem[];
	onClose: () => void;
	onConfirm: (params: {
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
	}) => void;
}

export function PosCupPickerDialog({
	item,
	addOns,
	onClose,
	onConfirm,
}: PosCupPickerDialogProps) {
	const [pickCupType, setPickCupType] = useState("HOT");
	const [pickCupSize, setPickCupSize] = useState("12OZ");
	const [showAddons, setShowAddons] = useState(false);
	const [selectedAddons, setSelectedAddons] = useState<
		Record<number, { name: string; price: number; quantity: number }>
	>({});
	const [itemDiscountType, setItemDiscountType] = useState<
		"none" | "SENIOR" | "PWD"
	>("none");
	const [itemDiscountName, setItemDiscountName] = useState("");
	const [itemDiscountId, setItemDiscountId] = useState("");
	const [isFreeDrink, setIsFreeDrink] = useState(false);

	useEffect(() => {
		if (!item) return;

		const temps = item.temperatures ?? [];
		const defaultTemp = temps.includes("HOT") ? "HOT" : temps[0] ?? "HOT";

		const sizes = getCupSizes(
			defaultTemp === "HOT" ? item.hot_cup_sizes : item.iced_cup_sizes,
		);
		const defaultSize = sizes.length > 0 ? sizes[0].key : "12OZ";

		setPickCupType(defaultTemp);
		setPickCupSize(defaultSize);
		setShowAddons(false);
		setSelectedAddons({});
		setItemDiscountType("none");
		setItemDiscountName("");
		setItemDiscountId("");
		setIsFreeDrink(false);
	}, [item]);

	useEffect(() => {
		if (!item) return;

		const sizes = getCupSizes(
			pickCupType === "HOT" ? item.hot_cup_sizes : item.iced_cup_sizes,
		);
		const stillExists = sizes.some((s) => s.key === pickCupSize);
		if (!stillExists && sizes.length > 0) {
			setPickCupSize(sizes[0].key);
		}
	}, [pickCupType, item, pickCupSize]);

	if (!item) return null;

	const incrementAddon = (addon: AddOnItem) => {
		setSelectedAddons((prev) => {
			const existing = prev[addon.id];
			return {
				...prev,
				[addon.id]: {
					name: addon.name,
					price: addon.price,
					quantity: (existing?.quantity ?? 0) + 1,
				},
			};
		});
	};

	const decrementAddon = (addon: AddOnItem) => {
		setSelectedAddons((prev) => {
			const existing = prev[addon.id];
			if (!existing || existing.quantity <= 1) {
				const { [addon.id]: _, ...rest } = prev;
				return rest;
			}
			return {
				...prev,
				[addon.id]: { ...existing, quantity: existing.quantity - 1 },
			};
		});
	};

	const handleConfirm = () => {
		if (
			itemDiscountType !== "none" &&
			(!itemDiscountName.trim() || !itemDiscountId.trim())
		) {
			toast.error("Please enter name and ID for senior/PWD discount");
			return;
		}

		if (isFreeDrink && pickCupSize !== "12OZ") {
			toast.error("Free drink is only available for 12oz cups");
			return;
		}

		const addonItems = Object.entries(selectedAddons)
			.filter(([, v]) => v.quantity > 0)
			.map(([id, v]) => ({
				addon_id: Number(id),
				name: v.name,
				price: v.price,
				quantity: v.quantity,
			}));

		const addonsTotal = addonItems.reduce(
			(sum, a) => sum + a.price * a.quantity,
			0,
		);

		const comboPrice =
			pickCupType === "HOT"
				? item.hot_12oz_price
				: pickCupSize === "12OZ"
					? item.iced_12oz_price
					: item.iced_16oz_price;

		let finalUnitPrice = comboPrice + addonsTotal;

		if (isFreeDrink) {
			finalUnitPrice = 0;
		} else if (itemDiscountType !== "none") {
			finalUnitPrice = finalUnitPrice - finalUnitPrice * 0.05;
		}

		const addonKey = addonItems.map((a) => `${a.addon_id}x${a.quantity}`).join("_");
		const lineKey = cartLineKey(
			item.id,
			pickCupType,
			pickCupSize,
			addonKey || undefined,
		);

		onConfirm({
			lineKey,
			menu_item_id: item.id,
			menu_name: item.name,
			category: item.category,
			cup_type: pickCupType,
			cup_size: pickCupSize,
			unit_price: finalUnitPrice,
			total_price: finalUnitPrice,
			discount:
				itemDiscountType !== "none" ? itemDiscountType : undefined,
			discount_name:
				itemDiscountType !== "none" ? itemDiscountName : undefined,
			discount_id:
				itemDiscountType !== "none" ? itemDiscountId : undefined,
			is_free_drink: isFreeDrink || undefined,
			addon_items: addonItems.length > 0 ? addonItems : undefined,
		});

		onClose();
	};

	const temperatures = (item.temperatures ?? []).filter(
		(t) => t === "HOT" || t === "ICED",
	);
	const hasTemps = temperatures.length > 0;
	const displayTemps = hasTemps ? temperatures : (["HOT", "ICED"] as const);

	const rawSizes = pickCupType === "HOT" ? item.hot_cup_sizes : item.iced_cup_sizes;
	const availableSizes = getCupSizes(rawSizes);
	const hasSizes = availableSizes.length > 0;
	const displaySizes = hasSizes
		? availableSizes
		: getCupSizes(pickCupType === "HOT" ? [12, 16] : [12, 16]);

	const adjForTemp = (temp: string) =>
		(temp === "HOT"
			? item.hot_12oz_price
			: pickCupSize === "12OZ" ? item.iced_12oz_price : item.iced_16oz_price) ?? 0;

	const adjForSize = (sizeKey: string) => {
		if (isFreeDrink && sizeKey === "12OZ") return 0;
		return (pickCupType === "HOT"
			? item.hot_12oz_price
			: sizeKey === "12OZ" ? item.iced_12oz_price : item.iced_16oz_price) ?? 0;
	};

	const liveAddonsTotal = Object.values(selectedAddons).reduce(
		(sum, a) => sum + a.price * a.quantity,
		0,
	);

	const liveComboPrice =
		isFreeDrink && pickCupSize === "12OZ"
			? 0
			: pickCupType === "HOT"
				? item.hot_12oz_price
				: pickCupSize === "12OZ" ? item.iced_12oz_price : item.iced_16oz_price;

	return (
		<PosModal open={Boolean(item)} onClose={onClose}>
			<h3
				className="text-sm font-bold"
				style={{ color: "var(--near-black)" }}
			>
				{item.name}
			</h3>
			<p className="mt-1 mb-4 text-xs" style={{ color: "var(--medium-gray)" }}>
				Choose how it is served and the cup size.
			</p>

			<p
				className="mb-2 text-xs font-medium"
				style={{ color: "var(--medium-gray)" }}
			>
				Hot or iced
			</p>
			<div className="mb-4 flex gap-2">
				{displayTemps.map((k) => (
					<button
						key={k}
						type="button"
						onClick={() => setPickCupType(k)}
						className="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-xs font-semibold transition-all"
						style={{
							background:
								pickCupType === k ? "var(--deep-forest)" : "var(--off-white)",
							color: pickCupType === k ? "white" : "var(--dark-gray)",
							border:
								pickCupType === k ? "none" : "1px solid var(--light-gray)",
						}}
					>
						<span>{k === "HOT" ? "Hot" : "Iced"}</span>
					</button>
				))}
			</div>

			<p
				className="mb-2 text-xs font-medium"
				style={{ color: "var(--medium-gray)" }}
			>
				Cup size
			</p>
			<div className="mb-6 flex gap-2">
				{displaySizes.map((s) => (
					<button
						key={s.key}
						type="button"
						disabled={isFreeDrink && s.key !== "12OZ"}
						onClick={() => setPickCupSize(s.key)}
						className="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
						style={{
							background:
								pickCupSize === s.key
									? "var(--deep-forest)"
									: "var(--off-white)",
							color: pickCupSize === s.key ? "white" : "var(--dark-gray)",
							border:
								pickCupSize === s.key
									? "none"
									: "1px solid var(--light-gray)",
						}}
					>
						<span>{s.label}</span>
						<span className="text-[9px] opacity-70">{formatPeso(adjForSize(s.key))}</span>
					</button>
				))}
			</div>

			<div>
				<div className="mb-3 flex items-center justify-between">
					<p
						className="text-xs font-bold tracking-wider uppercase"
						style={{ color: "var(--medium-gray)" }}
					>
						Add-ons
					</p>
					<button
						type="button"
						onClick={() => setShowAddons(!showAddons)}
						className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${showAddons ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}
					>
						{showAddons ? "Active" : "Add?"}
					</button>
				</div>
				{showAddons ? (
					<div className="space-y-2">
						{addOns.map((addon) => {
							const qty = selectedAddons[addon.id]?.quantity ?? 0;
							return (
								<div
									key={addon.id}
									className={`flex items-center justify-between rounded-xl border p-2.5 transition-all ${qty > 0 ? "border-amber-400 bg-amber-50" : "border-gray-100 bg-gray-50"}`}
								>
									<div className="flex flex-col gap-0.5">
										<span
											className="text-[10px] font-bold"
											style={{
												color:
													qty > 0
														? "var(--near-black)"
														: "var(--dark-gray)",
											}}
										>
											{addon.name}
										</span>
										<span className="text-[8px] opacity-60">
											+{formatPeso(addon.price)}
										</span>
									</div>
									<div className="flex items-center gap-1.5">
										<button
											type="button"
											onClick={() => decrementAddon(addon)}
											disabled={qty === 0}
											className="flex size-6 items-center justify-center rounded-full transition-colors disabled:opacity-30"
											style={{
												background:
													qty > 0
														? "var(--deep-forest)"
														: "var(--light-gray)",
											}}
										>
											<Minus
												className="size-3"
												style={{
													color: qty > 0 ? "white" : "var(--medium-gray)",
												}}
											/>
										</button>
										<span className="w-4 text-center text-xs font-bold">
											{qty}
										</span>
										<button
											type="button"
											onClick={() => incrementAddon(addon)}
											className="flex size-6 items-center justify-center rounded-full"
											style={{ background: "var(--deep-forest)" }}
										>
											<Plus className="size-3 text-white" />
										</button>
									</div>
								</div>
							);
						})}
					</div>
				) : null}
			</div>

			{/* Discount & Free Drink */}
			<div
				className="mt-4 border-t pt-4"
				style={{ borderColor: "var(--light-gray)" }}
			>
				<div className="mb-3 flex items-center justify-between">
					<p
						className="text-xs font-bold tracking-wider uppercase"
						style={{ color: "var(--medium-gray)" }}
					>
						Discount
					</p>
					<select
						value={itemDiscountType}
						onChange={(e) =>
							setItemDiscountType(
								e.target.value as "none" | "SENIOR" | "PWD",
							)
						}
						className="rounded-full border px-3 py-1 text-[10px] font-semibold"
						style={{
							borderColor: "var(--light-gray)",
							color: "var(--dark-gray)",
						}}
					>
						<option value="none">None</option>
						<option value="SENIOR">Senior (5%)</option>
						<option value="PWD">PWD (5%)</option>
					</select>
				</div>

				{itemDiscountType !== "none" ? (
					<div className="mb-3 space-y-2">
						<input
							type="text"
							value={itemDiscountName}
							onChange={(e) => setItemDiscountName(e.target.value)}
							placeholder="Name"
							className="h-9 w-full rounded-lg border px-3 text-xs outline-none"
							style={{ borderColor: "var(--light-gray)" }}
						/>
						<input
							type="text"
							value={itemDiscountId}
							onChange={(e) => setItemDiscountId(e.target.value)}
							placeholder="ID Number"
							className="h-9 w-full rounded-lg border px-3 text-xs outline-none"
							style={{ borderColor: "var(--light-gray)" }}
						/>
					</div>
				) : null}

				{pickCupSize === "12OZ" ? (
					<div
						className="flex items-center justify-between rounded-lg p-2.5"
						style={{ background: "var(--off-white)" }}
					>
						<span
							className="text-xs font-semibold"
							style={{ color: "var(--near-black)" }}
						>
							Free Drink (12oz only)
						</span>
						<button
							type="button"
							onClick={() => setIsFreeDrink(!isFreeDrink)}
							className="relative h-6 w-11 rounded-full transition-colors duration-200"
							style={{
								background: isFreeDrink
									? "var(--deep-forest)"
									: "var(--light-gray)",
							}}
						>
							<div
								className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200"
								style={{ left: isFreeDrink ? 22 : 2 }}
							/>
						</button>
					</div>
				) : null}
			</div>

			<div
				className="mt-4 flex items-center justify-between rounded-xl px-4 py-3"
				style={{ background: "var(--off-white)" }}
			>
				<span
					className="text-xs font-semibold"
					style={{ color: "var(--medium-gray)" }}
				>
					Total{liveAddonsTotal > 0 && !isFreeDrink ? " (incl. add-ons)" : ""}
				</span>
				<span
					className="text-sm font-bold"
					style={{ color: "var(--near-black)" }}
				>
					{formatPeso(isFreeDrink ? 0 : (liveComboPrice + liveAddonsTotal))}
				</span>
			</div>

			<div className="mt-4 flex gap-2">
				<button type="button" className="btn-ghost flex-1" onClick={onClose}>
					Cancel
				</button>
				<button
					type="button"
					className="btn-primary flex-1"
					onClick={handleConfirm}
				>
					Add to cart
				</button>
			</div>
		</PosModal>
	);
}
