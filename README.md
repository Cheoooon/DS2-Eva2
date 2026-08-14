# 🍽️ Sabor Gourmet

Sistema de gestión de reservas en tiempo real para "Sabor Gourmet".

## 🎯 Objetivo
Plataforma eficiente para la gestión de mesas con control de acceso granular por roles (`Staff`, `Admin`).

---

## 🛠️ Stack Tecnológico
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **DB**: PostgreSQL (Desarrollo: SQLite)

---

## 📚 Documentación
- `architecture.md`: Arquitectura y stack técnico.
- `schema_design.md`: Modelo de datos (Prisma).
- `user_stories.md`: Casos de uso y requerimientos.
- `workflow.md`: Flujos de trabajo y procesos.

---

## 🚀 Instalación y Ejecución

*Nota: Asegúrate de estar en la raíz del proyecto y tener las dependencias necesarias.*

1. **Entrar al directorio del proyecto:**
   ```bash
   cd next-app
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Configurar base de datos:**
   ```bash
   pnpm db:generate
   pnpm db:push
   pnpm db:seed
   ```
   *(El seed genera usuarios administrador y mesas de ejemplo).*

4. **Levantar el proyecto en desarrollo:**
   ```bash
   pnpm dev
   ```
