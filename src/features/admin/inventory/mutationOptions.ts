import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";

import inventoryKeys from "./keys";
import { addStock, type addStockInput } from "./server/addStock";
import {
	createInventoryItem,
	type createInventoryItemInput,
} from "./server/createInventoryItem";
import {
	deleteInventoryItem,
	type deleteInventoryItemInput,
} from "./server/deleteInventoryItem";
import {
	updateInventoryItem,
	type updateInventoryItemInput,
} from "./server/updateInventoryItem";

export const createInventoryItemMutationOptions = mutationOptions({
	mutationFn: async (data: z.infer<typeof createInventoryItemInput>) =>
		createInventoryItem({ data }),
	onSuccess: (_data, variables, _onMutateResult, mutationContext) => {
		mutationContext?.client?.invalidateQueries({
			queryKey: inventoryKeys.inventory,
		});
		toast.success("Item created", {
			description: `${variables.name} has been added to inventory.`,
		});
	},
	onError: (error) => {
		toast.error("Failed to create item", {
			description: error?.message ?? "Unknown error",
		});
	},
});

export const addStockMutationOptions = mutationOptions({
	mutationFn: async (data: z.infer<typeof addStockInput>) => addStock({ data }),
	onSuccess: (data, variables, _onMutateResult, mutationContext) => {
		mutationContext?.client?.invalidateQueries({
			queryKey: inventoryKeys.inventory,
		});
		toast.success("Stock updated", {
			description: `Added ${variables.quantity} to ${data.name}.`,
		});
	},
	onError: (error) => {
		toast.error("Failed to update stock", {
			description: error?.message ?? "Unknown error",
		});
	},
});

export const updateInventoryItemMutationOptions = mutationOptions({
	mutationFn: async (data: z.infer<typeof updateInventoryItemInput>) =>
		updateInventoryItem({ data }),
	onSuccess: (_data, variables, _onMutateResult, mutationContext) => {
		mutationContext?.client?.invalidateQueries({
			queryKey: inventoryKeys.inventory,
		});
		toast.success("Item updated", {
			description: `${variables.name} has been saved.`,
		});
	},
	onError: (error) => {
		toast.error("Failed to update item", {
			description: error?.message ?? "Unknown error",
		});
	},
});

export const deleteInventoryItemMutationOptions = mutationOptions({
	mutationFn: async (data: z.infer<typeof deleteInventoryItemInput>) =>
		deleteInventoryItem({ data }),
	onSuccess: (_data, _variables, _onMutateResult, mutationContext) => {
		mutationContext?.client?.invalidateQueries({
			queryKey: inventoryKeys.inventory,
		});
		toast.success("Item deleted");
	},
	onError: (error) => {
		toast.error("Failed to delete item", {
			description: error?.message ?? "Unknown error",
		});
	},
});
