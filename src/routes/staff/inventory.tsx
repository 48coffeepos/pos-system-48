import { createFileRoute } from "@tanstack/react-router";
import { StaffInventoryScreen } from "@/features/staff/inventory/components/StaffInventoryScreen";

export const Route = createFileRoute("/staff/inventory")({
	component: StaffInventoryRoute,
});

function StaffInventoryRoute() {
	return <StaffInventoryScreen />;
}
