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
import { stockroomAddStockMutationOptions } from "../../mutationOptions";

interface StockroomAddProps {
  item: { id: string; name: string; costPrice: number };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  quantity: z.number().int().min(1, "Must add at least 1 item"),
});

function StockroomAdd({ item, open, onOpenChange }: StockroomAddProps) {
  const { data: session } = authClient.useSession();

  const mutation = useMutation({
    ...stockroomAddStockMutationOptions,
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
            <span className="font-bold text-red-500">Add stock</span> to <span className="font-bold text-red-500">stockroom</span> inventory
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
                label="Quantity"
                placeholder="Enter quantity"
                min="1"
              />
            )}
          </form.AppField>

          <div className="mt-3 flex items-center justify-between rounded-lg bg-(--pale-yellow)/50 px-4 py-2.5 text-sm">
            <span className="font-medium text-(--dark-gray)">Cost per unit</span>
            <span className="font-semibold text-(--deep-forest)">
              ₱{item.costPrice.toFixed(2)}
            </span>
          </div>

          <form.Subscribe
            selector={(state) => ({
              quantity: state.values.quantity,
            })}
          >
            {({ quantity }) => {
              const qty = Number.isFinite(quantity) ? quantity : 0;
              return (
                <div className="mt-4 flex items-center justify-between rounded-lg bg-(--soft-peach)/50 px-4 py-3 text-sm">
                  <span className="font-medium text-(--dark-gray)">Total Expense</span>
                  <span className="text-lg font-bold text-(--deep-forest)">
                    ₱{(qty * item.costPrice).toFixed(2)}
                  </span>
                </div>
              );
            }}
          </form.Subscribe>

          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton
                label={mutation.isPending ? "Adding..." : "Save"}
              />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { StockroomAdd };
export type { StockroomAddProps };
