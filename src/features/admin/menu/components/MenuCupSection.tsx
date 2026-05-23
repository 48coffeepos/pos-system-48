import { CheckIcon } from "@phosphor-icons/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InventoryItem } from "@/features/admin/inventory/components/AddInventoryItem";
import { cn } from "@/lib/utils";

interface MenuCupSectionProps {
	cupItems: InventoryItem[];
	selectedCupIds: string[];
	cupPrices: Record<string, number>;
	onToggleCup: (cupId: string) => void;
	onChangePrice: (cupId: string, price: number) => void;
}

function MenuCupSection({
	cupItems,
	selectedCupIds,
	cupPrices,
	onToggleCup,
	onChangePrice,
}: MenuCupSectionProps) {
	if (cupItems.length === 0) {
		return (
			<p className="py-4 text-center text-sm text-(--medium-gray)">
				No cup sizes in inventory. Add cups first.
			</p>
		);
	}

	return (
		<div className="space-y-3">
			<Label className="block text-xs font-medium text-(--medium-gray)">
				Cup Sizes
			</Label>
			<div className="space-y-2">
				{cupItems.map((cup) => {
					const isSelected = selectedCupIds.includes(cup.id);

					return (
						<Label
							key={cup.id}
							className={cn(
								"flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 transition-all",
								isSelected
									? "border-(--deep-forest) bg-(--pale-yellow) shadow-sm"
									: "border-(--light-gray) bg-(--pure-white)",
							)}
						>
							<div className="flex items-center gap-3">
								<Checkbox
									checked={isSelected}
									onCheckedChange={() => onToggleCup(cup.id)}
								/>
								<div className="flex flex-col">
									<span className="text-sm font-semibold text-(--dark-gray)">
										{cup.name}
									</span>
									<span className="text-[11px] text-(--medium-gray)">
										Track this cup size
									</span>
								</div>
							</div>
							{isSelected ? (
								<CheckIcon
									weight="bold"
									className="h-3 w-3 text-(--deep-forest)"
								/>
							) : null}
						</Label>
					);
				})}
			</div>

			{selectedCupIds.length > 0 ? (
				<div className="space-y-2">
					<Label className="block text-xs font-medium text-(--medium-gray)">
						Prices (₱)
					</Label>
					{selectedCupIds.map((cupId) => {
						const cup = cupItems.find((item) => item.id === cupId);

						return (
							<div key={cupId} className="flex items-center gap-3">
								<Label className="w-28 shrink-0 text-xs font-medium text-(--dark-gray)">
									{cup?.name ?? cupId}:
								</Label>
								<Input
									type="number"
									value={cupPrices[cupId]}
									onChange={(e) => onChangePrice(cupId, e.target.valueAsNumber)}
									className="h-10 flex-1 text-sm"
								/>
							</div>
						);
					})}
				</div>
			) : null}
		</div>
	);
}

export { MenuCupSection };
