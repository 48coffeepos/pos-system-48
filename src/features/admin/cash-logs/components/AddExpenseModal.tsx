import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { AddExpenseForm } from "@/features/staff/expenses/components/AddExpenseForm";

interface AddExpenseModalProps {
	open: boolean;
	onClose: () => void;
}

export function AddExpenseModal({ open, onClose }: AddExpenseModalProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogContent className="w-[calc(100vw-1rem)] max-w-md max-h-[85vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add Cash Log</DialogTitle>
				</DialogHeader>
				<AddExpenseForm embedded onSuccess={onClose} />
			</DialogContent>
		</Dialog>
	);
}
