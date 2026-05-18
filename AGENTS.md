<!-- intent-skills:start -->

## Skill Loading

Before substantial work:

- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# 48-coffee-pos — TanStack Start POS Client

## Scaffold Command

```
npx @tanstack/cli@latest create 48-coffee-pos --framework React --yes --package-manager npm --add-ons better-auth,prisma,neon,tanstack-query,table
```

## Stack & Integrations

- **Framework**: TanStack Start (React) w/ file-based routing
- **Styling**: Tailwind CSS v4 w/ `@tailwindcss/vite`
- **Auth**: Better Auth w/ Prisma adapter (`@better-auth/prisma-adapter`), experimental joins enabled
- **Database ORM**: Prisma v7 (`@prisma/adapter-neon` for Neon-optimized connection)
- **Database**: Neon (Postgres)
- **State/Data**: TanStack Query (SSR-integrated via `@tanstack/react-router-ssr-query`)
- **Client State**: Zustand (global UI + domain client state)
- **Forms**: TanStack Form v1 w/ Zod (Standard Schema validation, no adapter needed)
- **UI Table**: TanStack Table w/ match-sorter-utils for fuzzy filtering
- **Devtools**: TanStack Devtools, React Router Devtools, Query Devtools
- **Testing**: Vitest + jsdom + Testing Library
- **Toolchain**: TypeScript 6, Vite 8, Rolldown

## Environment Variables (.env.local)

```
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<generate via: npx -y @better-auth/cli secret>
DATABASE_URL=pq://...pooler... (pooled — for the app via Prisma adapter)
DIRECT_URL=pq://... (direct — for Prisma CLI commands)
```

## Key Architecture

- `/src/routes/` — file-based routing via TanStack Router
- `/src/integrations/prisma/db.ts` — shared Prisma client w/ `@prisma/adapter-neon` (Neon-optimized)
- `/src/integrations/better-auth/auth.ts` — Better Auth server config w/ Prisma adapter + experimental joins
- `/src/integrations/better-auth/auth-client.ts` — Better Auth client config
- `/src/integrations/tanstack-query/` — Query provider + devtools
- `/src/integrations/tanstack-form/` — TanStack Form w/ createFormHook + registered field/form components
- `/prisma/schema.prisma` — Prisma schema (Todo, User, Session, Account, Verification)
- `/prisma.config.ts` — Prisma v7 config (uses `DIRECT_URL` for CLI)
- `/src/generated/prisma/` — Generated Prisma client (gitignored)
- `/src/stores/` — Global client state (Zustand)
- `/src/components/ui/data-table.tsx` — Generic table primitive (TanStack Table + shadcn)

## Repo Conventions

- Organize code by domain/feature first, not by technical layer alone.
- Each feature should own its own `components/`, `hooks/`, `server/`, `schemas/`, `queries/`, and `mutations/` as needed.
- Keep feature logic colocated inside `src/features/<domain>/`.
- Keep route files thin; they should compose feature modules, not contain business logic.
- Use `@/` imports for app code under `src/`.
- Use the shared Prisma client from `@/integrations/prisma/db` as the single database entry point.
- Keep Prisma access out of route components and UI components.
- Shared UI primitives belong in `src/components/ui/` only when they are truly app-wide.
- Feature tables should compose the generic `DataTable` primitive from `@/components/ui/data-table`, not rebuild TanStack Table wiring from scratch.
- Do not manually edit `routeTree.gen.ts`.

## Zustand Conventions

- Global UI state (theme, sidebar, cart) lives in `src/stores/`.
- Domain-specific client state lives in `src/features/<domain>/stores/`.
- Server state stays in TanStack Query. Never mirror server data in Zustand.

## Server Function Wiring

- `createServerFn` must be wired into `queryOptions()` or `mutationOptions()` inside `*.queries.ts` and `*.mutations.ts`.
- UI components and route files must import the hook/options, never the raw server function.
- Only `*.queries.ts` and `*.mutations.ts` files are allowed to import `createServerFn` handlers directly.

## Error Handling

