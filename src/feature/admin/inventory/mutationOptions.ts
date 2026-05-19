import { mutationOptions } from "@tanstack/react-query";
import { z } from "zod";

import { createInventoryItem, createInventoryItemInput } from "./server/createInventoryItem";
import { addStock, addStockInput } from "./server/addStock";

export const createInventoryItemMutationOptions = mutationOptions({
  mutationFn: async (data: z.infer<typeof createInventoryItemInput>) =>
    createInventoryItem({ data }),
});

export const addStockMutationOptions = mutationOptions({
  mutationFn: async (data: z.infer<typeof addStockInput>) =>
    addStock({ data }),
});
