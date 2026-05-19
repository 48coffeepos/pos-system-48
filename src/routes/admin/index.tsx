import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/features/admin/inventory/components/AdminHeader";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="min-h-screen">
      <AdminHeader />
      <main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--deep-forest)]">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--medium-gray)]">
            Welcome to the admin panel. Manage your coffee shop from here.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[var(--light-gray)] bg-[var(--pure-white)] p-6">
            <p className="text-sm font-medium text-[var(--medium-gray)]">
              Total Orders
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--deep-forest)]">
              —
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--light-gray)] bg-[var(--pure-white)] p-6">
            <p className="text-sm font-medium text-[var(--medium-gray)]">
              Menu Items
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--deep-forest)]">
              —
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--light-gray)] bg-[var(--pure-white)] p-6">
            <p className="text-sm font-medium text-[var(--medium-gray)]">
              Inventory
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--deep-forest)]">
              —
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--light-gray)] bg-[var(--pure-white)] p-6">
            <p className="text-sm font-medium text-[var(--medium-gray)]">
              Accounts
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--deep-forest)]">
              —
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
