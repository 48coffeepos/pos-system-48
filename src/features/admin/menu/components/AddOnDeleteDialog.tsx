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
import type { AddOnItem } from "../types";

interface AddOnDeleteDialogProps {
  item: AddOnItem | null;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function AddOnDeleteDialog({
  item,
  open,
  isPending,
  onOpenChange,
  onConfirm,
}: AddOnDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <WarningCircleIcon weight="fill" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete add-on?</AlertDialogTitle>
          <AlertDialogDescription>
            {item
              ? `Delete ${item.name}? This removes the add-on from the list, but order history keeps its snapshot data.`
              : "Delete this add-on? This removes it from the list, but order history keeps its snapshot data."}
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
            {isPending ? "Deleting..." : "Delete add-on"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
