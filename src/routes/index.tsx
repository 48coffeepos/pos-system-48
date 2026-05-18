import { createFileRoute, redirect } from "@tanstack/react-router";
import { Coffee } from "lucide-react";
import { SignInForm } from "@/features/auth/components/SignInForm";

export const Route = createFileRoute("/")({
	beforeLoad: ({ context }) => {
		if (context.session?.user) {
			throw redirect({ to: "/pos" });
		}
	},
	component: RootPage,
});

function RootPage() {
	return (
		<main className="flex min-h-screen items-center justify-center p-4 bg-[#F2EAE1]">
			<div className="w-full max-w-[420px] bg-white rounded-[32px] p-8 md:p-10 shadow-sm relative">
				<div className="flex flex-col items-center mb-8">
					<div className="w-[72px] h-[72px] bg-[#422D27] text-white rounded-full flex items-center justify-center mb-3">
						<Coffee className="w-8 h-8" />
					</div>
					<div className="text-center font-bold text-[#422D27] text-lg leading-tight">
						<div>48</div>
						<div>Coffee</div>
					</div>
				</div>
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-[#422D27] mb-2">Login</h1>
					<p className="text-[#8B7C7A]">Please Login to continue</p>
				</div>
				<SignInForm />
			</div>
		</main>
	);
}
