# Expiry Date Manager - Project Context Baseline

## 1. Executive Summary & Goals
The **Expiry Date Manager** application helps users track products, manage inventory expiration dates, receive alerts for items nearing expiry, and handle user authentication/authorization.

The codebase consists of two primary modules:
- **`expiry-date-manager-express-server`**: Node.js/Express REST backend powered by MongoDB.
- **`expiry-date-manager-react-client`**: React 19 SPA powered by Vite.

---

## 2. Technical Stack & Dependencies

### Backend Stack (`expiry-date-manager-express-server`)
- **Runtime**: Node.js (`v24.16.0`)
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ORM/ODM)
- **Authentication**: JWT (`jsonwebtoken`) stored in HTTP-only cookies (`jwtToken`), bcrypt for password hashing
- **Input Validation**: `express-validator`
- **Documentation**: OpenAPI / Swagger for all REST endpoints

### Frontend Stack (`expiry-date-manager-react-client`)
- **Library**: React `19.2.8`
- **Build Tool**: Vite `8.2.0`
- **Linter**: ESLint `10.8.0`

---

## 3. Core Architectural Patterns & Code Style

### A. Controller-Service-DAO (Repository) Pattern
1. **Routes (`src/routes/`)**: Map incoming HTTP endpoints directly to Controller functions.
2. **Controllers (`src/controllers/`)**: Parse requests, execute `express-validator` checks, invoke DAO/Service methods, manage cookies (`jwtToken`), and format JSON responses.
3. **DAOs (`src/dao/`)**: Perform database queries using Mongoose models (e.g. `User.findOne`, `Product.find`).
4. **Services (`src/services/`)**: Encapsulate reusable business logic.
5. **Models (`src/models/`)**: Define Mongoose schemas (`User`, `Product`, etc.).

### B. Authentication & Authorization Flow
- **Token Signing**: Payload includes `name`, `email`, `_id`, `role`, and `adminId`.
- **Role Fallback**: Ensures backward compatibility using `ADMIN_ROLE` default if `user.role` is unassigned.
- **Cookie Transport**:
  ```javascript
  response.cookie('jwtToken', token, {
    httpOnly: true,
    secure: true,
    domain: 'localhost',
    path: '/'
  });
  ```
- **Middleware Protection**: `authMiddleware.protect` extracts `request.cookies?.jwtToken`, verifies via `JWT_SECRET`, and attaches decoded user to `request.user`.

### C. Swagger Documentation Requirement
Every new REST API endpoint added to the backend MUST include corresponding Swagger / OpenAPI spec models and annotations.

---

## 4. Current Workspace State & Next Development Steps

### Existing Components:
- Backend configuration (`.agents/skills/skills.yaml`, `.agents/skills/instructions.md`, `package.json`).
- Frontend initial Vite + React structure (`src/App.jsx`, `main.jsx`, `vite.config.js`).

### Gaps to Initialize:
- Backend `server.js` entry point.
- Backend directory scaffolding: `src/config/`, `src/controllers/`, `src/dao/`, `src/models/`, `src/routes/`, `src/services/`, `src/utils/`, `src/middleware/`.
- Database connection helper (`src/config/db.js`).

---

## 5. Agent Instructions & Constraints
- Always obtain user approval before executing structural file changes or code modifications.
- Perform Context Building prior to writing new feature code.
- Generate walkthrough documentation in `.agents/` upon completing verified tasks.
