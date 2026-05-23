import { m as prisma } from "./auth-BTxLf562.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { n as authMiddleware } from "./middlewares-D1Pk677b.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
import { t as CreateExpenseSchema } from "./expense-BLoeC-sS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createExpense-DneLDsG_.js
var createExpense_createServerFn_handler = createServerRpc({
	id: "4f518719f95035ad87314f7bf1849aaf262dcbdcd3e412c455d0ac112730da3f",
	name: "createExpense",
	filename: "src/features/staff/expenses/server/createExpense.ts"
}, (opts) => createExpense.__executeServer(opts));
var createExpense = createServerFn({ method: "POST" }).middleware([authMiddleware]).inputValidator(CreateExpenseSchema).handler(createExpense_createServerFn_handler, async ({ data, context }) => {
	const expense = await prisma.expense.create({
		data: {
			staff_id: context.session.user.id,
			type: data.type,
			description: data.description,
			amount: data.amount
		},
		include: { staff: { select: { name: true } } }
	});
	return {
		expense_id: expense.expense_id,
		staff_name: expense.staff.name,
		type: expense.type,
		description: expense.description,
		amount: Number(expense.amount),
		timestamp: expense.timestamp.toISOString()
	};
});
//#endregion
export { createExpense_createServerFn_handler };
