import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";

import dashboardKeys from "@/features/admin/dashboard/keys";
import orderKeys from "./keys";
import {
	updateOrderItems,
	type updateOrderItemsInput,
} from "./server/updateOrderItems";
import { cancelOrder } from "./server/cancelOrder";
import { updateOrderPayment } from "./server/updateOrderPayment";

async function invalidateOrderAndDashboard(
	mutationContext:
		| {
				client?: {
					invalidateQueries: (filters: {
						queryKey: readonly string[];
					}) => Promise<void>;
				};
		  }
		| undefined,
) {
	if (!mutationContext?.client) return;
	await Promise.all([
		mutationContext.client.invalidateQueries({ queryKey: orderKeys.all }),
		mutationContext.client.invalidateQueries({ queryKey: dashboardKeys.all }),
	]);
}

export const updateOrderPaymentMutationOptions = mutationOptions({
	mutationFn: async (data: {
		orderId: string;
		method: "CASH" | "GCASH" | "GRAB";
		amount_tendered: number;
		reference_number?: string;
	}) => updateOrderPayment({ data }),
	onSuccess: async (_data, _variables, _onMutateResult, mutationContext) => {
		await invalidateOrderAndDashboard(mutationContext);
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

export const updateOrderItemsMutationOptions = mutationOptions({
	mutationFn: async (data: z.infer<typeof updateOrderItemsInput>) =>
		updateOrderItems({ data }),
	onSuccess: async (data, _variables, _onMutateResult, mutationContext) => {
		await invalidateOrderAndDashboard(mutationContext);
		toast.success("Order items updated", {
			description:
				"The order items and totals have been successfully modified.",
		});
		if (data.negative_stock_items?.length) {
			toast.warning("Some items are now below zero stock", {
				description: data.negative_stock_items
					.map((item) => `${item.name} (${item.ending})`)
					.join(", "),
			});
		}
	},
	onError: (error) => {
		toast.error("Failed to update items", {
			description: error?.message ?? "Unknown error",
		});
	},
});

export const cancelOrderMutationOptions = mutationOptions({
	mutationFn: async (data: { orderId: string }) => cancelOrder({ data }),
	onSuccess: async (_data, _variables, _onMutateResult, mutationContext) => {
		await invalidateOrderAndDashboard(mutationContext);
		toast.success("Order canceled", {
			description:
				"The order has been canceled. Inventory has been restored.",
		});
	},
	onError: (error) => {
		toast.error("Failed to cancel order", {
			description: error?.message ?? "Unknown error",
		});
	},
});