- Server functions should throw `Error` for expected failures (validation, not-found).
- Never leak Prisma or DB internals to the client; always sanitize error messages.
- UI components catch via `try/catch` when calling server functions directly in event handlers.
- TanStack Query-owned data surfaces errors through `useQuery` / `useMutation` error states.
- Route loaders should use `errorComponent` on routes to catch loader failures.

## TanStack Query Standard

- Server is source of truth; TanStack Query is the client cache.
- Use `createServerFn` for all Prisma reads and writes.
- Use `useQuery` for reusable client data.
- Use `useMutation` for all writes.
- Use route loaders only for SSR/bootstrap and auth-gated initial data.
- Do not query Prisma directly inside route loaders.
- Keep query key factories and query options together in `*.queries.ts`.
- Use `queryClient.invalidateQueries()` for React Query-owned data.
- Use `router.invalidate()` only when route loaders own the data.
- Keep query client setup centralized in `src/integrations/tanstack-query/`.
- Set sane query defaults once in the query client.
- Keep route files thin; move data logic into `src/features/<domain>/`.

## Data Loading

Define query options in `*.queries.ts` using `queryOptions()`. Keep the query key and fetcher together so the same definition can be reused in route loaders and components.

- Use `queryClient.prefetchQuery(...)` in route loaders for SSR-critical or above-the-fold data.
- Use `useQuery(...)` in components with the same query options, whether the data was prefetched or not.
- If a screen does not need route-level prefetching, skip the loader and let the component fetch directly.
- Prefer explicit loading UI for `useQuery(...)`; do not require `Suspense` for the default path.
- Keep the component API stable. Prefetching should be an implementation detail, not a component rewrite.

## Route Boundaries

Use route boundaries for navigation-level loading and route-level failures, not as a replacement for component query states.

- Use `beforeLoad` for auth, redirects, and guard checks.
- Use `loader` for route-scoped prefetching only.
- Add `pendingComponent` when route transitions or loader work should show a page-level loading state.
- Use `errorComponent` for loader failures and retry with `router.invalidate()`.
- Use `notFound()` for missing resources and `notFoundComponent` on the root route for the app-wide 404.
- Use `loaderDeps` when loader data depends on search params or other derived route inputs.

### Example

```ts
// src/routes/orders.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ordersQueryOptions } from "@/features/orders/orders.queries";
import {
  RouteErrorBoundary,
  RoutePendingBoundary,
} from "@/components/route-boundaries";

export const Route = createFileRoute("/orders")({
  beforeLoad: ({ context }) => {
    if (!context.queryClient) throw redirect({ to: "/login" });
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(ordersQueryOptions);
  },
  pendingComponent: RoutePendingBoundary,
  errorComponent: RouteErrorBoundary,
  component: OrdersRoute,
});
```

### Example

```ts
// src/features/todos/todos.queries.ts
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

export const todosKeys = {
  all: ["todos"] as const,
};

const getTodos = createServerFn({ method: "GET" }).handler(async () => {
  return [{ id: 1, title: "Latte" }];
});

export const todosQueryOptions = queryOptions({
  queryKey: todosKeys.all,
  queryFn: () => getTodos(),
});
```

```ts
// src/routes/demo/todos.tsx
import { createFileRoute } from "@tanstack/react-router";
import { todosQueryOptions } from "@/features/todos/todos.queries";

export const Route = createFileRoute("/demo/todos")({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(todosQueryOptions);
  },
  component: TodosRoute,
});
```

```tsx
// src/routes/demo/todos.tsx
import { useQuery } from "@tanstack/react-query";
import { todosQueryOptions } from "@/features/todos/todos.queries";

function TodosRoute() {
  const { data, isLoading, error } = useQuery(todosQueryOptions);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load todos.</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

## Infinite Queries

Use `useInfiniteQuery(...)` for cursor-based or unbounded collections such as feeds, logs, or long lists.

- Keep infinite query definitions in `*.queries.ts` alongside the base query logic.
- Use `queryClient.prefetchInfiniteQuery(...)` in route loaders when the initial page must be ready on first render.
- Use normal `useQuery(...)` for finite lists and single-record detail views.
- Keep pagination or cursor state in the component or feature store, not in route loaders.
- Use infinite queries only when the data truly grows over time or needs page-by-page fetching.

### Example

```ts
// src/features/activity/activity.queries.ts
import { infiniteQueryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

export const activityKeys = {
  all: ["activity"] as const,
};

const getActivity = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data?: { cursor?: string | null } }) => {
    return {
      items: [{ id: 1, label: "Opened register" }],
      nextCursor: null as string | null,
    };
  },
);

