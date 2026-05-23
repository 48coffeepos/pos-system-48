import { useSignIn } from "../hooks/useSignIn";

export function SignInForm() {
	const form = useSignIn();
	return (
		<div>
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

				{/* Submit Button */}
				<form.AppForm>
					<form.SubmitButton label="Log In" />
				</form.AppForm>
			</form>
		</div>
	);
}
