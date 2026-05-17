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

## Repo Conventions

- Organize code by domain/feature first, not by technical layer alone.
- Each feature should own its own `components/`, `hooks/`, `server/`, `schemas/`, `queries/`, and `mutations/` as needed.
- Keep feature logic colocated inside `src/features/<domain>/`.
- Keep route files thin; they should compose feature modules, not contain business logic.
- Use `@/` imports for app code under `src/`.
- Use the shared Prisma client from `@/integrations/prisma/db` as the single database entry point.
- Keep Prisma access out of route components and UI components.
- Shared UI primitives belong in `src/components/ui/` only when they are truly app-wide.
- Do not manually edit `routeTree.gen.ts`.

## TanStack Query Standard

- Server is source of truth; TanStack Query is the client cache.
- Use `createServerFn` for all Prisma reads and writes.
- Use `useQuery` for reusable client data.
- Use `useMutation` for all writes.
- Use route loaders only for SSR/bootstrap and auth-gated initial data.
- Do not query Prisma directly inside route loaders.
- Keep query keys and query options together in `*.queries.ts`.
- Use `queryClient.invalidateQueries()` for React Query-owned data.
- Use `router.invalidate()` only when route loaders own the data.
- Keep query client setup centralized in `src/integrations/tanstack-query/`.
- Set sane query defaults once in the query client.
- Keep route files thin; move data logic into `src/features/<domain>/`.

## File Layout

- `src/features/<domain>/server/` for Prisma and server-only logic.
- `src/features/<domain>/schemas/` for shared Zod schemas.
- `src/features/<domain>/<domain>.queries.ts` for query keys and `queryOptions()`.
- `src/features/<domain>/<domain>.mutations.ts` for mutation hooks.
- Route files should only compose UI and hook into query/mutation helpers.

## Mutation Rules

- Every mutation should have a `mutationKey`.
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

```
const form = useAppForm({
  defaultValues: { name: '' },
  validators: { onChange: MyZodSchema },
  onSubmit: async ({ value }) => {
    // createServerFn call
  },
})

return (
  <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
    <form.AppField name="name">
      {(field) => <field.Input label="Name" placeholder="Enter name" />}
    </form.AppField>
    <form.AppField name="role">
      {(field) => <field.Select label="Role" options={[
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
      ]} />}
    </form.AppField>
    <form.AppField name="notify">
      {(field) => <field.Checkbox label="Send notifications" />}
    </form.AppField>
    <form.AppForm>
      <form.SubmitButton label="Save" />
    </form.AppForm>
  </form>
)
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

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run test` | Run Vitest tests |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to DB |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database |
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
