import { createFileRoute } from "@tanstack/react-router";
import { ExpensesScreen } from "@/features/staff/expenses/components/ExpensesScreen";

export const Route = createFileRoute("/staff/expenses")({
	component: StaffExpensesRoute,
});

function StaffExpensesRoute() {
	return <ExpensesScreen />;
}
