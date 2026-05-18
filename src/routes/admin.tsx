import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/features/auth/components/SignOutButton";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
});

function AdminLayout() {
	return (
		<div className="min-h-screen">
			<header className="border-b">
				<div className="flex items-center justify-between p-4">
					<nav className="flex items-center gap-4">
						<Link to="/admin" className="font-semibold">
							48 Coffee - Admin
						</Link>
						<Button
							variant="ghost"
							nativeButton={false}
							render={<Link to="/admin">Dashboard</Link>}
						/>
						<Button
							variant="ghost"
							nativeButton={false}
							render={<Link to="/admin/users">Users</Link>}
						/>
					</nav>
					<SignOutButton />
				</div>
			</header>
			<main className="p-6">
				<Outlet />
			</main>
		</div>
	);
}
