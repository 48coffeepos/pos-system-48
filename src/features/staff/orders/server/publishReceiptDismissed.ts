import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/features/auth/middlewares";
import {
	PUSHER_ORDERS_CHANNEL,
	PUSHER_RECEIPT_DISMISSED_EVENT,
} from "@/integrations/pusher/constants";
import { getPusher } from "@/integrations/pusher/server";

const publishReceiptDismissedSchema = z.object({
	order_id: z.string(),
});

export const publishReceiptDismissed = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(publishReceiptDismissedSchema)
	.handler(async ({ data }) => {
		let published = false;
		try {
			const pusher = getPusher();
			if (pusher) {
				await pusher.trigger(
					PUSHER_ORDERS_CHANNEL,
					PUSHER_RECEIPT_DISMISSED_EVENT,
					{ order_id: data.order_id },
				);
				published = true;
			}
		} catch (err) {
			console.error("Failed to publish receipt dismissed event:", err);
		}

		return { published };
	});
