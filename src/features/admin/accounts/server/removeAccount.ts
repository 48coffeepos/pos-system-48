import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { auth } from "@/integrations/better-auth/auth";
import { z } from "zod";

export const removeAccount = createServerFn({
	method: "POST",
})
	.middleware([adminAuthMiddleware()])
	.inputValidator(z.object({ userId: z.string().min(1, "User ID is required") }))
	.handler(async ({ data }) => {
		const headers = getRequestHeaders();

		return auth.api.removeUser({
			body: {
				userId: data.userId,
			},
			headers,
		});
	});
