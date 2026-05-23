import { mutationOptions, type QueryClient } from "@tanstack/react-query";
import inventoryKeys from "@/features/admin/inventory/keys";
import posKeys from "./keys";
import { createOrder } from "./server/createOrder";

export const createOrderMutationOptions = (queryClient: QueryClient) =>
	mutationOptions({
		mutationFn: async (input: Parameters<typeof createOrder>[0]["data"]) => {
			return createOrder({ data: input });
		},
		onSuccess: async () => {
			// Invalidate POS, Inventory, and Orders keys to refresh stock counts and page data
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: posKeys.all }),
				queryClient.invalidateQueries({ queryKey: inventoryKeys.inventory }),
				queryClient.invalidateQueries({ queryKey: ["orders"] }),
			]);
		},
	});
