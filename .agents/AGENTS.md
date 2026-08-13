# AGENTS.md - Workspace Rules & Operating Instructions

## Context Building Mandate
Whenever starting to work from scratch or initiating a new development phase, the AI agent **MUST** start with the **Context Building** protocol before writing code:

1. **Skills & Instructions Audit**:
   - Thoroughly read and analyze `.agents/skills/skills.yaml` and `.agents/skills/instructions.md`.
   - Internalize all domain concepts, tech stack versions, architectural patterns (Controller-Service-DAO/Repository), route handlers, middleware contracts, and style rules.

2. **Workspace & Environment Discovery**:
   - Inspect existing directory structures, configuration files (`package.json`, `vite.config.js`, etc.), and environment setups across all modules (server and client).

3. **Context Acknowledgment & Synthesis**:
   - Document synthesized context in `ai/project_context.md`.
   - Provide a concise summary and explicit acknowledgment to the user that the context and coding standards are fully understood and ready for implementation.

## Workflow Rules
- **Controller-Service-Repository (DAO) Pattern**: Enforce strict separation of concerns for Express backend code.
- **API Swagger Documentation**: Include OpenAPI / Swagger annotations or models for every newly added REST API endpoint.
- **Approval Before Execution**: Always obtain user approval before executing file changes or code modifications.
- **Task Closure**: Upon completing and verifying a task, produce a walkthrough artifact documenting all changes made and test results.
