import { WarningCircle } from "@phosphor-icons/react";
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
import type { AdminAccount } from "@/features/admin/accounts/types";

interface AccountDeleteDialogProps {
	account: AdminAccount | null;
	open: boolean;
	isPending: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

export function AccountDeleteDialog({
	account,
	open,
	isPending,
	onOpenChange,
	onConfirm,
}: AccountDeleteDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia className="bg-destructive/10 text-destructive">
						<WarningCircle weight="fill" />
					</AlertDialogMedia>
					<AlertDialogTitle>Delete account?</AlertDialogTitle>
					<AlertDialogDescription>
						{account
							? `Delete ${account.name}'s account? This action cannot be undone.`
							: "Delete this account? This action cannot be undone."}
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
						{isPending ? "Deleting..." : "Delete Account"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
