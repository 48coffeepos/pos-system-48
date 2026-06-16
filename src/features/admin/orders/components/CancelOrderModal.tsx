import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CancelOrderModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: (reason: string) => void;
	isPending?: boolean;
}

export function CancelOrderModal({
	open,
	onClose,
	onConfirm,
	isPending = false,
}: CancelOrderModalProps) {
	const [reason, setReason] = useState("");

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			setReason("");
			onClose();
		}
	};

	const trimmedReason = reason.trim();
	const canConfirm = trimmedReason.length > 0 && !isPending;

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="bg-(--pure-white) max-w-md">
				<DialogHeader>
					<DialogTitle className="text-lg font-bold text-(--near-black)">
						Cancel Order
					</DialogTitle>
					<DialogDescription className="text-sm text-(--medium-gray)">
						This will cancel the order and restore inventory. The order will
						remain in records as canceled.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-1.5">
					<label
						htmlFor="cancel-order-reason"
						className="text-xs font-bold uppercase tracking-wider text-(--medium-gray)"
					>
						Reason for cancellation
					</label>
					<Textarea
						id="cancel-order-reason"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder="Why is this order being canceled?"
						rows={3}
						className="resize-none text-sm"
					/>
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => handleOpenChange(false)}
						disabled={isPending}
					>
						Keep Order
					</Button>
					<Button
						type="button"
						variant="destructive"
						disabled={!canConfirm}
						onClick={() => onConfirm(trimmedReason)}
					>
						{isPending ? "Canceling..." : "Confirm Cancel"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
