import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardScreen } from "@/features/admin/dashboard/components/AdminDashboardScreen";

export const Route = createFileRoute("/admin/")({
	component: AdminDashboard,
});

function AdminDashboard() {
	return <AdminDashboardScreen />;
}
