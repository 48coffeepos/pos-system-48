import { createFileRoute } from "@tanstack/react-router";
import { StaffDashboardScreen } from "@/features/staff/dashboard/components/StaffDashboardScreen";

export const Route = createFileRoute("/staff/")({
	component: StaffDashboardRoute,
});

function StaffDashboardRoute() {
	return <StaffDashboardScreen />;
}
