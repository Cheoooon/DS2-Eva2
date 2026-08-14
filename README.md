# 🍽️ Sabor Gourmet

Sistema de gestión de reservas en tiempo real para "Sabor Gourmet".

## 🎯 Objetivo
Plataforma eficiente para la gestión de mesas con control de acceso granular por roles (`Client`, `Staff`, `Admin`).

---

## 🛠️ Stack Tecnológico
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **DB**: PostgreSQL (Desarrollo: SQLite)

---

## 📚 Documentación
Revisar la carpeta `/docs` para detalles técnicos:
- `architecture.md`: Diseño del sistema.
- `schema_design.md`: Modelos Prisma.
- `settings.md`: Reglas de negocio y notificaciones.
- `api_design.md`: Endpoints y contratos.
- `use_cases.md`: Casos de uso.

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
