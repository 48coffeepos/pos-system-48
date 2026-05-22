import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatPeso } from "@/lib/format-currency";

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
			<AlertDialogContent>
				<AlertDialogTitle>Confirm Order</AlertDialogTitle>
				<AlertDialogDescription>
					Are you sure you want to place this order for {formatPeso(total)}?
				</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
					<Button
						onClick={() => {
							onConfirm();
							onClose();
						}}
						disabled={isLoading}
					>
						{isLoading ? "Confirming..." : "Confirm"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
