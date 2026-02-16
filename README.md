# EcommForAll 🛍️

**EcommForAll** is a modern, full-stack e-commerce platform enhanced with **AI-powered features** for intelligent product recommendations, automated content generation, and conversational shopping assistance. This project demonstrates the integration of cutting-edge AI technologies with traditional e-commerce functionality.

✨ **[Link to Live Demo(not added yet)]** ✨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-%236DB33F.svg?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring AI](https://img.shields.io/badge/Spring_AI-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-ai)
[![Mantine UI](https://img.shields.io/badge/Mantine-%23339AF0.svg?style=for-the-badge&logo=mantine&logoColor=white)](https://mantine.dev/)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-React-%23EF4444.svg?style=for-the-badge)](https://tanstack.com/router/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-React-%23FF4154.svg?style=for-the-badge)](https://tanstack.com/query/)
[![Zustand](https://img.shields.io/badge/Zustand-%23764ABC.svg?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)

---

## 📖 Introduction

EcommForAll is a [work-in-progress] project that combines traditional online shopping features with modern artificial intelligence capabilities. Built with **Spring AI** and **Google Vertex AI**, it offers intelligent product recommendations, automated content generation, conversational shopping assistance, and semantic product search.

This project serves as a comprehensive demonstration of integrating AI/ML technologies into real-world applications, showcasing skills in full-stack development, machine learning integration, and modern cloud-native architectures.

## 🌟 Features

This project features a combination of modern tools and practices for web development.

### 🛒 Complete E-commerce Platform:

-   **Authentication & Authorization:** Secure user registration and login with JWT-based authentication
-   **Product Management:** Full product lifecycle and admin/seller role controls with Support for product variations with attributes, pricing, and inventory management
-   **Brand and Category Management :** Complete CRUD operations for brand management and Hierarchical category system.
-   **Shopping Cart, Order Management, Wishlist:** Full cart functionality, Save and manage favorite products across sessions and Complete checkout process with order history and tracking

### 🤖 AI-Powered Features:

-   **Intelligent Chatbot Agent:** Conversational shopping assistant powered by Google Vertex AI
-   **Product Recommendations Agent:** AI-driven similar product suggestions using vector embeddings
-   **Content Generation Agent:** Automated product description generation with customizable tone and style
-   **Semantic Search:** Vector-based product search for natural language queries through AI Chatbot
-   **Conversation Memory:** Persistent chat history with context-aware responses

### Frontend Stack:

-   **Framework:** ⚛️ React with Vite for a fast development experience.
-   **Language:** ✨ TypeScript for strong typing and better maintainability.
-   **Routing:** 🧭 [TanStack Router](https://github.com/TanStack/router) for type-safe, file-based routing.
-   **Data Fetching & State Management:**
    -   ✳️ [TanStack Query (React Query)](https://github.com/TanStack/query) – Hooks for fetching, caching, and updating asynchronous data.
    -   🐻 [Zustand](https://github.com/pmndrs/zustand) – A small, fast, and scalable state-management solution for global state (e.g., auth state).
-   **UI Components:** 🎨 [Mantine UI](https://github.com/mantinedev/mantine) – A comprehensive React components library.
-   **Icons:** ✨ [Tabler Icons](https://github.com/tabler/tabler).
-   **Form Validation:**
    -   📋 [Mantine Forms](https://www.npmjs.com/package/@mantine/form)
    -   🚨 [Zod](https://github.com/colinhacks/zod) - TypeScript-first schema validation

### Backend Stack:

-   **Framework:** 🌱 Spring Boot.
-   **Language:** Java
-   **Build Tool:** 🛠️ Maven.
-   **Database:** 🐘 PostgreSQL.
-   **Vector Database:** [pgvector](https://github.com/pgvector/pgvector)
-   **ORM:** 🍃 Spring Data JPA / Hibernate.
-   **Security:** 🛡️ Spring Security.
-   **API:** 🌐 RESTful APIs.
-   **Generative AI:** [Spring AI](https://spring.io/projects/spring-ai), [Vertex AI](https://cloud.google.com/vertex-ai?hl=en).

#### DevOps & Tooling:

-   **Containerization:** 🐳 Docker & Docker Compose for consistent development, testing, and deployment environments.
-   **Version Control:** Git & GitHub.

### Other Features:

-   **Responsive Design:** UI designed to adapt to various screen sizes.
-   **Dark Mode Support:** With Dark Mode/Light Mode toggle.

## Project Structure

See [Project Structure](https://github.com/ainan-ahmed/EcommForAll/blob/main/PROJECT-STRUCTURE.MD)

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18.x or later recommended)
-   npm / yarn / pnpm (choose one)
-   Java JDK (version 21 or later for Spring Boot)
-   Maven
-   Docker & Docker Compose

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/ainan-ahmed/EcommForAll.git
cd EcommForAll
```

2. **Google Cloud Setup:**

```bash
# Install Google Cloud CLI and authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable compute.googleapis.com

# Create and download service account key
gcloud iam service-accounts create ecommforall-ai
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:ecommforall-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"
gcloud iam.service-accounts keys create ecommforall-ai-key.json \
    --iam-account=ecommforall-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

3. **Backend Setup:**

```bash
cd backend

# Set environment variables
export GOOGLE_APPLICATION_CREDENTIALS="./ecommforall-ai-key.json"
export GCLOUD_PROJECT="your-project-id"

# Install PostgreSQL with pgvector (if not using Docker)
# On Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib
sudo apt-get install postgresql-15-pgvector

# Build and run
mvn clean install
mvn spring-boot:run
```

4. **Frontend Setup:**

```bash
cd frontend
npm install
npm run dev
```

### Running with Docker Compose

The easiest way to run the entire AI-enhanced application stack:

```bash
# Start all services (includes PostgreSQL with pgvector)
docker-compose up --build

# Access the application:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### 🤖 AI Configuration

Create `.env.ai` file in the backend directory:

```bash
GOOGLE_APPLICATION_CREDENTIALS=./ecommforall-ai-key.json
GCLOUD_PROJECT=your-project-id
VERTEX_AI_LOCATION=europe-west1
```

## 🤖 AI Quick Reference

- Chatbot endpoints: `/api/chatbot/*` (USER or ADMIN required)
- Description generation: `POST /api/ai/generate-description` (SELLER or ADMIN)
- Similar products: `GET /api/ai/similar-products/{productId}?limit=5`
- Embedding sync: `POST /api/admin/sync-embeddings` (ADMIN only)

See `backend/AI_SERVICE_README.md` for full request/response payloads, tools, memory, and troubleshooting.

### 📊 Database Setup

The application automatically initializes:

-   **Product vector embeddings** for semantic search(through admin endpoint)
-   **Conversation memory tables** for chatbot history

## 🗺️ Roadmap

### ✅ **Phase 1: Core E-commerce + AI Foundation (Current)**

-   [x] **User Authentication & Authorization** with JWT
-   [x] **Product Management** with categories, variants, and attributes
-   [x] **Shopping Cart & Wishlist** functionality
-   [x] **AI-Powered Chatbot** with Vertex AI integration
-   [x] **Vector-Based Product Search** with pgvector
-   [x] **AI Content Generation** for product descriptions
-   [x] **Conversation Memory** and context management
-   [ ] **Admin Panel** 
-   [x] **Product Reviews**
-   [x] **Order Checkout**

### 🚧 **Phase 2:**

-   [ ] **Image-Based Product Search** with Vision AI
-   [ ] **Voice Shopping Assistant** integration
-   [ ] **Sentiment Analysis** for reviews and feedback

## 🏛️ AI Architecture Details

### **Vector Store Configuration**

-   **Database**: PostgreSQL with pgvector extension
-   **Embedding Model**: Google Text Embedding 005
-   **Dimensions**: 768-dimensional vectors
-   **Index Type**: HNSW (Hierarchical Navigable Small World)
-   **Distance Metric**: Cosine similarity
-   **Batch Size**: 10,000 documents per batch

### **LLM Configuration**

-   **Primary Model**: Gemini 2.5 pro
-   **Temperature**: 0.7 for balanced creativity/accuracy
-   **Max Tokens**: Configurable per use case
-   **Function Calling**: Custom tools for e-commerce operations

### **Memory Management**

-   **Type**: Sliding window conversation memory
-   **Storage**: JDBC-based persistent storage
-   **Window Size**: 20 messages per conversation
-   **Context**: User preferences and shopping history

## 🎯 AI API Examples

### Chatbot Interaction

```bash
curl -X POST "http://localhost:8080/api/chatbot/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "Show me wireless headphones under $100",
    "conversationId": "uuid-here"
  }'
```

### Generate Product Description

```bash
curl -X POST "http://localhost:8080/api/ai/generate-description" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productName": "Gaming Mechanical Keyboard",
    "category": "Electronics",
    "brand": "GameTech",
    "tone": "technical",
    "maxLength": 200
  }'
```

## 📚 Documentation

-   **[AI Service Documentation](backend/AI_SERVICE_README.md)** - Detailed AI features and API reference
-   **[Project Structure](PROJECT-STRUCTURE.MD)** - Complete codebase organization
-   **[API Endpoints](backend/API_ENDPOINTS.md)** - Comprehensive API documentation
-   **[CI/CD Workflows](docs/CI-CD.md)** - Automated checks, formatting, and deployment
-   **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute to the project

## 🛠️ Advanced Configuration

### Environment Variables

```bash
# AI Configuration
GOOGLE_APPLICATION_CREDENTIALS=./ecommforall-ai-key.json
GCLOUD_PROJECT=your-project-id
VERTEX_AI_LOCATION=europe-west1

# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/ecommforall
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres

# AWS S3
AWS_S3_BUCKET=ecommforall
AWS_REGION=eu-north-1

# Security
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=86400000
```

### Docker Configuration

```yaml
# docker-compose.yml includes:
- PostgreSQL with pgvector extension
- Spring Boot backend with AI dependencies
- React frontend with AI chat interface
- Volume mounting for persistent data
```

## 🤝 Contributing

This is a personal project, but contributions, feedback, and suggestions are welcome! Please feel free to fork the repository, open an issue, or submit a pull request. For more details, see [CONTRIBUTING.md](https://github.com/ainan-ahmed/EcommForAll/blob/main/CONTRIBUTING.md).

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.

## 🙏 Acknowledgements

### **AI & ML Technologies**

-   [Spring AI](https://spring.io/projects/spring-ai) - AI integration framework
-   [Google Vertex AI](https://cloud.google.com/vertex-ai) - Machine learning platform
-   [pgvector](https://github.com/pgvector/pgvector) - Vector similarity search for PostgreSQL

### **Frontend Technologies**

-   [Mantine UI](https://mantine.dev/) - React components library
-   [TanStack Router](https://tanstack.com/router/) - Type-safe routing
-   [TanStack Query](https://tanstack.com/query/) - Data fetching and caching
-   [Zustand](https://github.com/pmndrs/zustand) - State management

### **Backend Technologies**

-   [Spring Boot](https://spring.io/projects/spring-boot) - Application framework
-   [PostgreSQL](https://postgresql.org/) - Database with vector extensions
-   [Vite](https://vitejs.dev/) - Build tool and development server

### **Infrastructure**

-   [Docker](https://docker.com/) - Containerization platform
-   [AWS S3](https://aws.amazon.com/s3/) - Cloud storage service

---

**🤖 Built with AI-First Philosophy by Ainan** ❤️
