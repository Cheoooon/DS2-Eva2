# Sabor Gourmet

Sistema de gestión de reservas para "Sabor Gourmet".

## Objetivo
Plataforma para gestionar reservas de mesas en tiempo real con control de acceso por roles (Client, Staff, Admin).

## Stack Tecnológico
- **Framework**: Next.js (App Router)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **DB**: PostgreSQL (Desarrollo: SQLite)

## Docs
Revisar carpeta `/docs` para detalles técnicos:
- `architecture.md`: Diseño del sistema.
- `schema_design.md`: Modelos Prisma.
- `settings.md`: Reglas de negocio y notificaciones.
- `api_design.md`: Endpoints y contratos.
- `use_cases.md`: Casos de uso.

## Instalación (Proyecto ubicado en /next-app)
1. `cd next-app`
2. `pnpm install`
3. `npx prisma db push`
4. `pnpm dev`
