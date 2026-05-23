import { c as auth } from "./auth-BTxLf562.mjs";
import { i as getRequestHeaders, r as createServerFn } from "./ssr.mjs";
import { t as adminAuthMiddleware } from "./middlewares-D1Pk677b.mjs";
import { n as CreateAccountSchema } from "./admin-B2cGA_2Z.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createAccount-DFjInwWA.js
var createAccount_createServerFn_handler = createServerRpc({
	id: "f67c1b7d9ba30cb6ba0d3b0f139f0013bdb8305f8983925b3c02d6642c9fa6e6",
	name: "createAccount",
	filename: "src/features/admin/accounts/server/createAccount.ts"
}, (opts) => createAccount.__executeServer(opts));
var createAccount = createServerFn({ method: "POST" }).middleware([adminAuthMiddleware()]).inputValidator(CreateAccountSchema).handler(createAccount_createServerFn_handler, async ({ data }) => {
	const headers = getRequestHeaders();
	return auth.api.createUser({
		body: {
			email: data.email,
			password: data.password,
			name: data.name,
			role: data.role,
			data: { username: data.username }
		},
		headers
	});
});
//#endregion
export { createAccount_createServerFn_handler };
