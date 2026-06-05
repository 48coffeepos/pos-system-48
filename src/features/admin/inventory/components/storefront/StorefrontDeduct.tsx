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
import { storefrontDeductStockMutationOptions } from "../../mutationOptions";

interface StorefrontDeductProps {
  item: { id: string; name: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  quantity: z.number().int().min(1, "Must deduct at least 1 item"),
});

function StorefrontDeduct({ item, open, onOpenChange }: StorefrontDeductProps) {
  const { data: session } = authClient.useSession();

  const mutation = useMutation({
    ...storefrontDeductStockMutationOptions,
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
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>
            <span className="font-bold text-red-500">OUT stock</span> from <span className="font-bold text-red-500">storefront</span> inventory
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
                label="Quantity to Deduct"
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
                label={mutation.isPending ? "Deducting..." : "Save"}
              />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { StorefrontDeduct };
export type { StorefrontDeductProps };
