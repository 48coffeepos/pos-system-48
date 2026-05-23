import { c as auth } from "./auth-BTxLf562.mjs";
import { i as getRequestHeaders, r as createServerFn } from "./ssr.mjs";
import { n as SignInSchema } from "./auth-sfwZ8EMW.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signIn-Dqmni0mI.js
var signIn_createServerFn_handler = createServerRpc({
	id: "5ba634fa18e37298b803642ebd1a5944d1405fd4cc8f868f611e6b5106e578ce",
	name: "signIn",
	filename: "src/features/auth/server/signIn.ts"
}, (opts) => signIn.__executeServer(opts));
var signIn = createServerFn({ method: "POST" }).inputValidator(SignInSchema).handler(signIn_createServerFn_handler, async ({ data }) => {
	const headers = getRequestHeaders();
	if (data.method === "email") return (await auth.api.signInEmail({
		body: {
			email: data.email,
			password: data.password
		},
		headers
	})).user;
	else return (await auth.api.signInUsername({
		body: {
			username: data.username,
			password: data.password
		},
		headers
	})).user;
});
//#endregion
export { signIn as default, signIn_createServerFn_handler };
