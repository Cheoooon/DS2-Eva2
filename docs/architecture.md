# Arquitectura del Sistema: Sabor Gourmet

## Descripción General
Sistema de gestión integral para restaurante, enfocado en el manejo de mesas y reservas, con control de acceso basado en roles (RBAC).

## Stack Tecnológico
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Base de Datos**: SQLite (Dev) / PostgreSQL (Prod) gestionado por [Prisma ORM](https://www.prisma.io/)
- **Autenticación**: [NextAuth.js](https://next-auth.js.org/) (Auth.js v5)
- **UI**: React, Tailwind CSS, Radix UI.

## Estructura de Capas
1. **Frontend (App Router)**: Interfaz de usuario (Staff/Admin).
2. **Backend (Server Actions/API Routes)**: Lógica de negocio, validaciones.
3. **ORM (Prisma)**: Interacción con la base de datos.
4. **Auth Layer**: Middleware de protección de rutas mediante roles definidos en la sesión.
