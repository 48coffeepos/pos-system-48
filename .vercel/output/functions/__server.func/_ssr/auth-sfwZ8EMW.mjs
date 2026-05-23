import { i as ROLE_VALUES } from "./auth-BTxLf562.mjs";
import { F as literal, N as discriminatedUnion, P as email, R as object, V as string, k as _enum } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-sfwZ8EMW.js
var ROLES = _enum(ROLE_VALUES);
var SignInSchema = discriminatedUnion("method", [object({
	method: literal("email"),
	email: email(),
	password: string().min(1, "Password is required")
}), object({
	method: literal("username"),
	username: string().min(1, "Username is required"),
	password: string().min(1, "Password is required")
})]);
var signInFormSchema = object({
	identifier: string().min(1, "Email or username is required"),
	password: string().min(1, "Password is required")
});
//#endregion
export { SignInSchema as n, signInFormSchema as r, ROLES as t };
