"use client";

import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/integrations/better-auth/auth-client";
import { useAppForm } from "@/integrations/tanstack-form";
import { suppliesEodOutStoreMutationOptions } from "../../mutationOptions";

interface SuppliesEodOutStoreProps {
  item: { id: string; name: string; endingStore: number };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  quantity: z.number().int().min(1, "Must record at least 1 unit used"),
});

function SuppliesEodOutStore({
  item,
  open,
  onOpenChange,
}: SuppliesEodOutStoreProps) {
  const { data: session } = authClient.useSession();

  const mutation = useMutation({
    ...suppliesEodOutStoreMutationOptions,
    onSettled: () => {
      onOpenChange(false);
      form.reset();
    },
  });

  const form = useAppForm({
    defaultValues: { quantity: 1 },
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      if (!session?.user) return;
      mutation.mutate({
        itemId: item.id,
        quantity: value.quantity,
        itemName: item.name,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record daily usage — {item.name}</DialogTitle>
          <DialogDescription>
            Enter how many units were used today. Current storefront stock:{" "}
            <span className="font-semibold text-(--deep-forest)">
              {item.endingStore}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField name="quantity">
            {(field) => (
              <field.NumberField
                label="Units used today"
                placeholder="Enter quantity"
                min="1"
                step="1"
              />
            )}
          </form.AppField>

          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton
                label={mutation.isPending ? "Saving..." : "Record usage"}
              />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { SuppliesEodOutStore };
export type { SuppliesEodOutStoreProps };
