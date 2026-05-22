import { CheckIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InventoryItem } from "@/features/admin/inventory/components/AddInventoryItem";
import { cn } from "@/lib/utils";
import type { useMenuForm } from "../hooks/useMenuForm";

interface MenuStandaloneSectionProps {
	form: ReturnType<typeof useMenuForm>["form"];
	standaloneItems: InventoryItem[];
}

function MenuStandaloneSection({
	form,
	standaloneItems,
}: MenuStandaloneSectionProps) {
	return (
		<div className="space-y-4">
			<div>
				<Label className="mb-2 block text-xs font-medium text-(--medium-gray)">
					Inventory Source
				</Label>
				<form.AppField name="standaloneMode">
					{(field) => (
						<field.Radio
							label=""
							options={[
								{
									value: "existing",
									label: "Existing item",
									description: "Link to an already tracked inventory item.",
								},
								{
									value: "new",
									label: "Auto-create",
									description:
										"Create a new inventory item for this menu item.",
								},
							]}
						/>
					)}
				</form.AppField>
			</div>

			<form.Subscribe selector={(state) => state.values.standaloneMode}>
				{(standaloneMode) =>
					standaloneMode === "existing" ? (
						<form.Subscribe
							selector={(state) => state.values.selectedInventoryId}
						>
							{(selectedInventoryId) => (
								<div>
									<Label className="mb-1.5 block text-xs font-medium text-(--medium-gray)">
										Select Inventory Item
									</Label>
									{standaloneItems.length > 0 ? (
										<div className="space-y-1.5">
											{standaloneItems.map((item) => {
												const isSelected = selectedInventoryId === item.id;

												return (
													<Button
														key={item.id}
														type="button"
														variant={isSelected ? "default" : "outline"}
														className={cn(
															"flex h-auto w-full items-center justify-between rounded-xl px-4 py-3 text-left",
															isSelected
																? "bg-(--deep-forest) text-(--pure-white)"
																: "text-(--dark-gray)",
														)}
														onClick={() =>
															form.setFieldValue("selectedInventoryId", item.id)
														}
													>
														<span className="font-medium">{item.name}</span>
														<span className="flex items-center gap-2">
															<span
																className={cn(
																	"rounded-full px-2 py-0.5 text-[10px] font-semibold",
																	isSelected
																		? "bg-white/15 text-white"
																		: "bg-(--off-white) text-(--medium-gray)",
																)}
															>
																{item.stock} stock
															</span>
															{isSelected ? (
																<div className="flex size-5 items-center justify-center rounded-full bg-white/15">
																	<CheckIcon
																		weight="bold"
																		className="size-3 text-white"
																	/>
																</div>
															) : null}
														</span>
													</Button>
												);
											})}
										</div>
									) : (
										<p className="py-4 text-center text-sm text-(--medium-gray)">
											No standalone items in inventory.
										</p>
									)}
								</div>
							)}
						</form.Subscribe>
					) : standaloneMode === "new" ? (
						<div className="space-y-3">
							<form.Subscribe
								selector={(state) => state.values.newInventoryName}
							>
								{(newInventoryName) => (
									<div>
										<Label className="mb-1.5 block text-xs font-medium text-(--medium-gray)">
											New Inventory Item Name
										</Label>
										<Input
											type="text"
											value={newInventoryName}
											onChange={(e) =>
												form.setFieldValue("newInventoryName", e.target.value)
											}
											placeholder="e.g. Coke, Sprite"
										/>
									</div>
								)}
							</form.Subscribe>
						</div>
					) : null
				}
			</form.Subscribe>

			<form.Subscribe selector={(state) => state.values.standaloneMode}>
				{(standaloneMode) =>
					standaloneMode ? (
						<form.Subscribe selector={(state) => state.values.standalonePrice}>
							{(standalonePrice) => (
								<div>
									<Label className="mb-1.5 block text-xs font-medium text-(--medium-gray)">
										Price (₱) *
									</Label>
									<Input
										type="number"
										min={1}
										step={1}
										value={standalonePrice ?? ""}
										onChange={(e) =>
											form.setFieldValue(
												"standalonePrice",
												e.target.value === ""
													? undefined
													: e.target.valueAsNumber,
											)
										}
										placeholder="0"
										onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
									/>
								</div>
							)}
						</form.Subscribe>
					) : null
				}
			</form.Subscribe>
		</div>
	);
}

export { MenuStandaloneSection };
