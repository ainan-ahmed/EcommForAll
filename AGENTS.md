# AGENTS

Purpose: Quick start for agentic coding in this repo.
Keep guidance short, actionable, and aligned with existing code.

## Custom Agents

Custom OpenCode agents for this project are defined in `.opencode/agents/`.

**Available agents:**
- **GitHub Manager Agent** (`@gh-bot`) - PR management and GitHub operations

See `docs/opencode/agents/README.md` for complete agent documentation and usage.

## Repo layout
- backend/: Spring Boot (Java 21, Maven, JPA, Spring Security, Spring AI)
- frontend/: React + Vite + TypeScript + Mantine + TanStack Router/Query
- scripts/seedEcommforall/: seed tooling and notes
- .github/workflows/: CI/CD workflows
  - maven.yml: backend build check (runs on PRs to dev/main)
  - frontend-format-check.yml: frontend formatting/linting (runs on PRs)
  - opencode.yml: OpenCode AI assistant integration

## Commands (run from repo root unless noted)

### Frontend (frontend/)
- Install: `cd frontend && npm install`
- Dev server: `cd frontend && npm run dev`
- Build (typecheck + bundle): `cd frontend && npm run build`
- Lint: `cd frontend && npm run lint`
- Format check: `cd frontend && npm run format:check`
- Format (auto-fix): `cd frontend && npm run format`
- Single test: no frontend test runner configured (no test script found)

### Backend (backend/)
- Maven wrapper (preferred): `./backend/mvnw -f backend/pom.xml <goal>`
- Build (no tests): `./backend/mvnw -f backend/pom.xml -DskipTests package`
- Build (with tests): `./backend/mvnw -f backend/pom.xml package`
- Run tests: `./backend/mvnw -f backend/pom.xml test`
- Run single test class: `./backend/mvnw -f backend/pom.xml -Dtest=BackendApplicationTests test`
- Run single test method: `./backend/mvnw -f backend/pom.xml -Dtest=BackendApplicationTests#contextLoads test`
- Run app: `./backend/mvnw -f backend/pom.xml spring-boot:run`
- CI parity (GitHub Actions): `mvn -B package --file backend/pom.xml`

## Code style and conventions

### General
- Indentation: 4 spaces (Java and TypeScript/TSX)
- Line endings: LF; keep files ASCII when possible
- Avoid unused imports/variables; keep files clean
- Do not edit generated files like `frontend/src/routeTree.gen.ts`
- Frontend formatting: Prettier is configured (see `frontend/.prettierrc`)
- Backend formatting: Follow existing style; no automated formatter
- For up to date documentation and code snippets use `context7` tools
- Cursor/Copilot rules: none found in `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md`

### TypeScript/React (frontend/src)
- Prefer function components and hooks (consistent with current codebase)
- Hooks naming: `useX` (e.g., `useCart`, `useProduct`)
- Component naming: PascalCase; file naming follows local folder patterns (some files are lower-case)
- Imports: group external packages first, then internal domain code, then relative; keep grouping consistent with file neighbors
- Strings: double quotes are the prevailing style in TS/TSX
- Types: strict TypeScript; avoid `any`; prefer domain types in `frontend/src/domains/*/types.ts`
- Validation: use Zod schemas in `frontend/src/domains/*/schemas/*`
- Data fetching: use TanStack Query hooks in `frontend/src/domains/*/hooks/*`
- API calls: keep in `frontend/src/domains/*/api/*`
- State: global auth state lives in `frontend/src/stores/authStore.ts`
- Routing: use TanStack Router file routes in `frontend/src/routes/*`
- UI: Mantine components and theming; keep layout consistent with existing components
- Errors: surface user-facing errors via `@mantine/notifications`
- Async flows: prefer `mutateAsync` + `try/catch` for optimistic UI and error reporting

### Java/Spring (backend/src)
- Packages: `com.ainan.ecommforallbackend.*` with domain-based folders
- Classes: PascalCase; methods/fields: lowerCamelCase
- DTOs: suffix `Dto`, `CreateDto`, `UpdateDto` as in existing packages
- Mappers: MapStruct-based, suffix `Mapper`
- Services: interface + `ServiceImpl` pattern
- Controllers: `@RestController` + `@RequestMapping`; return `ResponseEntity`
- Dependency injection: constructor injection via Lombok `@RequiredArgsConstructor`/`@AllArgsConstructor`
- Entities: JPA annotations; use `@Entity`, `@Table`, `@Id`, `@GeneratedValue`; keep fields private
- Transactions: annotate write operations with `@Transactional`
- Errors: throw `ResourceNotFoundException` for 404s; prefer domain-specific exceptions over raw `RuntimeException`
- Exception handling: centralized in `backend/src/main/java/com/ainan/ecommforallbackend/core/exception/GlobalExceptionHandler.java`
- Validation: use `@Valid` + validation annotations on DTOs; rely on global handler for `MethodArgumentNotValidException`
- Security: JWT-based; keep auth logic in `core/security` and avoid leaking sensitive error details
- Logging: use framework defaults; avoid `System.out.println`

