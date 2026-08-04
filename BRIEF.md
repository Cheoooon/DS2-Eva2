# Proyecto: Next.js + Prisma DB Migration Plan

## Objetivo
Implementar un sistema que inicie con SQLite (desarrollo local) y facilite la migración a PostgreSQL en producción, incorporando soporte para actualizaciones en tiempo real.

## Estrategia

### 1. Fase de Desarrollo (Actual)
- **Base de datos**: SQLite (via Prisma).
- **Enfoque**: Rapidez y simplicidad en desarrollo local.

### 2. Fase de Migración a Producción
- **Base de datos**: PostgreSQL.
- **Cambios requeridos**:
  - Actualizar `datasource` en `prisma/schema.prisma` (`provider = "postgresql"`).
  - Configurar `DATABASE_URL` con la cadena de conexión de Postgres.
  - Ejecutar `prisma migrate dev` (o `prisma db push`) para recrear el esquema.

### 3. Soporte en Tiempo Real
- **Opción A (Sugerida - Si se usa Supabase/Postgres)**: Usar *Supabase Realtime* (nativamente compatible con Postgres).
- **Opción B (Self-hosted)**: Socket.io integrado en un servidor Node.js independiente, usando `pg` `LISTEN/NOTIFY` para detectar cambios en la base de datos.
