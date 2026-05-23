import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/integrations/better-auth/auth";
import { SignInSchema } from "../schemas/auth";

const signIn = createServerFn({ method: "POST" })
	.inputValidator(SignInSchema)
	.handler(async ({ data }) => {
		if (data.method === "email") {
			const res = await auth.api.signInEmail({
				body: {
					email: data.email,
					password: data.password,
				},
			});

			return res.user;
		} else {
			const res = await auth.api.signInUsername({
				body: {
					username: data.username,
					password: data.password,
				},
			});

			return res.user;
		}
	});

export default signIn;