## Formatting and naming details
- Java imports: avoid wildcard imports; keep import blocks stable in the file you edit
- TS imports: avoid deep relative paths when a nearby index or domain API exists
- Filenames: preserve existing case/style in a folder; avoid renames unless required
- Constants: use `UPPER_SNAKE_CASE` only for true constants (rare in current code)
- Boolean names: prefer `isX`, `hasX`, `canX` for clarity
- REST endpoints: use plural nouns and consistent path segments (see existing controllers)
- DTO fields: match JSON contract and keep naming consistent across frontend/backed types

## Error handling patterns
- Backend validation errors: return 400 with field-level errors (see `GlobalExceptionHandler`)
- Auth errors: return 401/403 as appropriate; avoid exposing credential details
- Frontend API errors: show notifications and keep error messages user-friendly

## Types and data flow hints
- Frontend schema -> type: derive types from Zod where possible for consistency
- Backend entity -> DTO: map via MapStruct; keep entities out of controller responses
- UUID: use `java.util.UUID` on backend; treat IDs as strings on frontend

## Frontend patterns and structure
- Domain modules live under `frontend/src/domains/<domain>`
- Keep UI components next to their domain when they are domain-specific
- Shared UI goes to `frontend/src/shared/components`
- Store selectors: use `useStore(authStore)` or dedicated hooks
- Mantine layout primitives (`Stack`, `Group`, `Paper`) are used heavily; follow existing patterns
- Inline style objects are common; keep them small and co-located with the component
- Prefer `useMemo` for derived values that depend on remote data
- Avoid side effects in render; use `useEffect` for async updates

## Backend patterns and structure
- Domain code: `backend/src/main/java/com/ainan/ecommforallbackend/domain/<domain>`
- Cross-cutting utilities and config: `backend/src/main/java/com/ainan/ecommforallbackend/core`
- Persistence: use Spring Data repositories; return `Page<T>` for pageable endpoints
- DTO mapping: MapStruct is configured; update mappers when DTOs change
- Avoid exposing entities directly from controllers
- Keep S3 and AI integrations behind service interfaces

## Useful references
- Backend config: `backend/src/main/resources/application.yml`
- Frontend scripts: `frontend/package.json`
- Backend Maven config: `backend/pom.xml`
- Lint config: `frontend/eslint.config.js`
- Prettier config: `frontend/.prettierrc`
- CI workflows:
  - Backend build: `.github/workflows/maven.yml`
  - Frontend format/lint: `.github/workflows/frontend-format-check.yml`
  - OpenCode integration: `.github/workflows/opencode.yml`

## When adding new code
- Match the structure inside the relevant domain folder before creating new ones
- Keep AI-related features under `backend/src/main/java/com/ainan/ecommforallbackend/domain/ai`
- Keep shared utilities under `backend/src/main/java/com/ainan/ecommforallbackend/core`
- Keep frontend domain logic under `frontend/src/domains/<domain>`
- Keep shared UI components under `frontend/src/shared/components`
- Update both frontend and backend DTO/types when API contracts change

## Testing notes
- JUnit 5 is in use; tests live under `backend/src/test/java`
- There is only a placeholder test class currently; add tests alongside new features
- No frontend tests configured; add a runner only if required by a task

## Formatting and linting notes
- Frontend: Prettier (formatting) + ESLint (linting) configured
  - Run `npm run format:check` to check formatting
  - Run `npm run format` to auto-fix formatting issues
  - Run `npm run lint` to check for linting issues
  - PR workflows will post inline comments for violations
- Backend: No automated formatter; follow existing code style
- ESLint is configured but minimal; do not introduce unused code or eslint-disable comments unless necessary
- TypeScript strict mode is on; keep types explicit at API boundaries

## Build notes
- Frontend `npm run build` runs `tsc -b` then `vite build`
- Backend uses Java 21 and Maven 3.9.x (see wrapper)

## Security and secrets
- Do not commit real credentials; prefer environment variables
- AI config is documented in `backend/AI_SERVICE_README.md`
- Example defaults in `application.yml` are for local dev only

## Environment notes
- Backend expects PostgreSQL with pgvector (see README for Docker compose)
- Default local DB in `application.yml` uses `jdbc:postgresql://localhost:5432/ecommforall`
- AI features need Vertex AI credentials (`GOOGLE_APPLICATION_CREDENTIALS`, `GCLOUD_PROJECT`)
- If AI is not configured, avoid touching AI endpoints or guard calls
- Frontend dev server defaults to Vite on port 5173
- Backend default port is 8080 (Spring Boot)
