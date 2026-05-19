import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cashier/pos")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/cashier/pos"!</div>;
}
