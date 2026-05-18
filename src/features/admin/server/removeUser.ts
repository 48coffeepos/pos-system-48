import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import z from "zod";
import { auth } from "@/integrations/better-auth/auth";

export const removeUser = createServerFn({
	method: "POST",
})
	.inputValidator(z.object({ userId: z.string() }))
	.handler(async ({ data }) => {
		const { userId } = data;

		const headers = getRequestHeaders();

		const deletedUser = await auth.api.removeUser({
			body: {
				userId,
			},
			headers,
		});

		return deletedUser;
	});
