import { mutationOptions } from "@tanstack/react-query";
import { z } from "zod";


import { createInventoryItem, createInventoryItemInput } from "./server/createInventoryItem";

export const createInventoryItemMutationOptions = mutationOptions({
  mutationFn: async (data: z.infer<typeof createInventoryItemInput>) =>
    createInventoryItem({ data }),
  onSuccess: () => {
    // toast.success("Inventory item created successfully!");

    
  },
});
