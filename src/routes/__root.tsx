import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/sonner";
import { TanstackFormDevtools } from "@/integrations/tanstack-form";
import {
	RouteErrorBoundary,
	RouteNotFoundBoundary,
	RoutePendingBoundary,
} from "../components/route-boundaries";
import { ServiceWorkerRegister } from "../components/ServiceWorkerRegister";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import { createSeo } from "../lib/seo";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
			{
				name: "theme-color",
				content: "#4FB8B2",
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes",
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent",
			},
			{
				name: "apple-mobile-web-app-title",
				content: "48 POS",
			},
			{
				name: "application-name",
				content: "48 Coffee POS",
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
			{
				rel: "icon",
				type: "image/png",
				sizes: "48x48",
				href: "/favicon.png?v=4",
			},
			{
				rel: "manifest",
				href: "/manifest.json",
			},
			{
				rel: "apple-touch-icon",
				href: "/logo.png?v=2",
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
				<ServiceWorkerRegister />
				<Toaster position="top-right" richColors duration={3000} closeButton />
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
