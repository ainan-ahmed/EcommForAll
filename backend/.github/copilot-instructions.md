# Copilot instructions for this repo

## Project overview

- Spring Boot 3.4 (Java 21) monolith with domain-based packages under `src/main/java/com/ainan/ecommforallbackend/domain/*`.
- Each domain (product, order, auth, etc.) typically follows `controller/`, `dto/`, `entity/`, `mapper/`, `repository/`, `service/` structure.
- JPA + PostgreSQL is the primary persistence layer; specifications drive filtering logic (see `core/specification/ProductSpecification`).

## Key architecture patterns

- REST controllers are thin; business logic lives in services (e.g., `domain/product/service/ProductServiceImpl`).
- DTO/entity mapping is done with MapStruct mappers in `domain/*/mapper` (e.g., `ProductMapper`, `UserMapper`). Update mappers when adding new DTO/entity fields.
- `@EnableJpaRepositories` is scoped to `com.ainan.ecommforallbackend.domain.*.repository` in `BackendApplication`.

## Security/auth

- JWT authentication is enforced via `core/security/JwtAuthenticationFilter` and `core/config/SecurityConfig`.
- Roles are modeled as `ROLE_*` strings; check role gates in `SecurityConfig` and method-level `@PreAuthorize` annotations.
- Public endpoints include `/api/auth/**` and read-only GET endpoints for products, categories, brands, and images.

## AI/Vector search subsystem

- Spring AI with Vertex AI Gemini + pgvector (see `application.yml` under `spring.ai.*`).
- `AiService` handles product description generation and similarity search using `VectorStore`.
- Chatbot tools are exposed via `@Tool` methods in `domain/ai/service/ChatbotTools`; prompts live in `core/util/PromptTemplates`.

## AI agents architecture

- Use an agent-based pattern under `domain/ai/agent/` with a shared `BaseAgent` and an `AgentFactory` for creation.
- Keep controllers thin: build an `AgentRequest`, call `agent.execute(...)`, then map to response DTOs.
- Keep agent-specific logic inside agent classes (prompting, pre/post-processing, tool wiring). Avoid duplicating AI logic in services or controllers.
- When adding new agent capabilities, also add or reuse tools under a dedicated `domain/ai/tool/` package rather than stuffing everything in a single tools class.
- Prefer data flow: DTO -> AgentRequest -> AgentResponse -> DTO. Avoid leaking domain entities into agent outputs.
- Prompt templates live in `core/util/PromptTemplates`; keep agent system prompts short and task-specific.

## External integrations

- AWS S3 is used for image uploads (`core/config/AmazonS3Config`, `domain/product/service/S3ServiceImpl`).
- S3 bucket/region are configured via `application.yml`; credentials come from env (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) or default provider chain.

## Local dev workflows

- Run: `./mvnw spring-boot:run`
- Test: `./mvnw test`
- Package: `./mvnw package`
- Default DB: PostgreSQL on `jdbc:postgresql://localhost:5433/ecommforall` (see `application.yml`); `spring.jpa.hibernate.ddl-auto=update`.
- Docker build uses `Dockerfile` and expects `.env.ai`, `.env.aws`, and `ecommforall-ai-key.json` present in the build context.
