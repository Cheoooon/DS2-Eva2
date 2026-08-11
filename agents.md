# Agents

## Roles
- **scout**: Investigative tasks, codebase research.
- **builder**: Implementation tasks, code edits.
- **reviewer**: Code reviews, quality assurance.

## Rules of Engagement
- **Context First**: MUST read critical docs (`docs/architecture.md`, `docs/schema_design.md`) *before* acting in any session.
- **Communication Style**: MUST use `caveman` style: brief, technical, no filler.
- **Task Structure**: All tasks MUST include:
  - **Goal**: What are we accomplishing?
  - **Target Files**: Which files change?
  - **Change**: Step-by-step logic.
  - **Acceptance Criteria**: Observable result.
- **Safety**: NEVER run formatters, linters, or test suites until final verification.
- **Handoff**: After task completion, explicitly state what remains (if anything) and update `todo`.

## Technical Constraints (Knowledge Base)
- **Tailwind CSS v4**: Utiliza configuración simplificada (a menudo solo requiere importar `@import "tailwindcss";` en el CSS principal, sin `tailwind.config.js` complejo). Verificar siempre con `Context7` antes de realizar configuraciones de Tailwind.
