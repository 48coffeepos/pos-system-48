import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";

import inventoryKeys from "./keys";
import { addStock, type addStockInput } from "./server/addStock";
import {
	storefrontDeductStock,
	type storefrontDeductStockInput,
} from "./server/storefrontDeductStock";
import {
	stockroomAddStock,
	type stockroomAddStockInput,
} from "./server/stockroomAddStock";
import {
	stockroomDeductStock,
	type stockroomDeductStockInput,
} from "./server/stockroomDeductStock";
import {
	createInventoryItem,
	type createInventoryItemInput,
} from "./server/createInventoryItem";
import {
	deleteInventoryItem,
	type deleteInventoryItemInput,
} from "./server/deleteInventoryItem";
import {
	suppliesEodOutStore,
	type suppliesEodOutStoreInput,
} from "./server/suppliesEodOutStore";
import {
	transferStock,
	type transferStockInput,
} from "./server/transferStock";
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
		const description =
			variables.transactionType === "add"
				? `Added ${variables.quantity} to admin stock of ${data.name}.`
				: `Transferred ${variables.quantity} from admin to storefront stock.`;
		toast.success("Stock updated", { description });
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
		mutationContext?.client?.invalidateQueries({
			queryKey: inventoryKeys.inventoryLogs,
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

export const storefrontDeductStockMutationOptions = mutationOptions({
	mutationFn: async (data: z.infer<typeof storefrontDeductStockInput>) =>
		storefrontDeductStock({ data }),
	onSuccess: (_data, variables, _onMutateResult, mutationContext) => {
		mutationContext?.client?.invalidateQueries({
			queryKey: inventoryKeys.inventory,
		});
		mutationContext?.client?.invalidateQueries({
			queryKey: inventoryKeys.inventoryLogs,
		});
		toast.success("Stock deducted from storefront", {
			description: `${variables.quantity}x ${variables.itemName} deducted from storefront stock.`,
		});
	},
	onError: (error) => {
		toast.error("Failed to deduct stock", {
			description: error?.message ?? "Unknown error",
		});
	},
});

export const stockroomAddStockMutationOptions = mutationOptions({
	mutationFn: async (data: z.infer<typeof stockroomAddStockInput>) =>
		stockroomAddStock({ data }),
	onSuccess: (_data, variables, _onMutateResult, mutationContext) => {
		mutationContext?.client?.invalidateQueries({
			queryKey: inventoryKeys.inventory,
		});
		mutationContext?.client?.invalidateQueries({
			queryKey: inventoryKeys.inventoryLogs,
		});
		toast.success("Stock added to stockroom", {
			description: `Added to stockroom`,
		});
	},
	onError: (error) => {
		toast.error("Failed to add stock", {
			description: error?.message ?? "Unknown error",
		});
	},
});

export const transferStockMutationOptions = mutationOptions({
	mutationFn: async (data: z.infer<typeof transferStockInput>) =>
		transferStock({ data }),
	onSuccess: (_data, variables, _onMutateResult, mutationContext) => {
		mutationContext?.client?.invalidateQueries({
			queryKey: inventoryKeys.inventory,
		});
		mutationContext?.client?.invalidateQueries({
			queryKey: inventoryKeys.inventoryLogs,
		});
		toast.success("Stock transferred", {
			description: `${variables.quantity}x ${variables.itemName} moved from admin to storefront.`,
		});
	},
	onError: (error) => {
		toast.error("Failed to transfer stock", {
			description: error?.message ?? "Unknown error",
		});
	},
});

export const suppliesEodOutStoreMutationOptions = mutationOptions({
	mutationFn: async (data: z.infer<typeof suppliesEodOutStoreInput>) =>
		suppliesEodOutStore({ data }),
	onSuccess: (_data, variables, _onMutateResult, mutationContext) => {
		mutationContext?.client?.invalidateQueries({
			queryKey: inventoryKeys.inventory,
		});
		mutationContext?.client?.invalidateQueries({
			queryKey: inventoryKeys.inventoryLogs,
		});
		toast.success("Usage recorded", {
			description: `${variables.quantity}x ${variables.itemName} recorded for today.`,
		});
	},
	onError: (error) => {
		toast.error("Failed to record usage", {
			description: error?.message ?? "Unknown error",
		});
	},
});

export const stockroomDeductStockMutationOptions = mutationOptions({
	mutationFn: async (data: z.infer<typeof stockroomDeductStockInput>) =>
		stockroomDeductStock({ data }),
	onSuccess: (_data, variables, _onMutateResult, mutationContext) => {
		mutationContext?.client?.invalidateQueries({
			queryKey: inventoryKeys.inventory,
		});
		mutationContext?.client?.invalidateQueries({
			queryKey: inventoryKeys.inventoryLogs,
		});
		toast.success("Stock deducted from stockroom", {
			description: `${variables.quantity}x ${variables.itemName} deducted from stockroom stock.`,
		});
	},
	onError: (error) => {
		toast.error("Failed to deduct stock", {
			description: error?.message ?? "Unknown error",
		});
	},
});
