import { m as prisma, p as PrismaClientKnownRequestError } from "./auth-BTxLf562.mjs";
import { L as number, R as object, V as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createAddOn-BP86T1so.js
var CreateAddOnSchema = object({
	name: string().trim().min(1, "Add-on name is required").max(20, "Add-on name must be 20 characters or fewer"),
	amount: number({ error: "Amount is required" }).min(0, "Amount must be zero or more")
});
var createAddOn_createServerFn_handler = createServerRpc({
	id: "6ba6ab8b1c0f585ad1148b396b724dae6d090541403cc202ecd2224fa06ea2b2",
	name: "createAddOn",
	filename: "src/features/admin/menu/server/createAddOn.ts"
}, (opts) => createAddOn.__executeServer(opts));
var createAddOn = createServerFn({ method: "POST" }).inputValidator(CreateAddOnSchema).handler(createAddOn_createServerFn_handler, async ({ data }) => {
	try {
		const addOn = await prisma.addon.create({ data: {
			name: data.name,
			price: data.amount
		} });
		return {
			id: addOn.addon_id,
			name: addOn.name,
			amount: Number(addOn.price)
		};
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") throw new Error(`The add-on name "${data.name}" already exists. Try a different name.`);
		throw error;
	}
});
//#endregion
export { createAddOn_createServerFn_handler };
