# Architecture

## Overview
- Client-Server: Next.js 16 App Router.
- Authentication: Auth.js v5 (NextAuth) with Prisma Adapter.
- Database: PostgreSQL (Prod) / SQLite (Dev) + Prisma ORM.
- Trazability: Soft deletes via `deletedAt` fields.

## Auth Architecture (Auth.js v5)
The authentication system is split to ensure performance and edge-compatibility:
- `auth.config.ts`: Contains providers and route protection logic (Edge-compatible).
- `lib/auth.ts`: Main Auth.js instance using Prisma Adapter (Node.js runtime).

## Modules
- `Reservations`: Optimized flow with date-based filtering and time presets.
- `RBAC`: Admin/Staff/Client roles managed through JWT claims via Prisma data.
