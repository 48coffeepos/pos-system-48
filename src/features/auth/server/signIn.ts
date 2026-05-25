import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/integrations/better-auth/auth";
import { SignInSchema } from "../schemas/auth";

const signIn = createServerFn({ method: "POST" })
	.inputValidator(SignInSchema)
	.handler(async ({ data }) => {
		const headers = getRequestHeaders();

		if (data.method === "email") {
			const res = await auth.api.signInEmail({
				body: {
					email: data.email,
					password: data.password,
				},
				headers,
			});

			return res.user;
		} else {
			const res = await auth.api.signInUsername({
				body: {
					username: data.username,
					password: data.password,
				},
				headers,
			});

			return res.user;
		}
	});

export default signIn;
