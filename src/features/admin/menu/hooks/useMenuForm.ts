import { useAppForm } from "@/integrations/tanstack-form";
import type { MenuListItem } from "../types";
import { MenuFormSchema, type MenuFormInput } from "../schemas/menu";
import { saveMenuMutationOptions } from "../mutationOptions";
import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";

interface UseMenuFormOptions {
  editingItem: MenuListItem | null;
  onClose: () => void;
}

function getDefaultValues(editingItem: MenuListItem | null): MenuFormInput {
  if (editingItem) {
    const isTracked = editingItem.type !== null;
    const isCupTracked = editingItem.type === "CUP";
    const isStandaloneTracked = editingItem.type === "STANDALONE";
    const selectedCupIds = isCupTracked
      ? editingItem.menuInventories.map((entry) => entry.inventoryId)
      : [];
    const cupPrices = isCupTracked
      ? Object.fromEntries(
          editingItem.menuInventories.map((entry) => [entry.inventoryId, entry.price]),
        )
      : {};
    const primaryLink = editingItem.menuInventories[0];

    return {
      mode: "edit" as const,
      menuId: editingItem.id,
      name: editingItem.name,
      trackInventory: isTracked,
      price: editingItem.price ?? undefined,
      itemType: editingItem.type ?? undefined,
      selectedCupIds,
      cupPrices,
      standaloneMode: isStandaloneTracked ? "existing" : undefined,
      selectedInventoryId: isStandaloneTracked && primaryLink ? primaryLink.inventoryId : "",
      newInventoryName: "",
      standalonePrice:
        isStandaloneTracked && primaryLink ? primaryLink.price : undefined,
    };
  }

  return {
    mode: "create" as const,
    name: "",
    trackInventory: false,
    price: undefined,
    itemType: undefined,
    selectedCupIds: [],
    cupPrices: {},
    standaloneMode: undefined,
    selectedInventoryId: "",
    newInventoryName: "",
    standalonePrice: undefined,
  };
}

export function useMenuForm({ editingItem, onClose }: UseMenuFormOptions) {
  const saveMenuMutation = useMutation(saveMenuMutationOptions);

  const form = useAppForm({
    defaultValues: getDefaultValues(editingItem),
    validators: {
      onDynamic: MenuFormSchema,
    },
    onSubmit: async ({ value }) => {
      await saveMenuMutation.mutateAsync(value as z.infer<typeof MenuFormSchema>);
      onClose();
    },
  });

  return { form, isEditing: Boolean(editingItem), isPending: saveMenuMutation.isPending };
}
