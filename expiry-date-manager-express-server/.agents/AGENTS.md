# AGENTS.md - Express Server Rules & Guidelines

## Context Building Rule
Always perform the Context Building phase prior to writing code:
- Read and analyze `.agents/skills/skills.yaml` and `.agents/skills/instructions.md`.
- Understand project structure, tech stack, and conventions.
- Provide explicit context acknowledgment before starting implementation.

## Mandatory Architectural Guidelines
1. **Controller-Service-DAO Pattern**:
   - Routes MUST only map to Controllers.
   - Controllers handle HTTP validation (e.g. `express-validator`), parse params/body, call DAO/Services, and construct standard responses.
   - DAOs handle Mongoose models and database operations (`User.findOne`, `Product.find`, etc.).
2. **Authentication & Authorization**:
   - JWT tokens stored in HTTP-only cookies (`jwtToken`).
   - Standard roles: `ADMIN_ROLE`, user matching with `adminId`.
   - Protect routes using `authMiddleware.protect`.
3. **API Documentation**:
   - Always generate Swagger models/documentation for every newly added REST API endpoint.
4. **Approval**:
   - Always get approval before making changes.
