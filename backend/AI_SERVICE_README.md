# AI Service Documentation

## Overview

The AI domain provides:
- Conversational chatbot with memory and tool-assisted product actions.
- Product description generation for sellers/admins.
- Similar product recommendations via vector search.
- Admin-only embedding synchronization for products.

This module is built on Spring AI with Vertex AI (Gemini for chat, text-embedding-005 for embeddings) and pgvector for similarity search.

## Configuration

AI configuration lives in `backend/src/main/resources/application.yml`:

```yaml
spring:
    ai:
        vectorstore:
            pgvector:
                initialize-schema: true
                index-type: HNSW
                distance-type: COSINE_DISTANCE
                dimensions: 768
        vertex:
            ai:
                gemini:
                    project-id: ${GCLOUD_PROJECT:ecommforall-ai}
                    location: europe-west1
                    chat:
                        options:
                            model: gemini-3-flash
                            temperature: 0.7
                embedding:
                    project-id: ${GCLOUD_PROJECT:ecommforall-ai}
                    location: europe-west1
                    text:
                        options:
                            model: text-embedding-005
    chat:
        memory:
            repository:
                jdbc:
                    initialize-schema: always
                    platform: postgresql
chatbot:
    max-messages: 20
    enable-tools: true
    session-timeout-hours: 24
```

Required environment variables:

```bash
GOOGLE_APPLICATION_CREDENTIALS=./ecommforall-ai-key.json
GCLOUD_PROJECT=your-project-id
```

## APIs

Base paths:
- Chatbot: `/api/chatbot`
- AI services: `/api/ai`
- Admin embeddings: `/api/admin`

### Chatbot APIs (`/api/chatbot`)

Auth: requires `USER` or `ADMIN` role for all chatbot endpoints.

#### POST `/api/chatbot/chat`
Send a chat message.

Request: `ChatRequestDto`

```json
{
  "message": "Show me wireless headphones under $100",
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "context": "optional",
  "userAgent": "optional",
  "ipAddress": "optional",
  "timestamp": "2025-07-01T14:30:00"
}
```

Notes:
- `message` is required (`@NotBlank`, 1-255 chars).
- If authenticated, the controller defaults `conversationId` to the user ID.
- If anonymous and no conversationId, a new UUID is generated.
- If timestamp is missing, server sets it to now.

