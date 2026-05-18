import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { authClient } from "@/integrations/better-auth/auth-client";
import { TanstackFormDevtools } from "@/integrations/tanstack-form";
import {
	RouteErrorBoundary,
	RouteNotFoundBoundary,
	RoutePendingBoundary,
} from "../components/route-boundaries";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import { createSeo } from "../lib/seo";
import appCss from "../styles.css?url";

type Session = typeof authClient.$Infer.Session;

interface MyRouterContext {
	queryClient: QueryClient;
	session: Session | null;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async () => {
		try {
			const { data } = await authClient.getSession();
			return { session: data ?? null };
		} catch {
			return { session: null };
		}
	},
	errorComponent: RouteErrorBoundary,
	notFoundComponent: RouteNotFoundBoundary,
	pendingComponent: RoutePendingBoundary,
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			...createSeo({
				title: "48 Coffee POS",
				description: "POS for 48 Coffee - Ledesma",
			}).meta,
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
						TanstackFormDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
