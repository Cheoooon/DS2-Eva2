# Sabor Gourmet

Sistema de gestión de reservas para "Sabor Gourmet".

## Objetivo
Plataforma para gestionar reservas de mesas en tiempo real con control de acceso por roles (Client, Staff, Admin).

## Stack Tecnológico
- **Framework**: Next.js (App Router)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **DB (Desarrollo)**: SQLite
- **DB (Producción)**: PostgreSQL
- **Real-time**: Socket.io / Supabase Realtime

## Estructura Docs
Revisar carpeta `/Docs` para detalles técnicos:
- `architecture.md`: Diseño del sistema.
- `schema_design.md`: Modelos Prisma.
- `tech_specs.md`: Especificaciones técnicas.

## Instalación
1. `pnpm install`
2. `npx prisma db push` (Inicia entorno SQLite)
3. `pnpm dev`
