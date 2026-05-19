import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/staff/pos")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/staff/pos"!</div>;
}
