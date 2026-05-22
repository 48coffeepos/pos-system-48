import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";

import inventoryKeys from "@/features/admin/inventory/keys";
import menuKeys, { addonKeys } from "./keys";
import { deleteMenu, deleteMenuInput } from "./server/deleteMenu";
import { saveMenu, saveMenuInput } from "./server/saveMenu";
import { createAddOn, CreateAddOnSchema } from "./server/createAddOn";

export const saveMenuMutationOptions = mutationOptions({
  mutationFn: async (data: z.infer<typeof saveMenuInput>) => saveMenu({ data }),
  onSuccess: async (data, variables, _onMutateResult, mutationContext) => {
    await mutationContext?.client?.invalidateQueries({ queryKey: menuKeys.all });
    if (variables.trackInventory) {
      await mutationContext?.client?.invalidateQueries({
        queryKey: inventoryKeys.inventory,
      });
    }

    toast.success(variables.mode === "edit" ? "Menu updated" : "Menu created", {
      description: `${data.name} was saved successfully.`,
    });
  },
  onError: (error) => {
    toast.error("Failed to save menu item", {
      description: error instanceof Error ? error.message : "Unknown error",
    });
  },
});

export const deleteMenuMutationOptions = mutationOptions({
  mutationFn: async (data: z.infer<typeof deleteMenuInput>) => deleteMenu({ data }),
  onSuccess: async (_data, _variables, _onMutateResult, mutationContext) => {
    await mutationContext?.client?.invalidateQueries({ queryKey: menuKeys.all });
    toast.success("Menu item deleted");
  },
  onError: (error) => {
    toast.error("Failed to delete menu item", {
      description: error instanceof Error ? error.message : "Unknown error",
    });
  },
});

export const createAddOnMutationOptions = mutationOptions({
  mutationFn: async (data: z.infer<typeof CreateAddOnSchema>) => createAddOn({ data }),
  onSuccess: (_data, variables, _onMutateResult, mutationContext) => {
    mutationContext?.client?.invalidateQueries({ queryKey: addonKeys.all });
    toast.success("Add-on created", {
      description: `${variables.name} has been added.`,
    });
  },
  onError: (error) => {
    toast.error("Failed to create add-on", {
      description: error instanceof Error ? error.message : "Unknown error",
    });
  },
});
