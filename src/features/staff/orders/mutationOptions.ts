import { mutationOptions } from "@tanstack/react-query";
import { publishReceiptDismissed } from "./server/publishReceiptDismissed";

export const publishReceiptDismissedMutationOptions = mutationOptions({
	mutationFn: async (data: { order_id: string }) =>
		publishReceiptDismissed({ data }),
});
