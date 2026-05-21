import { createFileRoute } from "@tanstack/react-router";
import { OrdersScreen } from "@/features/staff/orders/components/OrdersScreen";

export const Route = createFileRoute("/staff/orders")({
	component: StaffOrdersRoute,
});

function StaffOrdersRoute() {
	return <OrdersScreen />;
}
