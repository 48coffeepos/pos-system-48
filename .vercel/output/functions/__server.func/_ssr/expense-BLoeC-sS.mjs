import { L as number, R as object, V as string, k as _enum } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expense-BLoeC-sS.js
var CreateExpenseSchema = object({
	type: _enum(["CASH_IN", "CASH_OUT"]),
	description: string().min(1, "Description is required").max(50, "Description must be 50 characters or less"),
	amount: number({ error: "Amount is required" }).positive("Amount must be positive").min(1, "Amount must be at least 1").max(99999999.99, "Amount must be less than 99,999,999.99")
});
//#endregion
export { CreateExpenseSchema as t };