export const activityInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: activityKeys.all,
  initialPageParam: null as string | null,
  queryFn: ({ pageParam }) => getActivity({ data: { cursor: pageParam } }),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

```ts
// src/routes/activity.tsx
import { createFileRoute } from "@tanstack/react-router";
import { activityInfiniteQueryOptions } from "@/features/activity/activity.queries";

export const Route = createFileRoute("/activity")({
  loader: async ({ context }) => {
    await context.queryClient.prefetchInfiniteQuery(
      activityInfiniteQueryOptions,
    );
  },
  component: ActivityRoute,
});
```

```tsx
// src/routes/activity.tsx
import { useInfiniteQuery } from "@tanstack/react-query";
import { activityInfiniteQueryOptions } from "@/features/activity/activity.queries";

function ActivityRoute() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(activityInfiniteQueryOptions);

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{item.label}</div>
      ))}
      <button
        disabled={!hasNextPage || isFetchingNextPage}
        onClick={() => fetchNextPage()}
      >
        Load more
      </button>
    </div>
  );
}
```

## Query Keys

Define query key factories/constants at the top of each `*.queries.ts`.

- Start with an `all` key and derive list/detail/entity keys from it.
- Reuse those same keys in mutations for targeted invalidation.
- Keep key shape stable and feature-local so invalidation stays predictable.
- Avoid ad hoc arrays scattered across components.

### Example

```ts
// src/features/auth/auth.queries.ts
export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export const authSessionQueryOptions = queryOptions({
  queryKey: authKeys.session(),
  queryFn: () => getSession(),
});
```

```ts
// src/features/auth/auth.mutations.ts
queryClient.invalidateQueries({ queryKey: authKeys.all });
```

## Mutation Conventions

Define mutation options in `*.mutations.ts` using `mutationOptions()`.

- Keep mutation config and server function wiring together in the feature mutation file.
- Consume the mutation options from hooks with `useMutation(...)`.
- Use the predefined query keys from `*.queries.ts` for targeted invalidation.
- Keep invalidation local to the affected feature and resource.
- Prefer returning updated server data when practical instead of broad refetches.
- Skip optimistic updates unless a feature clearly needs them.

### Example

```ts
// src/features/todos/todos.mutations.ts
import { mutationOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { queryClient } from "@/integrations/tanstack-query/root-provider";
import { todosKeys } from "./todos.queries";

const createTodo = createServerFn({ method: "POST" })
  .inputValidator((data: { title: string }) => data)
  .handler(async ({ data }) => data);

export const createTodoMutationOptions = mutationOptions({
  mutationFn: createTodo,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: todosKeys.all });
  },
});
```

```ts
// src/features/todos/use-create-todo.ts
import { useMutation } from "@tanstack/react-query";
import { createTodoMutationOptions } from "./todos.mutations";

export function useCreateTodo() {
  return useMutation(createTodoMutationOptions);
}
```

## File Layout

- `src/features/<domain>/server/` for Prisma and server-only logic.
- `src/features/<domain>/schemas/` for shared Zod schemas.
- `src/features/<domain>/<domain>.queries.ts` for query key factories/constants and `queryOptions()`.
- `src/features/<domain>/<domain>.mutations.ts` for mutation hooks.
- Route files should only compose UI and hook into query/mutation helpers.

## Mutation Rules

- Extract mutation config into `mutationOptions()` objects in `*.mutations.ts`.
- Mutation hooks should consume those options via `useMutation(options)`.
- Keep invalidation targeted to the affected resource.
- Prefer reconciliation with returned server data over broad refetches.
- Skip optimistic mutations for now unless a feature clearly needs them.

