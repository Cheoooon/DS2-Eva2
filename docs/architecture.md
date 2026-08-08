# Architecture

## Overview
- Client-Server: Next.js App Router (RBAC, NextAuth).
- Database: PostgreSQL/SQLite + Prisma (Prisma-LibSQL adapter).
- Real-time: Turbopack for development.
- Trazability: Soft deletes via `deletedAt` fields.

## Modules
- `Reservations`: Optimized flow with date-based filtering and time presets.

- Database: PostgreSQL + Prisma.
- Real-time: Socket.io/Supabase Realtime.
- Trazability: State-based updates (no deletes).
