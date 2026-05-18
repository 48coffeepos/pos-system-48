import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/cashier")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/cashier"!</div>;
}
