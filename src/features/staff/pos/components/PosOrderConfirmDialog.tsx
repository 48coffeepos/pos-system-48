import { X } from "@phosphor-icons/react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPeso } from "@/lib/format-currency";
import { posBtnGhost, posBtnOutline, posBtnPrimary } from "../pos-ui";

interface PosOrderConfirmDialogProps {
	open: boolean;
	total: number;
	isLoading?: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function PosOrderConfirmDialog({
	open,
	total,
	isLoading = false,
	onClose,
	onConfirm,
}: PosOrderConfirmDialogProps) {
	return (
		<AlertDialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<AlertDialogContent className="border-(--light-gray) bg-(--pure-white)">
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					className={cn("absolute top-4 right-4 rounded-full", posBtnGhost)}
					aria-label="Close"
				>
					<X className="size-5" />
				</Button>
				<AlertDialogTitle className="text-(--deep-forest)">
					Confirm Order
				</AlertDialogTitle>
				<AlertDialogDescription>
					Are you sure you want to place this order for {formatPeso(total)}?
				</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogCancel
						disabled={isLoading}
						className={posBtnOutline}
					>
						Cancel
					</AlertDialogCancel>
					<Button
						onClick={() => {
							onConfirm();
							onClose();
						}}
						disabled={isLoading}
						className={posBtnPrimary}
					>
						{isLoading ? "Confirming..." : "Confirm"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
