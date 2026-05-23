import { mutationOptions, type QueryClient } from "@tanstack/react-query";
import inventoryKeys from "@/features/admin/inventory/keys";
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
				queryClient.invalidateQueries({ queryKey: ["orders"] }),
				queryClient.invalidateQueries({ queryKey: xreadingKeys.all }),
			]);
		},
	});
