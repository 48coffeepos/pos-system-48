import { createFileRoute } from "@tanstack/react-router";
import { PosScreen } from "@/features/staff/pos/components/PosScreen";

export const Route = createFileRoute("/staff/pos")({
	component: PosScreen,
});
