import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import authKeys from "@/features/auth/keys";
import { signInMutationOptions } from "@/features/auth/mutationOptions";
import {
	type SignInInput,
	signInFormSchema,
} from "@/features/auth/schemas/auth";
import { useAppForm } from "@/integrations/tanstack-form";
import { cn } from "@/lib/utils";

export function SignInForm() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const mutation = useMutation(signInMutationOptions);

	const [role, setRole] = useState<"cashier" | "admin">("cashier");

	const form = useAppForm({
		defaultValues: {
			identifier: "",
			password: "",
		},
		validators: {
			onSubmit: signInFormSchema,
		},
		onSubmit: async ({ value }) => {
			const input: SignInInput = value.identifier.includes("@")
				? {
						method: "email" as const,
						email: value.identifier,
						password: value.password,
					}
				: {
						method: "username" as const,
						username: value.identifier,
						password: value.password,
					};

			await mutation.mutateAsync(input);
			queryClient.invalidateQueries({ queryKey: authKeys.session() });
			queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
			router.invalidate();
		},
	});

	return (
		<div>
			<div className="flex bg-[#EAE4DC] rounded-xl p-1 mb-8">
				<Button
					type="button"
					onClick={() => setRole("cashier")}
					variant="ghost"
					className={cn(
						"flex-1 h-12 rounded-lg font-medium transition-colors",
						role === "cashier"
							? "bg-[#422D27] text-white shadow-sm hover:bg-[#422D27]"
							: "text-[#422D27] hover:bg-[#EAE4DC]/80",
					)}
				>
					Cashier
				</Button>
				<Button
					type="button"
					onClick={() => setRole("admin")}
					variant="ghost"
					className={cn(
						"flex-1 h-12 rounded-lg font-medium transition-colors",
						role === "admin"
							? "bg-[#422D27] text-white shadow-sm hover:bg-[#422D27]"
							: "text-[#422D27] hover:bg-[#EAE4DC]/80",
					)}
				>
					Admin
				</Button>
			</div>

			{/* Toggle */}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<form.AppField name="identifier">
					{(field) => (
						<field.Input
							label="Email or Username"
							placeholder="Email or Username"
						/>
					)}
				</form.AppField>

				<form.AppField name="password">
					{(field) => (
						<field.Password label="Password" placeholder="Enter password" />
					)}
				</form.AppField>

				{mutation.error && (
					<p className="text-red-500 text-sm text-center">
						{mutation.error.message}
					</p>
				)}

				{/* Submit Button */}
				<div className="pt-2">
					<Button
						type="submit"
						disabled={mutation.isPending}
						className="h-14 w-full rounded-xl bg-[#422D27] text-white font-medium hover:bg-[#34231E] active:scale-[0.98]"
					>
						<span>{mutation.isPending ? "Logging in..." : "Login"}</span>
						{!mutation.isPending && <ArrowRight data-icon="inline-end" />}
					</Button>
				</div>
			</form>
		</div>
	);
}
