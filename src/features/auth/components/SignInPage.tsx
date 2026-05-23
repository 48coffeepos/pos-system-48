import { SignInForm } from "./SignInForm";

export default function SignInPage() {
	return (
		<main className="flex min-h-screen items-center justify-center p-4 bg-[#F2EAE1]">
			<div className="w-full max-w-105 bg-white rounded-4xl p-8 md:p-10 shadow-sm relative">
				<div className="flex flex-col items-center">
					<img src="/logo.png" alt="48 Coffee" className="mb-3 h-30 w-auto" />
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
