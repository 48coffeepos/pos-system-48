import { m as prisma, p as PrismaClientKnownRequestError } from "./auth-BTxLf562.mjs";
import { L as number, R as object, V as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/updateAddOn--6VxYPi4.js
var UpdateAddOnSchema = object({
	id: string().min(1),
	name: string().trim().min(1, "Add-on name is required").max(20, "Add-on name must be 20 characters or fewer"),
	amount: number({ error: "Amount is required" }).min(0, "Amount must be zero or more")
});
var updateAddOn_createServerFn_handler = createServerRpc({
	id: "7926727ea884dccf6e395d2f7f4bba057421aa1ed44b5f21f7b3f0dc90b04d03",
	name: "updateAddOn",
	filename: "src/features/admin/menu/server/updateAddOn.ts"
}, (opts) => updateAddOn.__executeServer(opts));
var updateAddOn = createServerFn({ method: "POST" }).inputValidator(UpdateAddOnSchema).handler(updateAddOn_createServerFn_handler, async ({ data }) => {
	if (!await prisma.addon.findUnique({ where: { addon_id: data.id } })) throw new Error("Add-on not found.");
	try {
		const updated = await prisma.addon.update({
			where: { addon_id: data.id },
			data: {
				name: data.name,
				price: data.amount
			}
		});
		return {
			id: updated.addon_id,
			name: updated.name,
			amount: Number(updated.price)
		};
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") throw new Error(`The add-on name "${data.name}" already exists. Try a different name.`);
		throw error;
	}
});
//#endregion
export { updateAddOn_createServerFn_handler };
