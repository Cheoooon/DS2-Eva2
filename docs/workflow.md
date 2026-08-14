# Flujo de Trabajo (Workflow)

## Flujo de Reserva
1. **Verificación de disponibilidad**: Se consulta la base de datos buscando colisiones en el horario solicitado para la mesa específica.
2. **Creación**: Se crea el registro `Reservation` con estado `PENDING`.
3. **Actualización**: El estado se actualiza según avance el día (`IN_PROGRESS` -> `COMPLETED`).

## Flujo de Auth
1. El usuario inicia sesión mediante `NextAuth`.
2. El `middleware` protege las rutas `/admin` y `/staff` verificando el rol del usuario en la sesión.
