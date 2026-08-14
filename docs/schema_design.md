# Modelo de Datos (Schema)

## Entidades Principales

### User
Representa a los usuarios del sistema.
- `role`: `ADMIN`, `STAFF`, `CLIENT`.

### Table
Representa la infraestructura del restaurante.
- `capacity`: Capacidad de comensales.
- `active`: Estado de la mesa.

### Reservation
El núcleo del sistema.
- `date`: `DD-MM-YYYY`.
- `startHour`, `endHour`: Horario.
- `status`: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `MOVED`.
- `table`: Relación con la mesa asignada.

### SystemConfig
Configuración global del sistema.

*(Nota: Referirse siempre a `next-app/prisma/schema.prisma` para la estructura exacta).*
