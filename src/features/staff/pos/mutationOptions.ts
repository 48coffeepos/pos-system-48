import { mutationOptions, type QueryClient } from "@tanstack/react-query";
import inventoryKeys from "@/features/admin/inventory/keys";
import orderKeys from "@/features/staff/orders/keys";
import { xreadingKeys } from "@/features/staff/xreading/keys";
import posKeys from "./keys";
import { createOrder } from "./server/createOrder";

export const createOrderMutationOptions = (queryClient: QueryClient) =>
	mutationOptions({
		mutationFn: async (input: Parameters<typeof createOrder>[0]["data"]) => {
			return createOrder({ data: input });
		},
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: posKeys.all }),
				queryClient.invalidateQueries({ queryKey: inventoryKeys.inventory }),
				queryClient.invalidateQueries({ queryKey: orderKeys.all }),
				queryClient.invalidateQueries({ queryKey: xreadingKeys.all }),
			]);
		},
	});
