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

## 🌟 Features

This project features a combination of modern tools and practices for web development.

### Core Functionality (Implemented / In Progress):
* **User Authentication:** Secure registration and login (JWT-based likely, details TBD).
* **Product Management:**
    * Product listing with pagination and filtering.
    * Detailed product view.
    * Creating and editing products (requires admin/seller roles).
* **Category & Brand Management:** 
	* Display products by category and brand.
	* CRUD operations for Category and Brand.
* **Shopping Cart (Planned):** Functionality for adding, removing, and updating items in a cart.
* **Order Management (Planned):** Checkout process and order history.

### Frontend Stack:
* **Framework:** ⚛️ React with Vite for a fast development experience.
* **Language:** ✨ TypeScript for strong typing and better maintainability.
* **Routing:** 🧭 [TanStack Router](https://github.com/TanStack/router) for type-safe, file-based routing.
* **Data Fetching & State Management:**
    * ✳️ [TanStack Query (React Query)](https://github.com/TanStack/query) – Hooks for fetching, caching, and updating asynchronous data.
    * 🐻 [Zustand](https://github.com/pmndrs/zustand) – A small, fast, and scalable state-management solution for global state (e.g., auth state).
* **UI Components:** 🎨 [Mantine UI](https://github.com/mantinedev/mantine) – A comprehensive React components library.
* **Icons:** ✨ [Tabler Icons](https://github.com/tabler/tabler).
* **Form Validation:**
    * 📋 [Mantine Forms](https://www.npmjs.com/package/@mantine/form).
    * 🚨 [Zod](https://github.com/colinhacks/zod) – TypeScript-first schema validation.

### Backend Stack:
* **Framework:** 🌱 Spring Boot.
* **Language:** Java
* **Build Tool:** 🛠️ Maven.
* **Database:** 🐘 PostgreSQL.
* **ORM:** 🍃 Spring Data JPA / Hibernate.
    * **Security:** 🛡️ Spring Security.
* **API:** 🌐 RESTful APIs.
#### DevOps & Tooling:
* **Containerization:** 🐳 Docker & Docker Compose for consistent development, testing, and deployment environments.
* **Version Control:** Git & GitHub.
### Other Features:
* **Dockerized:** The entire application (frontend, backend, database) is containerized using Docker and orchestrated with `docker-compose` for consistent development and deployment environments.
* **Responsive Design:** UI designed to adapt to various screen sizes.
* **Dark Mode Support:** With Dark Mode/Light Mode toggle.

## 🏗️ Project Structure

The project is organized into distinct frontend and backend services, each following established architectural patterns to ensure maintainability and scalability.
## Top-level File Structure:
```text
EcommForAll
├── backend
├── CONTRIBUTING.md
├── docker-compose.yml
├── frontend
├── LICENSE
└── README.md
```
## Frontend Structure(frontend/src):
The frontend follows a **domain-driven approach**, organizing features by business domain, complemented by TanStack Router's virtual routing conventions.
```text
src/
├── assets
│   └── react.svg
├── config
│   └── api.ts
├── domains
│   ├── auth
│   │   ├── api
│   │   ├── components
│   │   ├── hooks
│   │   ├── schemas
│   │   └── types.ts
│   ├── brand
│   │   ├── api
│   │   ├── brandSchemas.ts
│   │   ├── components
│   │   ├── hooks
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── category
│   │   ├── api
│   │   ├── categorySchemas.ts
│   │   ├── components
│   │   ├── hooks
│   │   └── types.ts
│   ├── product
│   │   ├── api
│   │   ├── components
│   │   ├── hooks
│   │   ├── productQueryOptions.ts
│   │   ├── productSchemas.ts
│   │   ├── styles
│   │   └── types.ts
│   └── user
│       ├── api
│       ├── components
│       ├── hooks
│       └── types.ts
├── index.css
├── main.tsx
├── routes
│   ├── about.tsx
│   ├── brands
│   │   ├── $brandId
│   │   ├── index.tsx
│   │   └── new.tsx
│   ├── categories
│   │   ├── $categorySlug
│   │   ├── index.tsx
│   │   └── new.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── products
│   │   ├── $productId
│   │   ├── index.tsx
│   │   └── new.tsx
│   ├── profile
│   │   ├── edit.tsx
│   │   └── index.tsx
│   ├── register.tsx
│   ├── __root.module.css
│   ├── __root.tsx
│   └── wishlists
│       ├── $wishlistId
│       └── index.tsx
├── routes.ts
├── routeTree.gen.ts
├── schemas
├── shared
│   ├── components
│   │   ├── AboutPage.module.css
│   │   ├── AboutPage.tsx
│   │   ├── Footer.module.css
│   │   ├── Footer.tsx
│   │   ├── HomePage.module.css
│   │   ├── HomePage.tsx
│   │   ├── RichTextEditorField.tsx
│   │   └── RichTextEditor.tsx
│   └── utils
│       └── authGuard.ts
├── stores
│   └── authStore.ts
└── vite-env.d.ts
```
## Backend Structure(backend/src/main/java/com/ainan/ecommforallbackend)
The Spring Boot backend adheres to a standard layered architecture (Controller-Service-Repository).
```text
com/ainan/ecommforallbackend/
├── BackendApplication.java
├── config
│   ├── AmazonS3Config.java
│   ├── DataInitializer.java
│   └── SecurityConfig.java
├── controller
│   ├── AdminController.java
│   ├── AuthController.java
│   ├── BrandController.java
│   ├── CategoryController.java
│   ├── ProductController.java
│   ├── ProductImageController.java
│   ├── ProductVariantController.java
│   ├── UserController.java
│   ├── VariantImageController.java
│   └── WishlistController.java
├── dto
│   ├── BrandCreateDto.java
│   ├── BrandDto.java
│   ├── CategoryCreateDto.java
│   ├── CategoryDto.java
│   ├── ChangePasswordDto.java
│   ├── ImageSortOrderDto.java
│   ├── JwtResponse.java
│   ├── LoginDto.java
│   ├── ProductCreateDto.java
│   ├── ProductDto.java
│   ├── ProductFilterDto.java
│   ├── ProductImageCreateDto.java
│   ├── ProductImageDto.java
│   ├── ProductVariantCreateDto.java
│   ├── ProductVariantDto.java
│   ├── RoleUpdateDto.java
│   ├── UserAuthDto.java
│   ├── UserDto.java
│   ├── VariantImageCreateDto.java
│   ├── VariantImageDto.java
│   ├── WishlistAddProductDto.java
│   ├── WishlistCreateDto.java
│   ├── WishlistDto.java
│   └── WishlistProductSummeryDto.java
├── entity
│   ├── Brand.java
│   ├── Category.java
│   ├── ProductImage.java
│   ├── Product.java
│   ├── ProductVariant.java
│   ├── Review.java
│   ├── RoleName.java
│   ├── User.java
│   ├── VariantImage.java
│   └── Wishlist.java
├── exception
│   ├── GlobalExceptionHandler.java
│   └── ResourceNotFoundException.java
├── listener
│   └── VariantListener.java
├── mapper
│   ├── BrandMapper.java
│   ├── CategoryMapper.java
│   ├── ProductImageMapper.java
│   ├── ProductMapper.java
│   ├── ProductVariantMapper.java
│   ├── UserMapper.java
│   ├── VariantImageMapper.java
│   ├── WishlistMapper.java
│   └── WishlistProductSummaryMapper.java
├── repository
│   ├── BrandRepository.java
│   ├── CategoryRepository.java
│   ├── ProductImageRepository.java
│   ├── ProductRepository.java
│   ├── ProductVariantRepository.java
│   ├── UserRepository.java
│   ├── VariantImageRepository.java
│   └── WishlistRepository.java
├── security
│   ├── JwtAuthenticationFilter.java
│   └── JwtUtil.java
├── service
│   ├── AdminServiceImpl.java
│   ├── AdminService.java
│   ├── AuthService.java
│   ├── BrandServiceImpl.java
│   ├── BrandService.java
│   ├── CategoryServiceImpl.java
│   ├── CategoryService.java
│   ├── CustomUserDetailsService.java
│   ├── ProductImageServiceImpl.java
│   ├── ProductImageService.java
│   ├── ProductServiceImpl.java
│   ├── ProductService.java
│   ├── ProductVariantServiceImpl.java
│   ├── ProductVariantService.java
│   ├── S3ServiceImpl.java
│   ├── S3Service.java
│   ├── UserServiceImpl.java
│   ├── UserService.java
│   ├── VariantImageServiceImpl.java
│   ├── VariantImageService.java
│   ├── WishlistServiceImpl.java
│   └── WishlistService.java
├── specification
│   └── ProductSpecification.java
└── util
    └── SlugUtil.java
```

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (v18.x or later recommended)
* npm / yarn / pnpm (choose one)
* Java JDK (version 17 or later for Spring Boot)
* Maven
* Docker & Docker Compose

### Installation

1.  **Clone the repository:**
```bash
    git clone [https://github.com/ainan-ahmed/EcommForAll.git](https://github.com/ainan-ahmed/EcommForAll.git)
    cd EcommForAll
```


2.  **Backend Setup:**
    * Navigate to the backend directory (e.g., `cd backend`).
    * Build the Spring Boot application:
        ```bash
        mvn clean install
        mvn spring-boot:run
        ```

3.  **Frontend Setup:**
    * Navigate to the frontend directory (e.g., `cd frontend`).
    * Install dependencies:
```bash
        # Using npm
        npm install
        # Or using yarn
        # yarn install
        # Or using pnpm
        # pnpm install
```
### Running with Docker Compose

The easiest way to run the entire application stack is using Docker Compose:

1.  Ensure Docker is running.
2.  From the root directory of the project:
    ```bash
    docker-compose up --build
    ```
    This will build the images for frontend and backend and start all services (frontend, backend, Database).

3.  Access the application:
    * Frontend: `http://localhost:5173`
    * Backend API: `http://localhost:8080`
    
## 🗺️ Roadmap
##### Phase 1: Core E-commerce & Blog Features
- [ ]  User Authentication & Authorization with Jwt Based Authentication
	- [x]  Implement role-based access control (Admin, Seller, Customer)
	- [ ]  Integrate OAuth2 for Google and Facebook login
- [x]  Product Management
	- [x] Implement product Categories and subcategories.
	- [x] Add product attributes (size, color, brand)
  - [x] implement api endpoints
	- [x] Implement filtering and sorting for products
  - [x] develop UI's needed for products
- [ ] Wishlist & Reviews
	- [x] Implement wishlist functionality
	- [ ] Add product ratings and reviews
- [ ] Admin Panel
	- [ ] Implement Admin Panel.
	- [ ] Implement user management in admin panel
	- [ ] Implement product management in admin panel
	- [ ] Implement order management in admin panel (have to implement **Shopping Cart & Checkout** first)
	- [ ] Implement blog content management in admin panel (have to implement **Blog System** first)
- [ ]  Shopping Cart & Checkout
	- [ ] Implement add/update/remove items in cart
	- [ ] Implement order processing
	- [ ] Integrate payment gateways (Stripe, PayPal)
- [ ] Blog System
	- [ ] Implement CRUD blog posts
	- [ ] Implement categories and tags for blogs
	- [x] Integrate Markdown/WYSIWYG editor
- [x] User Profile
	- [x] User Profile Page
	- [x] Edit Profile


##### Phase 2: Advanced Features
- [ ] User Profile & Address Management
	- [ ] Allow users to save multiple addresses
	- [ ] Implement order history view
- [ ] Search & Filtering Optimization
	- [ ] Integrate ElasticSearch for advanced search
- [ ] Notifications System
	- [ ] Set up email notifications
- [ ] Chat Support
	- [ ] Add ChatBot


## 🤝 Contributing

This is a personal project, but contributions, feedback, and suggestions are welcome! Please feel free to fork the repository, open an issue, or submit a pull request. For more details, see [CONTRIBUTING.md](https://github.com/ainan-ahmed/EcommForAll/blob/main/CONTRIBUTING.md).

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/ainan-ahmed/EcommForAll/blob/main/LICENSE) file for details.

## 🙏 Acknowledgements

* [Mantine UI](https://mantine.dev/)
* [TanStack Router](https://tanstack.com/router/)
* [TanStack Query](https://tanstack.com/query/)
* [Zustand](https://github.com/pmndrs/zustand)
* [Spring Boot](https://spring.io/projects/spring-boot)
* [Vite](https://vitejs.dev/)
* And other great open-source libraries used.

---

Built with ❤️ by [Ainan]
