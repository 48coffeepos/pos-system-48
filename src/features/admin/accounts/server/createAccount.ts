import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { auth } from "@/integrations/better-auth/auth";
import { CreateAccountSchema } from "../schemas/admin";

export const createAccount = createServerFn({
	method: "POST",
})
	.middleware([adminAuthMiddleware()])
	.inputValidator(CreateAccountSchema)
	.handler(async ({ data }) => {
		const headers = getRequestHeaders();

		return auth.api.createUser({
			body: {
				email: data.email,
				password: data.password,
				name: data.name,
				role: data.role,
				data: {
					username: data.username,
				},
			},
			headers,
		});
	});
