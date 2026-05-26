import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useAppForm } from "@/integrations/tanstack-form";
import { saveMenuMutationOptions } from "../mutationOptions";
import { type MenuFormInput, MenuFormSchema } from "../schemas/menu";
import type { MenuListItem } from "../types";

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
          editingItem.menuInventories.map((entry) => [
            entry.inventoryId,
            entry.price,
          ]),
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
      selectedInventoryId:
        isStandaloneTracked && primaryLink ? primaryLink.inventoryId : "",
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
    validationLogic: revalidateLogic({
      mode: "submit",
    }),
    validators: {
      onDynamic: MenuFormSchema,
    },
    onSubmit: async ({ value }) => {
      await saveMenuMutation.mutateAsync(value);
      onClose();
    },
  });

  return {
    form,
    isEditing: Boolean(editingItem),
    isPending: saveMenuMutation.isPending,
  };
}
