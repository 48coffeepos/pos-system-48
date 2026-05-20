"use client";

import { Button } from "@/components/ui/button";
import { useLogOut } from "../hooks/useLogOut";

function LogOutButton() {
	const { handleLogOut, isPending } = useLogOut();

	return (
		<Button variant="outline" onClick={handleLogOut} disabled={isPending}>
			Sign Out
		</Button>
	);
}

export type { LogOutButton };
