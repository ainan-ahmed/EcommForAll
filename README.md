# EcommForAll

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Build Status](https://img.shields.io/github/actions/workflow/status/yourusername/yourrepo/ci.yml)](https://github.com/yourusername/yourrepo/actions) [![Docker Ready](https://img.shields.io/badge/Docker-Ready-brightgreen)](https://www.docker.com/)
**EcommForAll** is a modern e-commerce and blog platform built using Spring Boot on the backend and **React** on the frontend. The application is designed with scalability and maintainability in mind, employing a modular architecture and Docker containerization.

---
## Tech Stack

- **Backend**: Spring Boot, Spring Security, Spring Data JPA, PostgreSQL,
- **Frontend**: React, Zustand, Tanstack Router,Tanstack Query, Mantine, Zod, 
- **DevOps**: Docker

## Architecture

- **Modular Monolith** (Spring Boot Multi-Module)
- **RESTful APIs** for frontend-backend communication
- **Multi-Tenant Ready** for scalability

## Key Features

- [x] **Product Catalog**: Browse products with categories and filtering options.
- [ ] **Shopping Cart**: Add, update, or remove items before checkout.
- [ ] **Secure Checkout**: Integrated with Stripe and PayPal for safe transactions.
- [x] **User Accounts**: Register, login, and manage personal profiles.
- [ ] **Admin Panel**: Manage products, orders, and user accounts.
- [ ] **Blog System**: Create, edit, and categorize blog posts.
---
---
## Setup Instructions

1. **Clone the Repo**:
```bash
git clone https://github.com/ainan-ahmed/EcommForAll.git
cd EcommForAll
```
>[!IMPORTANT]
> If you want to setup using docker, skip step 2,3 and go directly to 4.


2. **Backend**:
	- Install Java 17+ and Maven
	- Update application.properties with database config
	- Run:
```bash
mvn clean install
mvn spring-boot:run
```

3. **Frontend**:
- Install Node.js and npm
- Navigate to frontend:
```bash
cd frontend
npm install
npm start
```

4. **Docker (Optional)**:
```bash
docker-compose up --build
```
- Access the frontend at: `http://localhost:3000`
- Access the backend at: `http://localhost:8080`

---
---

## Development Todos
### Phase 1: Core E-commerce & Blog Features (MVP)

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


### Phase 2: Advanced Features
- [ ] User Profile & Address Management
  - [x] User Profile and Edit Profile
	- [ ] Allow users to save multiple addresses
	- [ ] Implement order history view
- [ ] Search & Filtering Optimization
	- [ ] Integrate ElasticSearch for advanced search
- [ ] Notifications System
	- [ ] Set up email notifications
- [ ] Chat Support
	- [ ] Add ChatBot

---
---
## Contributing

Pick a task from the phases above and submit a pull request. For more details, see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the MIT License [LICENSE].
