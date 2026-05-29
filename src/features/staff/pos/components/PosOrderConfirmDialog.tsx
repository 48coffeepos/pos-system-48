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
import { formatPeso } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import { posBtnGhost, posBtnOutline, posBtnPrimary } from "../pos-ui";

interface PosOrderConfirmDialogProps {
  open: boolean;
  total: number;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
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
        if (!isOpen && !isLoading) onClose();
      }}
    >
      <AlertDialogContent className="rounded-[5px] border-(--light-gray) bg-(--pure-white) p-2 lg:rounded-xl lg:p-6">
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
          className={cn("absolute top-1 right-1 flex size-5 items-center justify-center rounded-[3px] lg:top-4 lg:right-4 lg:size-9 lg:rounded-full", posBtnGhost)}
          aria-label="Close"
        >
          <XIcon className="size-2.5 lg:size-5" />
        </Button>
        <AlertDialogTitle className="text-[9px] text-(--deep-forest) lg:text-lg">
          Confirm Order
        </AlertDialogTitle>
        <AlertDialogDescription className="text-[8px] lg:text-sm">
          Are you sure you want to place this order for {formatPeso(total)}?
        </AlertDialogDescription>
        <AlertDialogFooter className="gap-0.5 lg:gap-4">
          <AlertDialogCancel disabled={isLoading} className={cn(posBtnOutline, "h-5 text-[8px] lg:h-10 lg:text-sm")}>
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={() => {
              void onConfirm();
            }}
            disabled={isLoading}
            className={cn(posBtnPrimary, "h-5 text-[8px] lg:h-10 lg:text-sm")}
          >
            {isLoading ? (
              <>
                <SpinnerIcon className="size-1.5 animate-spin lg:size-4" />
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
