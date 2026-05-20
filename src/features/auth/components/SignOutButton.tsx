"use client";

import { Button } from "@/components/ui/button";
import { useSignOut } from "../hooks/useSignOut";

function SignOutButton() {
	const { handleSignOut, isPending } = useSignOut();

	return (
		<Button variant="outline" onClick={handleSignOut} disabled={isPending}>
			Sign Out
		</Button>
	);
}

export { SignOutButton };
