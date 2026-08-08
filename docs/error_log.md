# Registro de Errores y Dependencias

## Error: Conflicto de Puerto y Configuración Tailwind
- **Problema**: `next dev` falla al iniciarse debido a un conflicto de puerto (proceso previo activo) y posiblemente una configuración incorrecta de Tailwind CSS (se usó `init` estándar con Tailwind v4).
- **Causa**: Tailwind v4 tiene una configuración distinta (autonómica) que difiere de la v3.
- **Resolución**:
    1. Asegurar limpieza de procesos (`taskkill`).
    2. Verificar configuración de Tailwind v4 en Next.js usando Context7.
    3. Documentar en `AGENTS.md` para evitar futuros conflictos.

## Dependencias Clave (Contexto)
- Tailwind CSS: v4.3.3
- Next.js: v16.2.9
- Turbopack: Habilitado
