import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pos")({
	component: PosRoute,
});

function PosRoute() {
	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold">POS Dashboard</h1>
			<p>Welcome to the Point of Sale system.</p>
		</div>
	);
}
