import { c as auth } from "./auth-BTxLf562.mjs";
import { i as getRequestHeaders, r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signOut-C6PCn2KJ.js
var signOut_createServerFn_handler = createServerRpc({
	id: "dd78c664f8d5cf1334d03ac0b2f5d3cf9e666493fab639054431c28528ada198",
	name: "signOut",
	filename: "src/features/auth/server/signOut.ts"
}, (opts) => signOut.__executeServer(opts));
var signOut = createServerFn().handler(signOut_createServerFn_handler, async () => {
	const headers = getRequestHeaders();
	await auth.api.signOut({ headers });
});
//#endregion
export { signOut as default, signOut_createServerFn_handler };
