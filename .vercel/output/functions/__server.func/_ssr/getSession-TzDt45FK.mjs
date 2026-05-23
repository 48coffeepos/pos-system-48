import { c as auth } from "./auth-BTxLf562.mjs";
import { i as getRequestHeaders, r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/getSession-TzDt45FK.js
var getSession_createServerFn_handler = createServerRpc({
	id: "1ae01ff38f50c67da481ebc1fd064cbb754fb1e198e4a11c16129b79b234e87e",
	name: "getSession",
	filename: "src/features/auth/server/getSession.ts"
}, (opts) => getSession.__executeServer(opts));
var getSession = createServerFn().handler(getSession_createServerFn_handler, async () => {
	const headers = getRequestHeaders();
	return await auth.api.getSession({ headers });
});
//#endregion
export { getSession_createServerFn_handler };
