import { XIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PosModalProps {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
	className?: string;
	showClose?: boolean;
	overlayClassName?: string;
}

export function PosModal({
	open,
	onClose,
	children,
	className,
	showClose = false,
	overlayClassName,
}: PosModalProps) {
	return (
		<AlertDialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<AlertDialogContent className={cn(overlayClassName, className)}>
				{showClose ? (
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="absolute top-4 right-4 rounded-full"
						aria-label="Close"
					>
						<XIcon className="size-5" />
					</Button>
				) : null}
				{children}
			</AlertDialogContent>
		</AlertDialog>
	);
}
