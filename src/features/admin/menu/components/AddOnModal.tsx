import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppForm } from "@/integrations/tanstack-form";
import { AddOnFormSchema, type AddOnFormInput } from "../schemas/add-on";

interface AddOnModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AddOnFormInput) => void;
}

function AddOnModal({ open, onClose, onSave }: AddOnModalProps) {
  const form = useAppForm({
    defaultValues: {
      name: "",
      amount: 0,
    },
    validators: {
      onChange: AddOnFormSchema,
    },
    onSubmit: async ({ value }) => {
      onSave({
        name: value.name.trim(),
        amount: value.amount,
      });
    },
  });

  useEffect(() => {
    if (open) form.reset();
  }, [form, open]);

  if (!open) return null;

  return (
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-md rounded-3xl p-0 sm:max-w-md"
      >
        <div className="p-8">
          <DialogHeader className="mb-6 flex-row items-start justify-between gap-4">
            <div className="space-y-2">
              <DialogTitle className="text-lg font-bold text-(--near-black)">
                Add an add-on
              </DialogTitle>
              <DialogDescription className="text-sm text-(--medium-gray)">
                Create a new menu add-on with a name and amount.
              </DialogDescription>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 transition-colors hover:bg-(--off-white)"
            >
              <XIcon weight="bold" className="h-5 w-5 text-(--medium-gray)" />
            </button>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.AppField name="name">
              {(field) => (
                <field.Input
                  label="Add-on name *"
                  placeholder="e.g. Extra shot"
                  maxLength={20}
                />
              )}
            </form.AppField>

            <form.AppField name="amount">
              {(field) => (
                <field.NumberField
                  label="Amount (PHP) *"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              )}
            </form.AppField>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="flex flex-1 items-center justify-center gap-2"
                  >
                    <CheckIcon weight="bold" className="h-4 w-4" />
                    Add add-on
                  </Button>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { AddOnModal };
