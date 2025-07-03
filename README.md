# EcommForAll 🛍️

**EcommForAll** is a modern, full-stack e-commerce platform designed to provide a comprehensive online shopping experience. This project serves as a learning platform and a demonstration of building a feature-rich application using a modern tech stack.

✨ **[Link to Live Demo(not added yet)]** ✨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-%236DB33F.svg?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Mantine UI](https://img.shields.io/badge/Mantine-%23339AF0.svg?style=for-the-badge&logo=mantine&logoColor=white)](https://mantine.dev/)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-React-%23EF4444.svg?style=for-the-badge)](https://tanstack.com/router/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-React-%23FF4154.svg?style=for-the-badge)](https://tanstack.com/query/)
[![Zustand](https://img.shields.io/badge/Zustand-%23764ABC.svg?style=for-the-badge)](https://github.com/pmndrs/zustand)

---

## 📖 Introduction

EcommForAll is a [**Work-in-Progress**] project aiming to create a robust e-commerce platform. It demonstrates the integration of a **React-based** frontend with a **Spring Boot** backend, focusing on modern development practices, type safety, and efficient state management.

This project serves as a personal learning endeavor and a portfolio piece to showcase skills in full-stack development.

## 🗺️ Roadmap

##### Phase 1: Core E-commerce & AI Features

-   [x] **User Authentication & Authorization**
    -   [x] JWT-based authentication with role-based access control (Admin, Seller, Customer)
    -   [ ] OAuth2 integration for Google and Facebook login
-   [x] **Product Management**
    -   [x] Categories, subcategories, and product attributes
    -   [x] API endpoints and filtering/sorting functionality
    -   [x] Complete UI implementation
-   [x] **AI Description Generation**
    -   [x] Product description generation using Google Vertex AI
    -   [x] Multiple tone options (professional, casual, technical, marketing)
    -   [x] Support for product variants and SEO optimization
-   [ ] **Customer Support**
    -   [ ] AI chatbot infrastructure
    -   [ ] Advanced conversation handling
-   [x] **Wishlist & Reviews**
    -   [x] Wishlist functionality
    -   [ ] Product ratings and reviews
-   [ ] **Admin Panel**
    -   [ ] User, product, and order management interfaces
    -   [ ] Blog content management system
-   [ ] **Shopping Cart & Checkout**
    -   [x] Cart item management
    -   [ ] Order processing and payment gateway integration (Stripe, PayPal)
-   [ ] **Blog System**
    -   [ ] CRUD operations for blog posts with categories and tags
    -   [x] Markdown/WYSIWYG editor integration
-   [x] **User Profile**
    -   [x] Profile pages and editing functionality

##### Phase 2: Advanced Features

-   [ ] **Enhanced User Experience**
    -   [ ] Multiple address management and order history
    -   [ ] ElasticSearch integration for advanced search
-   [ ] **Communication & Notifications**
    -   [ ] Email notification system
    -   [ ] Enhanced AI chatbot capabilities

## 🌟 Features

### Core Functionality:

-   **User Authentication:** JWT-based secure login/registration
-   **Product Management:** CRUD operations with filtering & pagination
-   **Category & Brand Management:** Full CRUD operations
-   **Shopping Cart:** Add, remove, and update items
-   **AI Product Descriptions:** Generate compelling descriptions using Google Vertex AI
-   **Wishlist:** Save and manage favorite products

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
    -   📋 [Mantine Forms](https://www.npmjs.com/package/@mantine/form).
    -   🚨 [Zod](https://github.com/colinhacks/zod) – TypeScript-first schema validation.

### Backend Stack:

-   **Framework:** 🌱 Spring Boot with Java
-   **Database:** 🐘 PostgreSQL with Spring Data JPA/Hibernate
-   **Security:** 🛡️ Spring Security with JWT authentication
-   **AI Integration:** 🤖 Spring AI with Google Vertex AI (Gemini models)
-   **API:** 🌐 RESTful APIs with OpenAPI documentation

#### DevOps & Tooling:

-   **Containerization:** 🐳 Docker & Docker Compose
-   **Version Control:** Git & GitHub

### Other Features:

-   **Dockerized:** Full application containerization
-   **Responsive Design:** Mobile-friendly UI
-   **Dark Mode Support:** Toggle between light and dark themes
-   **AI-Powered:** Product description generation and customer support

## Project Structure

See [Project Structure](https://github.com/ainan-ahmed/EcommForAll/blob/main/PROJECT-STRUCTURE.MD)

## 🤖 AI Services Documentation

For detailed information about the AI-powered features including product description generation, API endpoints, usage examples, and configuration, see [AI Service Documentation](https://github.com/ainan-ahmed/EcommForAll/blob/main/AI_SERVICE_README.md).

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18.x or later)
-   Java JDK (version 17 or later)
-   Docker & Docker Compose
-   Maven (for manual backend setup)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/ainan-ahmed/EcommForAll.git
cd EcommForAll
```

2. **Using Docker Compose (Recommended):**

```bash
docker-compose up --build
```

3. **Manual Setup:**

    - **Backend:** `cd backend && mvn clean install && mvn spring-boot:run`
    - **Frontend:** `cd frontend && npm install && npm run dev`

4. **Access the application:**
    - Frontend: `http://localhost:5173`
    - Backend API: `http://localhost:8080`

## 🤝 Contributing

This is a personal project, but contributions, feedback, and suggestions are welcome! Please feel free to fork the repository, open an issue, or submit a pull request. For more details, see [CONTRIBUTING.md](https://github.com/ainan-ahmed/EcommForAll/blob/main/CONTRIBUTING.md).

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/ainan-ahmed/EcommForAll/blob/main/LICENSE) file for details.

## 🙏 Acknowledgements

-   [Mantine UI](https://mantine.dev/)
-   [TanStack Router](https://tanstack.com/router/)
-   [TanStack Query](https://tanstack.com/query/)
-   [Zustand](https://github.com/pmndrs/zustand)
-   [Spring Boot](https://spring.io/projects/spring-boot)
-   [Vite](https://vitejs.dev/)
-   [Mantine Admin](https://github.com/jotyy/Mantine-Admin/blob/main/README.md) for Readme Template.
-   And other great open-source libraries used.

---

Built with ❤️ by **Ainan**