Response: `ChatResponseDto`

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Here are some options...",
  "intent": "PRODUCT_SEARCH",
  "requiresAction": true,
  "actionType": "SHOW_PRODUCTS",
  "timestamp": "2025-07-01T14:30:02",
  "success": true,
  "errorMessage": null
}
```

Errors:
- The controller catches errors and still returns HTTP 200 with `success=false` and `intent="ERROR"`.

#### GET `/api/chatbot/chat?conversationId=...`
Fetch chat history.

Response: `ChatHistoryResponseDto`

```json
{
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "messages": [
    {
      "sender": "user",
      "content": "Find me a laptop",
      "timestamp": "2025-07-01T14:29:00Z"
    },
    {
      "sender": "assistant",
      "content": "Here are some options...",
      "timestamp": "2025-07-01T14:29:05Z"
    }
  ],
  "retrievedAt": "2025-07-01T14:30:00Z",
  "totalMessages": 2
}
```

Notes:
- If authenticated and `conversationId` is omitted, it defaults to the user ID.
- If unauthenticated and no `conversationId`, returns 400.

#### DELETE `/api/chatbot/chat/{conversationId}`
Clears conversation memory for the given conversation ID.

#### GET `/api/chatbot/health`
Simple health check string for the chatbot service.

### AI APIs (`/api/ai`)

#### POST `/api/ai/generate-description`
Generate or improve product descriptions.

Auth: requires `SELLER` or `ADMIN` role.

Request: `ProductDescriptionRequestDto`

```json
{
  "productName": "Gaming Mechanical Keyboard",
  "category": "Electronics",
  "brand": "GameTech",
  "existingDescription": "Optional existing description",
  "attributes": {
    "Switch Type": "Blue Mechanical",
    "Backlighting": "RGB"
  },
  "targetAudience": "Gamers",
  "hasVariants": true,
  "variants": [
    {
      "attributeValues": { "Color": "Black" },
      "price": 99.99,
      "stock": 10
    }
  ],
  "tone": "technical",
  "maxLength": 200
}
```

Optional query param: `productId` (UUID). If provided, the service enriches fields from the stored product details.

Response: `ProductDescriptionResponseDto`

```json
{
  "generatedDescription": "Experience premium audio quality...",
  "originalDescription": "Optional existing description",
  "wordCount": 142,
  "tone": "technical",
  "generatedAt": "2025-07-01T14:30:00",
  "success": true,
  "errorMessage": null
}
```

Errors:
- Returns HTTP 400 when `success=false`.

#### GET `/api/ai/similar-products/{productId}?limit=5`
Find similar products using vector similarity.

Response: `SimilarProductsResponseDto`

```json
{
  "success": true,
  "message": "Similar products retrieved successfully",
  "sourceProductId": "550e8400-e29b-41d4-a716-446655440000",
  "sourceProductName": "Gaming Mechanical Keyboard",
  "similarProducts": [
    { "id": "...", "name": "..." }
  ],
  "totalFound": 5
}
```

Notes:
- `limit` defaults to 5 and is constrained to 1..20.
- Returns 400 when `success=false`.

#### GET `/api/ai/health`
Health check that verifies the chat client is reachable.

### Admin embedding API (`/api/admin`)

#### POST `/api/admin/sync-embeddings`
Admin-only endpoint to (re)index all products into the vector store.

Response: `EmbeddingSyncResponseDto`

```json
{
  "totalProducts": 120,
  "indexed": 118,
  "skipped": 1,
  "failed": 1
}
```

## Chatbot Tools and Memory

Chatbot uses Spring AI tools and memory:

- Tools live in `ChatbotTools` and expose:
  - searchProducts(query, maxPrice, limit)
  - getProductDetails(productId)
  - getFeaturedProducts()
  - getProductsByCategory(categoryId)
  - compareProducts(productIds)
- Tools are enabled in `ChatbotConfig` and used via function calling.
- Memory is backed by JDBC (`JdbcChatMemoryRepository`) with a window size from `chatbot.max-messages`.
- When available, `QuestionAnswerAdvisor` uses the vector store for retrieval-augmented responses.

## Agent Architecture

AI workflows use a small agent framework:
- `BaseAgent` defines validate/setup/build/call/post-process flow.
- `AgentFactory` creates `ChatbotAgent` and `ProductDescriptionAgent`.
- `AgentRequest` and `AgentResponse` wrap structured inputs/outputs.

## Error Handling

- Validation errors are handled centrally in `GlobalExceptionHandler` (400 with field-level errors).
- Chatbot POST returns HTTP 200 with `success=false` on failures and a friendly error message.
- AI description and similar-product endpoints return HTTP 400 when `success=false`.
- Health endpoints return 503 when unhealthy.

## Security

- Chatbot endpoints: `USER` or `ADMIN` roles required.
- Generate description endpoint: `SELLER` or `ADMIN` roles required.
- Embedding sync: `ADMIN` only.
- Similar-products and AI health endpoints have no explicit role guard in the controller.

## Implementation Notes

- Embeddings are stored in pgvector; `ProductEmbeddingService` builds rich product text and indexes documents.
- Similar product search builds a query text from product name, description, category, and brand.
- Chatbot intent detection is based on keywords inside `ChatbotAgent` and influences response metadata.

## Troubleshooting

Common issues:
- Vertex AI credentials missing or incorrect.
- pgvector extension not installed.
- `GCLOUD_PROJECT` or model configuration not set.
- Vector store empty (run `/api/admin/sync-embeddings` as admin).
