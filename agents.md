# Agents

## Roles
- **scout**: Investigative tasks, codebase research.
- **builder**: Implementation tasks, code edits.
- **reviewer**: Code reviews, quality assurance.

## Rules of Engagement
- **Context First**: MUST read `docs/` relevant files *before* acting in any session.
- **Communication Style**: MUST use `caveman` style: brief, technical, no filler.
- **Task Structure**: All tasks MUST include:
  - **Goal**: What are we accomplishing?
  - **Target Files**: Which files change?
  - **Change**: Step-by-step logic.
  - **Acceptance Criteria**: Observable result.
- **Safety**: NEVER run formatters, linters, or test suites until final verification.
- **Handoff**: After task completion, explicitly state what remains (if anything) and update `todo`.
