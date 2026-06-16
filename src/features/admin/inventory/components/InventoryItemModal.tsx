"use client";

import {
	Dialog,
	DialogContent,
} from "@/components/ui/dialog";
import type { InventoryItem } from "./AddInventoryItem";
import { AddInventoryItem } from "./AddInventoryItem";

export type InventoryItemModalState =
	| { kind: "closed" }
	| { kind: "new" }
	| { kind: "edit"; item: InventoryItem };

interface InventoryItemModalProps {
	modal: InventoryItemModalState;
	activeTab: "storefront" | "admin";
	onClose: () => void;
}

function InventoryItemModal({
	modal,
	activeTab,
	onClose,
}: InventoryItemModalProps) {
	if (modal.kind === "closed") return null;

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent className="w-[calc(100vw-1rem)] max-w-lg max-h-[85vh] overflow-y-auto p-0 gap-0">
				<AddInventoryItem
					editingItem={modal.kind === "edit" ? modal.item : null}
					onCancelEdit={onClose}
					activeTab={activeTab === "admin" ? "admin" : "storefront"}
				/>
			</DialogContent>
		</Dialog>
	);
}

export { InventoryItemModal };
