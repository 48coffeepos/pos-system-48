# 48-coffee-pos

A Point of Sale (POS) client built with TanStack Start.

## Stack

- [TanStack Start](https://tanstack.com/start) (React, file-based routing)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Better Auth](https://www.better-auth.com/) + [Prisma](https://www.prisma.io/) (PostgreSQL via Neon)
- [TanStack Query](https://tanstack.com/query) & [TanStack Table](https://tanstack.com/table)
- [TanStack Form](https://tanstack.com/form) (Zod validation)
- [Zustand](https://github.com/pmndrs/zustand) (client state)

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables in `.env.local`:
   ```env
   BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_SECRET=<generate via `npx -y @better-auth/cli secret`>
   DATABASE_URL=<neon-pooled-url>
   DIRECT_URL=<neon-direct-url>
   ```
3. Generate Prisma client and push schema:
   ```bash
   npm run db:generate
   npm run db:push
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/routes/` — Application routes (thin, compose features).
- `src/features/<domain>/` — Domain modules (components, hooks, server logic, queries, mutations, schemas).
- `src/integrations/` — Global configuration (Prisma, Better Auth, Query, Form).
- `src/components/ui/` — Reusable UI primitives (shadcn).
- `src/stores/` — Global client state (Zustand).

## Conventions

- **Imports:** Use `@/` for everything under `src/` (e.g., `@/integrations/prisma/db`).
- **Server Functions:** Never call `createServerFn` directly from UI. Wire them into `*.queries.ts` or `*.mutations.ts` first.
- **Data Access:** Always use the shared Prisma client from `@/integrations/prisma/db`.
- **Forms:** Use `useAppForm` from `@/integrations/tanstack-form` with Zod schemas.
- **Tables:** Compose the generic `DataTable` primitive from `@/components/ui/data-table` for TanStack Table features.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run test` | Run Vitest tests |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to DB |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database |

## Architecture & Conventions

For detailed architecture decisions, file layout rules, and mutation/query patterns, see [`AGENTS.md`](./AGENTS.md).
