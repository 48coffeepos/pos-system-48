import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";

import orderKeys from "./keys";
import {
  updateOrderPayment,
} from "./server/updateOrderPayment";

export const updateOrderPaymentMutationOptions = mutationOptions({
  mutationFn: async (data: { orderId: string, method: "CASH" | "GCASH" | "GRAB", amount_tendered: number, reference_number?: string }) =>
    updateOrderPayment({ data }),
  onSuccess: (_data, _variables, _onMutateResult, mutationContext) => {
    mutationContext?.client?.invalidateQueries({
      queryKey: orderKeys.all,
    });
    toast.success("Payment updated", {
      description: "The order payment details have been saved.",
    });
  },
  onError: (error) => {
    toast.error("Failed to update payment", {
      description: error?.message ?? "Unknown error",
    });
  },
});

import {
  updateOrderItems,
} from "./server/updateOrderItems";

export const updateOrderItemsMutationOptions = mutationOptions({
  mutationFn: async (data: { orderId: string, items: any[] }) =>
    updateOrderItems({ data }),
  onSuccess: (_data, _variables, _onMutateResult, mutationContext) => {
    mutationContext?.client?.invalidateQueries({
      queryKey: orderKeys.all,
    });
    toast.success("Order items updated", {
      description: "The order items and totals have been successfully modified.",
    });
  },
  onError: (error) => {
    toast.error("Failed to update items", {
      description: error?.message ?? "Unknown error",
    });
  },
});
