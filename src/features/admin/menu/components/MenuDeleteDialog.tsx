import { WarningCircleIcon } from "@phosphor-icons/react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { MenuListItem } from "../types";

interface MenuDeleteDialogProps {
	item: MenuListItem | null;
	open: boolean;
	isPending: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

export function MenuDeleteDialog({
	item,
	open,
	isPending,
	onOpenChange,
	onConfirm,
}: MenuDeleteDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia className="bg-destructive/10 text-destructive">
						<WarningCircleIcon weight="fill" />
					</AlertDialogMedia>
					<AlertDialogTitle>Delete menu item?</AlertDialogTitle>
					<AlertDialogDescription>
						{item
							? `Delete ${item.name}? This removes the menu item from the list, but order history keeps its snapshot data.`
							: "Delete this menu item? This removes it from the list, but order history keeps its snapshot data."}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						type="button"
						variant="destructive"
						onClick={onConfirm}
						disabled={isPending}
					>
						{isPending ? "Deleting..." : "Delete item"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
