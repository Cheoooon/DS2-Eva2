# Agent Constraints: Sabor Gourmet

Instrucciones críticas para operar en este codebase.

## Convenciones de Código
- **Soft Deletes**: Todas las entidades (`User`, `Table`, `Reservation`) utilizan `deletedAt`. NUNCA realices `prisma.model.delete()`. SIEMPRE utiliza:
  ```ts
  prisma.model.update({ where: { id }, data: { deletedAt: new Date() } })
  ```
- **Rutas y Auth**:
  - Rutas bajo `next-app/src/app`.
  - Rutas `/admin/*` y `/staff/*` protegidas por `middleware` (validación de sesión y roles).
  - Auth: Usar `auth()` de NextAuth v5 en Server Actions para obtener sesión/rol.
- **UI/Componentes**:
  - Ubicación: `next-app/src/components/ui`.
  - Estilos: Tailwind CSS.
  - Prefiere componentes existentes antes de crear nuevos.

## Reglas de Negocio y Lógica
- **Validación de Reservas**: Antes de `create` o `update`:
  1. Verificar disponibilidad de mesa (`capacity` >= `occupants`).
  2. Verificar colisiones horarias (`startHour`, `endHour`) en la misma mesa y fecha.
  3. Validar `status` según flujo: `PENDING` -> `IN_PROGRESS` -> `COMPLETED`/`CANCELLED`.
- **SystemConfig**: La configuración global (ventanas de cancelación, retención) debe consultarse desde `SystemConfig` en la DB, no hardcodear valores.
- **Roles**:
  - `ADMIN`: Acceso total.
  - `STAFF`: Acceso operativo (Reservas, mesas).
  - `CLIENT`: Acceso a visualización (o solo lectura).

## Flujo de Trabajo del Agente
1. **Antes de editar**: Leer `docs/schema_design.md` y `docs/workflow.md`.
2. **Contexto**: Si se solicita cambio en reservas, revisar `next-app/prisma/schema.prisma` para impactos en cascada.
3. **Validación**: Cualquier cambio en lógica de reserva requiere smoke test manual: crear/editar/cancelar reserva y verificar cambios en `dev.db`.
