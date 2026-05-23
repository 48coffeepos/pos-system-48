import { F as literal, H as union, N as discriminatedUnion, P as email, R as object, V as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as ROLES } from "./auth-sfwZ8EMW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-B2cGA_2Z.js
var nameSchema = string().trim().min(1, "Name is required");
var usernameSchema = string().trim().min(1, "Username is required");
var passwordSchema = string().min(8, "Password must be at least 8 characters");
var CreateAccountSchema = object({
	email: email(),
	password: passwordSchema,
	name: nameSchema,
	username: usernameSchema,
	role: ROLES
});
var UpdateAccountSchema = object({
	userId: string().min(1, "User ID is required"),
	name: nameSchema,
	password: passwordSchema.optional()
});
var AccountFormSchema = discriminatedUnion("mode", [CreateAccountSchema.extend({ mode: literal("create") }), object({
	mode: literal("edit"),
	userId: string().min(1, "User ID is required"),
	name: nameSchema,
	password: union([literal(""), passwordSchema])
})]);
//#endregion
export { CreateAccountSchema as n, UpdateAccountSchema as r, AccountFormSchema as t };
