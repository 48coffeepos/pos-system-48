import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/staff/")({
  loader: () => redirect({ to: "/staff/pos" }),
});