## TanStack Form Patterns

### Entry Point

```
import { useAppForm } from '@/integrations/tanstack-form'
```

- `useAppForm` is a typed wrapper around `useForm` with all field/form components pre-registered via `createFormHook`.
- Standard Schema validation (Zod 3.24+) is built in — pass schemas directly to `validators: { onChange: schema }`, no `validatorAdapter` needed.

### Usage

```tsx
const form = useAppForm({
  defaultValues: { name: "" },
  validators: { onChange: MyZodSchema },
  onSubmit: async ({ value }) => {
    // createServerFn call
  },
});

return (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}
  >
    <form.AppField name="name">
      {(field) => <field.Input label="Name" placeholder="Enter name" />}
    </form.AppField>
    <form.AppField name="role">
      {(field) => (
        <field.Select
          label="Role"
          options={[
            { value: "admin", label: "Admin" },
            { value: "user", label: "User" },
          ]}
        />
      )}
    </form.AppField>
    <form.AppField name="notify">
      {(field) => <field.Checkbox label="Send notifications" />}
    </form.AppField>
    <form.AppForm>
      <form.SubmitButton label="Save" />
    </form.AppForm>
  </form>
);
```

### Rules

- **Field components use `useFieldContext` internally** — no `field` prop, no `AnyFieldApi`.
- **Use `useFieldContext<string>()`** typed to the field's value type.
- **Each field component passes `id={field.name}`** and `aria-invalid` to the control.
- **Error display is automatic** — `FormField` reads `field.state.meta` via `useFieldContext` and renders `<FieldError>`.
- **Form-level components use `useFormContext`** — rendered inside `<form.AppForm>`.
- **shadcn primitives live in `src/components/ui/`** (framework-agnostic). Form-specific components live in `src/integrations/tanstack-form/components/`.

### File Layout

```
src/integrations/tanstack-form/
├── index.ts                            ← createFormHookContexts + createFormHook + exports
└── components/                         ← registered field and form components
```

## Commands

| Command                    | Purpose                                        |
| -------------------------- | ---------------------------------------------- |
| `npm run dev`              | Start dev server (port 3000)                   |
| `npm run build`            | Production build                               |
| `npm run test`             | Run Vitest tests                               |
| `npm run db:generate`      | Generate Prisma client                         |
| `npm run db:push`          | Push schema to DB                              |
| `npm run db:migrate`       | Run Prisma migrations                          |
| `npm run db:studio`        | Open Prisma Studio                             |
| `npm run db:seed`          | Seed database                                  |
| `npx auth@latest generate` | Regenerate Better Auth schema in schema.prisma |

## Known Gotchas

- **Import PrismaClient from generated path**, not `@prisma/client`: `import { PrismaClient } from '@/generated/prisma/client.js'`
- **Two connection strings required**: `DATABASE_URL` (pooled) for the app adapter, `DIRECT_URL` (direct) for `prisma.config.ts` (CLI commands)
- **Use `@prisma/adapter-neon`**, not `@prisma/adapter-pg` — Neon-optimized and bundles everything needed
- **Better Auth schema**: generate via `npx auth@latest generate --config src/integrations/better-auth/auth.ts -y`, **migrate** via `npx prisma migrate dev`
- **Route tree is auto-generated** — do not manually edit `routeTree.gen.ts`
- **Prisma v7 uses `prisma.config.ts`** instead of the old schema-based `url` in datasource
- **Better Auth experimental joins** enabled for 2-3x perf on session/org queries (big win on Neon cold starts)
- Before architectural or library-specific changes, load relevant TanStack Intent skill: `npx @tanstack/intent@latest load <package>#<skill>`
- Tailwind v4 — use `@import "tailwindcss"` not `@tailwind base/components/utilities`
- **TanStack Form v1 uses Standard Schema** — no `@tanstack/zod-form-adapter`. Pass Zod schemas directly to `validators: { onChange: schema }`.
