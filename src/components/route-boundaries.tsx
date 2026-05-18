import type { ErrorComponentProps } from "@tanstack/react-router";
import { ErrorComponent, Link, useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export function RoutePendingBoundary() {
	return (
		<main className="page-wrap flex min-h-[60vh] items-center justify-center px-4 py-12">
			<div className="island-shell flex items-center gap-3 rounded-2xl px-5 py-4 shadow-sm">
				<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
				<p className="text-sm text-(--sea-ink-soft)">Loading...</p>
			</div>
		</main>
	);
}

export function RouteNotFoundBoundary() {
	return (
		<main className="page-wrap flex min-h-[60vh] items-center justify-center px-4 py-12">
			<div className="island-shell max-w-md rounded-2xl p-6 text-center shadow-sm sm:p-8">
				<p className="island-kicker mb-2">404</p>
				<h1 className="display-title mb-3 text-3xl font-bold text-(--sea-ink)">
					Page not found
				</h1>
				<p className="mb-6 text-sm leading-6 text-(--sea-ink-soft)">
					The page you&apos;re looking for does not exist or has been moved.
				</p>
				<Link
					to="/"
					className="inline-flex items-center justify-center rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-(--lagoon-deep) no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
				>
					Go home
				</Link>
			</div>
		</main>
	);
}

export function RouteErrorBoundary({ error, reset }: ErrorComponentProps) {
	const router = useRouter();

	return (
		<main className="page-wrap flex min-h-[60vh] items-center justify-center px-4 py-12">
			<div className="island-shell max-w-xl rounded-2xl p-6 shadow-sm sm:p-8">
				<p className="island-kicker mb-2">Something broke</p>
				<h1 className="display-title mb-3 text-3xl font-bold text-(--sea-ink)">
					We hit an error
				</h1>
				<ErrorComponent error={error} />
				<p className="mt-4 text-sm leading-6 text-(--sea-ink-soft)">
					Try again to re-run the loader, or return home if the route is no
					longer valid.
				</p>
				<div className="mt-6 flex flex-wrap gap-3">
					<Button onClick={() => router.invalidate()}>Retry</Button>
					<Button variant="outline" onClick={reset}>
						Reset
					</Button>
					<Link
						to="/"
						className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-(--sea-ink) no-underline transition hover:bg-[rgba(79,184,178,0.12)]"
					>
						Go home
					</Link>
				</div>
			</div>
		</main>
	);
}
