import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";

import orderKeys from "./keys";
import {
  updateOrderPayment,
  type updateOrderPaymentInput,
} from "./server/updateOrderPayment";

export const updateOrderPaymentMutationOptions = mutationOptions({
  mutationFn: async (data: z.infer<typeof updateOrderPaymentInput>) =>
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
