# EcommForAll 🛍️

**EcommForAll** is a modern, AI-first e-commerce platform that blends traditional shopping with intelligent automation. Built with **Spring AI** and **Google Vertex AI**, it features conversational assistance, semantic search, and automated content generation to deliver a cutting-edge shopping experience.

✨ **[Link to Live Demo (Coming Soon)]** ✨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232a?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring AI](https://img.shields.io/badge/Spring_AI-6DB33F?logo=spring&logoColor=white)](https://spring.io/projects/spring-ai)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-0db7ed?logo=docker&logoColor=white)](https://docker.com/)

---

## 🚀 Quick Start

The fastest way to run the entire stack (Frontend, Backend, PostgreSQL + pgvector):

```bash
git clone https://github.com/ainan-ahmed/EcommForAll.git
cd EcommForAll
docker-compose up --build
```

- **Frontend:** `http://localhost:5173` | **Backend API:** `http://localhost:8080` | **Swagger:** `/swagger-ui.html`

*For cloud features, follow the [GCP Setup Guide](docs/GCP_SETUP.md).*

---

## 🛠️ Tech Stack

| Layer | Primary Technologies | Key Libraries & Frameworks |
| :--- | :--- | :--- |
| **Frontend** | React, TypeScript, Vite | Mantine UI, TanStack Router/Query, Zustand, Zod |
| **Backend** | Java 21, Spring Boot 3.4 | Spring Data JPA, Spring Security, Spring AI, MapStruct |
| **AI/ML** | Google Vertex AI, pgvector | Gemini 2.5 Pro, Text Embedding 005, HNSW Indexing |
| **Storage** | PostgreSQL, AWS S3 | Hibernate, Amazon SDK |
| **DevOps** | Docker, GitHub Actions | Docker Compose, Reviewdog, Maven |

---

## 🌟 Features

### 🛒 Core E-commerce
- **Auth & Roles:** JWT-based secure login with Admin, Seller, and User roles.
- **Product Engine:** Complex variants, attributes, and inventory management.
- **Brand/Category:** Hierarchical category system and brand CRUD.
- **Shopping Flow:** Fully functional Cart, Wishlist, Checkout, and Reviews.

### 🤖 AI-Powered Intelligence
- **Intelligent Chatbot:** Conversational shopping assistant with memory and tool calling.
- **Semantic Search:** Natural language search powered by 768-dim vector embeddings.
- **AI Content Gen:** Automated product descriptions with customizable tone and style.
- **Recommendations:** Vector-similarity based "Similar Products" engine.

---

## 🏛️ AI Architecture Quick Specs

| Component | Detail |
| :--- | :--- |
| **Primary Model** | Gemini 2.5 Pro (via Vertex AI) |
| **Embeddings** | Google Text Embedding 005 (768 Dimensions) |
| **Vector Store** | pgvector (PostgreSQL) with HNSW Indexing |
| **Memory** | JDBC-backed sliding window (Default: 20 messages) |
| **Distance Metric** | Cosine Similarity |

*For API payloads and implementation details, see **[AI Service Documentation](backend/AI_SERVICE_README.md)**.*

---

## 🗺️ Roadmap & Documentation

- ✅ **Phase 1 (Complete):** Auth, Product Engine, Vector Search, AI Chatbot, Reviews, Checkout.
- 🚧 **Phase 2 (In Progress):** Admin Dashboard, Vision AI Search, Voice Assistant integration.

### **Important Guides:**
- 📝 **[Project Structure](PROJECT-STRUCTURE.MD)** - Codebase organization.
- ⚙️ **[CI/CD Workflows](docs/CI-CD.md)** - Automated checks and formatting.
- 🤖 **[OpenCode Agents](AGENTS.md)** - CLI agents (`@gh-bot`) and dev commands.
- 🤝 **[Contributing](CONTRIBUTING.md)** - Guidelines for local development.

---

**🤖 Built with an AI-First Philosophy by [Ainan](https://github.com/ainan-ahmed)** ❤️  
*Special thanks to: [Spring AI], [Vertex AI], [Mantine], [TanStack], and the [pgvector] community.*
