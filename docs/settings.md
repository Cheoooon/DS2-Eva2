# Configuración del Sistema: Gestión de Horarios

El sistema permite configurar dinámicamente los rangos horarios utilizados en la interfaz mediante el panel de administración (/admin/config).

## Rangos Configurables
Existen dos tipos de rangos que pueden definirse de forma independiente:

1. **Rango Visual (Dashboard)**:
   - Define el horario de inicio y fin mostrado en la grilla del `TimelineView`.
   - Permite visualizar desde bloques parciales hasta el día completo (00:00 - 24:00).
   - El slider del dashboard se ajusta automáticamente a este rango.

2. **Rango Funcional (Formulario de Reservas)**:
   - Define el horario de inicio y fin disponible para seleccionar al crear o editar una reserva.
   - Restringe las horas que el sistema considera válidas para las validaciones de disponibilidad.

## Cómo configurar
1. Acceder al menú **Config** (solo disponible para administradores).
2. Ajustar los valores numéricos correspondientes para **visualización** y **formulario**.
3. Guardar los cambios. El sistema actualizará dinámicamente el comportamiento del dashboard y las validaciones de nuevas reservas sin necesidad de reiniciar el servidor.
