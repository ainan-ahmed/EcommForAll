# Pydantic-AI Integration Guide

This guide documents how to migrate existing Spring AI-based endpoints to a Pydantic-AI powered service while preserving endpoint contracts and DTOs.

The approach assumes you will host a lightweight Python microservice (FastAPI + pydantic-ai) responsible for LLM calls, embeddings, and chat memory, while the Java service remains the API gateway and business logic layer.

## Goals

- Keep Java REST endpoints and DTO contracts unchanged
- Replace Spring AI calls with HTTP calls to a Python service using pydantic-ai
- Preserve conversation memory and vector search capabilities
- Provide clear Entities/DTOs for each endpoint on both Java and Python sides

## Architecture Overview

- Java (Spring Boot) remains the REST API serving clients
  - Controllers: `AiController`, `ChatbotController`
  - Services: thin proxies delegating to Python service
  - Security, auth, pagination, domain services remain in Java
- Python (FastAPI + pydantic-ai)
  - Endpoints:
    - POST `/ai/generate-description`
    - GET `/ai/health`
    - GET `/ai/similar-products/{product_id}`
    - POST `/chatbot/chat`
    - GET `/chatbot/chat` (history)
    - DELETE `/chatbot/chat/{conversation_id}`
  - Embedding/vector store: use your preferred provider (Ollama, OpenAI, pgvector, Chroma, LanceDB)
  - Memory: in-memory or Redis/DB-backed depending on scale

## Java ↔ Python Contracts

To keep backward compatibility, the Python service should implement JSON schemas that mirror the Java DTOs. See `docs/pydantic_ai_models.py` for canonical Pydantic models.

- Product Description
  - Request: `ProductDescriptionRequest`
  - Response: `ProductDescriptionResponse`
- Similar Products
  - Response: `SimilarProductsResponse`
- Chatbot
  - Request: `ChatRequest`
  - Response: `ChatResponse`
  - History Response: `ChatHistoryResponse` with `ChatHistoryMessage`

## Java Changes (minimal)

1. Create a new `AiGatewayClient` (Spring `@Component`) that calls the Python service

- Methods:
  - `generateDescription(ProductDescriptionRequestDto req, UUID productId): ProductDescriptionResponseDto`
  - `findSimilarProducts(UUID productId, int limit): SimilarProductsResponseDto`
  - `chat(ChatRequestDto req): ChatResponseDto`
  - `getHistory(UUID conversationId): ChatHistoryResponseDto`
  - `clearConversation(String conversationId): void`
  - `isHealthy(): boolean`

1. Update existing services to delegate to the gateway client

- `AiService.generateProductDescription` → call Python `/ai/generate-description`
  - If `productId` provided, Java can still enrich request with product data before forwarding (optional)
- `AiService.findSimilarProducts` → call Python `/ai/similar-products/{id}?limit=`
- `AiService.isServiceHealthy` → call Python `/ai/health`
- `ChatbotService.processMessage` → call Python `/chatbot/chat`
- `ChatbotController` GET history/DELETE clear → call Python `/chatbot/*`

1. Keep DTOs unchanged in Java

- Reuse existing DTOs in controllers; map 1:1 with Python Pydantic models via Jackson

1. Configuration

- Add `pydantic.ai.base-url` to `application.yml`
- Inject via `@Value` and configure `RestClient`/`WebClient`

## Machine-readable DTO contracts for the AI backend

- The Java service now exposes `/api/ai/contracts/schemas` (admin-only) which returns JSON Schemas for all AI-facing DTOs including Bean Validation rules.
- The Python `ai-backend` can fetch this endpoint at startup to generate Pydantic models automatically, avoiding hand-written duplicates. Cache the response and refresh on deploys.

## Python Service Skeleton (FastAPI)

Key technologies:

- FastAPI for HTTP
- pydantic for models (matching Java DTOs)
- pydantic-ai or LiteLLM for LLM calls
- Vector DB adapter (e.g., Chroma/pgvector) for similarity search
- Optional Redis for chat memory

Directory:

- `backend/docs/pydantic_ai_models.py` – DTO models shared as reference
- separate Python repo/service implements these models

Example outline (pseudo):

- POST `/ai/generate-description` → build prompt, call LLM, return ProductDescriptionResponse
- GET `/ai/similar-products/{product_id}` → embed and search products; or request Java for source product and product graph (hybrid)
- POST `/chatbot/chat` → update memory, call LLM with tools, return ChatResponse
- GET `/chatbot/chat` → return memory transcript using ChatHistoryResponse
- DELETE `/chatbot/chat/{conversation_id}` → clear memory

## Entities/DTOs needed per endpoint

- Generate Description
  - Request: `ProductDescriptionRequest`
  - Response: `ProductDescriptionResponse`
  - Uses `ProductVariant` subset from `ProductDto` when present
- Similar Products
  - Response: `SimilarProductsResponse`
  - Contains `Product` summaries (align with Java `ProductDto` fields you return today)
- Chatbot
  - Request: `ChatRequest`
  - Response: `ChatResponse`
  - History: `ChatHistoryResponse` and `ChatHistoryMessage`

See exact field definitions in `pydantic_ai_models.py`.

### Contract fetch + codegen (Python side)

Assuming the Java backend exposes `/api/ai/contracts/schemas` (admin/internal), you can pull schemas and generate Pydantic models:

```bash
pip install .[contracts]
AI_CONTRACTS_URL=http://localhost:8080/api/ai/contracts/schemas \
AI_CONTRACTS_TOKEN=YOUR_ADMIN_TOKEN \
python scripts/fetch_contracts.py
```

This writes `generated/ai_schemas.json` and generates `app/models/generated_ai.py`. Import generated models in your FastAPI routes to stay in sync with Java contracts.

## Tooling/Function Calling in Python

Replicate `ChatbotTools` using FastAPI-decorated functions or an agent framework:

- search_products(query: str, max_price: float | None, limit: int)
- get_product_details(product_id: UUID)
- get_featured_products()
- get_products_by_category(category_id: UUID)
- compare_products(product_id_1: UUID, product_id_2: UUID)

These can call back to the Java service over internal endpoints to retrieve product data.

## Migration Steps

1. Stand up Python service with the endpoints and models
2. Add `AiGatewayClient` in Java, wire base URL
3. Switch `AiService`/`ChatbotService` calls from Spring AI to gateway calls
4. Verify with existing integration tests and Swagger
5. Decommission Spring AI configs (`ChatbotConfig`, advisors) once stable

## Health/Observability

- Expose `/ai/health` from Python service; Java `AiService.isServiceHealthy()` proxies it
- Add basic metrics and logs (request id, conversation id, latency)

## Security

- Internal comms between Java and Python can use an internal network or shared key
- Java remains the front door enforcing JWT roles; Python trusts Java or validates a shared token

## Notes

- If you use VectorStore in Java today, you can:
  - Keep Java-based vector search (current) and only move LLM to Python
  - Or move embeddings/search to Python; then Java `AiService.findSimilarProducts` just proxies
- Start with LLM in Python; move vector search later if needed
