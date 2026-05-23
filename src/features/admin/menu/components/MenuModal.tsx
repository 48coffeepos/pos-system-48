import { CheckIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { InventoryItem } from "@/features/admin/inventory/components/AddInventoryItem";
import type { Inventory_Type } from "@/generated/prisma/enums";
import { useMenuForm } from "../hooks/useMenuForm";
import type { MenuListItem } from "../types";
import { MenuCupSection } from "./MenuCupSection";
import { MenuStandaloneSection } from "./MenuStandaloneSection";

interface MenuModalProps {
	inventoryItems: InventoryItem[];
	modal:
		| { kind: "closed" }
		| { kind: "new" }
		| { kind: "edit"; item: MenuListItem };
	onClose: () => void;
}

function MenuModal({ inventoryItems, modal, onClose }: MenuModalProps) {
	const { form, isEditing } = useMenuForm({
		editingItem: modal.kind === "edit" ? modal.item : null,
		onClose,
	});

	if (modal.kind === "closed") return null;

	const cupItems = inventoryItems.filter((item) => item.type === "CUP");
	const standaloneItems = inventoryItems.filter(
		(item) => item.type === "STANDALONE",
	);

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent>
				<DialogHeader className="flex-row items-start justify-between gap-4">
					<div className="space-y-2">
						<DialogTitle className="text-lg font-bold text-(--near-black)">
							{isEditing ? "Edit menu item" : "Add menu item"}
						</DialogTitle>
						<DialogDescription className="text-sm text-(--medium-gray)">
							Configure how this menu item is priced and tracked.
						</DialogDescription>
					</div>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						void form.handleSubmit();
					}}
				>
					<div className="overflow-y-auto space-y-5 max-h-120 px-2 pb-2 overflow-x-hidden">
						<form.AppField name="name">
							{(field) => (
								<field.Input label="Name" placeholder="e.g. Spanish Latte" />
							)}
						</form.AppField>

						<form.AppField name="trackInventory">
							{(field) => (
								<field.Switch
									label="Track Inventory Item"
									description="Link this menu item to inventory for stock tracking"
								/>
							)}
						</form.AppField>

						<form.Subscribe selector={(s) => s.values.trackInventory}>
							{(trackInventory) =>
								trackInventory ? (
									<div className="space-y-4">
										<form.AppField name="itemType">
											{(field) => (
												<field.Radio
													label="Item Type"
													description="Choose how this menu item tracks inventory"
													options={[
														{
															value: "CUP",
															label: "Cup",
															description:
																"Track cup sizes and set a price for each one.",
														},
														{
															value: "STANDALONE",
															label: "Standalone",
															description:
																"Link to an existing inventory item or create one.",
														},
													]}
												/>
											)}
										</form.AppField>

										<form.Subscribe selector={(s) => s.values.itemType}>
											{(itemType) => (
												<MenuTrackedBody
													form={form}
													itemType={itemType}
													cupItems={cupItems}
													standaloneItems={standaloneItems}
												/>
											)}
										</form.Subscribe>
									</div>
								) : (
									<form.AppField name="price">
										{(field) => (
											<div className="space-y-1.5">
												<label
													htmlFor={field.name}
													className="text-sm font-medium text-(--dark-gray)"
												>
													Price (₱) *
												</label>
												<Input
													id={field.name}
													type="number"
													min={1}
													step={1}
													placeholder="0"
													value={field.state.value ?? ""}
													onChange={(e) =>
														field.handleChange(e.target.valueAsNumber)
													}
													onBlur={field.handleBlur}
												/>
											</div>
										)}
									</form.AppField>
								)
							}
						</form.Subscribe>
					</div>

					<DialogFooter className="pt-2">
						<Button
							type="button"
							onClick={onClose}
							variant="outline"
							className="flex-1"
						>
							Cancel
						</Button>
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<Button
									type="submit"
									disabled={!canSubmit || isSubmitting}
									className="flex flex-1 items-center justify-center gap-2"
								>
									<CheckIcon weight="bold" className="h-4 w-4" />
									{isEditing ? "Save changes" : "Add item"}
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export { MenuModal };

function MenuTrackedBody({
	form,
	itemType,
	cupItems,
	standaloneItems,
}: {
	form: ReturnType<typeof useMenuForm>["form"];
	itemType: Inventory_Type | undefined;
	cupItems: InventoryItem[];
	standaloneItems: InventoryItem[];
}) {
	useEffect(() => {
		if (itemType === "CUP") {
			form.setFieldValue("standaloneMode", undefined);
			form.setFieldValue("selectedInventoryId", "");
			form.setFieldValue("newInventoryName", "");
			form.setFieldValue("standalonePrice", undefined);
		} else if (itemType === "STANDALONE") {
			form.setFieldValue("selectedCupIds", []);
			form.setFieldValue("cupPrices", {});
		}
	}, [itemType, form]);

	if (itemType === "CUP") {
		return (
			<form.Subscribe selector={(state) => state.values.selectedCupIds}>
				{(selectedCupIds) => (
					<form.Subscribe selector={(state) => state.values.cupPrices}>
						{(cupPrices) => (
							<MenuCupSection
								cupItems={cupItems}
								selectedCupIds={selectedCupIds}
								cupPrices={cupPrices}
								onToggleCup={(cupId) => {
									if (selectedCupIds.includes(cupId)) {
										form.setFieldValue(
											"selectedCupIds",
											selectedCupIds.filter((id) => id !== cupId),
										);
										const next = { ...cupPrices };
										delete next[cupId];
										form.setFieldValue("cupPrices", next);
										return;
									}

									form.setFieldValue("selectedCupIds", [
										...selectedCupIds,
										cupId,
									]);
									form.setFieldValue("cupPrices", {
										...cupPrices,
										[cupId]: 0,
									});
								}}
								onChangePrice={(cupId, price) =>
									form.setFieldValue("cupPrices", {
										...cupPrices,
										[cupId]: price,
									})
								}
							/>
						)}
					</form.Subscribe>
				)}
			</form.Subscribe>
		);
	}

	if (itemType === "STANDALONE") {
		return (
			<MenuStandaloneSection form={form} standaloneItems={standaloneItems} />
		);
	}

	return null;
}
