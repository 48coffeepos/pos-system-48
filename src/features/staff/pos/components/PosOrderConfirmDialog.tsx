import { SpinnerIcon, XIcon } from "@phosphor-icons/react";
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
import type { PosFormValues } from "../schemas/posFormSchema";
import { posBtnGhost, posBtnOutline, posBtnPrimary } from "../pos-ui";
import type { CartItem } from "../types";
import { PosOrderPreview } from "./PosOrderPreview";

interface PosOrderConfirmDialogProps {
	open: boolean;
	cart: CartItem[];
	paymentMethod: PosFormValues["paymentMethod"];
	amountPaid: string;
	referenceNumber: string;
	note: string;
	total: number;
	isLoading?: boolean;
	onClose: () => void;
	onConfirm: () => void | Promise<void>;
}

export function PosOrderConfirmDialog({
	open,
	cart,
	paymentMethod,
	amountPaid,
	referenceNumber,
	note,
	total,
	isLoading = false,
	onClose,
	onConfirm,
}: PosOrderConfirmDialogProps) {
	return (
		<AlertDialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen && !isLoading) onClose();
			}}
		>
			<AlertDialogContent className="max-h-[90vh] w-[calc(100vw-1rem)] max-w-md rounded-[5px] border-(--light-gray) bg-(--pure-white) p-2 md:rounded-xl md:p-6">
				<Button
					variant="ghost"
					onClick={onClose}
					disabled={isLoading}
					className={cn(
						"absolute top-1 right-1 flex size-5 items-center justify-center rounded-[3px] md:top-4 md:right-4 md:size-9 md:rounded-full",
						posBtnGhost,
					)}
					aria-label="Close"
				>
					<XIcon className="size-2.5 md:size-5" />
				</Button>
				<AlertDialogTitle className="text-[9px] text-(--deep-forest) md:text-lg">
					Confirm Order
				</AlertDialogTitle>
				<AlertDialogDescription className="text-[8px] md:text-sm">
					Review this order before confirming.
				</AlertDialogDescription>
				<div className="max-h-[50vh] overflow-y-auto pr-0.5 md:pr-1">
					<PosOrderPreview
						cart={cart}
						paymentMethod={paymentMethod}
						amountPaid={amountPaid}
						referenceNumber={referenceNumber}
						note={note}
						total={total}
					/>
				</div>
				<AlertDialogFooter className="gap-0.5 md:gap-4">
					<AlertDialogCancel
						disabled={isLoading}
						className={cn(posBtnOutline, "h-5 text-[8px] md:h-10 md:text-sm")}
					>
						Cancel
					</AlertDialogCancel>
					<Button
						onClick={() => {
							void onConfirm();
						}}
						disabled={isLoading}
						className={cn(posBtnPrimary, "h-5 text-[8px] md:h-10 md:text-sm")}
					>
						{isLoading ? (
							<>
								<SpinnerIcon className="size-1.5 animate-spin md:size-4" />
								Confirming...
							</>
						) : (
							"Confirm"
						)}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
