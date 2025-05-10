# EcommForAll

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Build Status](https://img.shields.io/github/actions/workflow/status/yourusername/yourrepo/ci.yml)](https://github.com/yourusername/yourrepo/actions) [![Docker Ready](https://img.shields.io/badge/Docker-Ready-brightgreen)](https://www.docker.com/)
**EcommForAll** is a modern e-commerce and blog platform built using Spring Boot on the backend and **React** on the frontend. The application is designed with scalability and maintainability in mind, employing a modular architecture and Docker containerization.

---
## Tech Stack

- **Backend**: Spring Boot, Spring Security, Spring Data JPA, PostgreSQL,
- **Frontend**: React, Zustand, Tanstack Router,Tanstack Query, Mantine,
- **DevOps**: Docker

## Architecture

- **Modular Monolith** (Spring Boot Multi-Module)
- **RESTful APIs** for frontend-backend communication
- **Multi-Tenant Ready** for scalability

## Key Features

- **Product Catalog**: Browse products with categories and filtering options.
- **Shopping Cart**: Add, update, or remove items before checkout.
- **Secure Checkout**: Integrated with Stripe and PayPal for safe transactions.
- **User Accounts**: Register, login, and manage personal profiles.
- **Admin Panel**: Manage products, orders, and user accounts.
- **Blog System**: Create, edit, and categorize blog posts.
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
- [ ]  Shopping Cart & Checkout
	- [ ] Implement add/update/remove items in cart
	- [ ] Implement order processing
	- [ ] Integrate payment gateways (Stripe, PayPal)
- [ ] Blog System
	- [ ]  Implement CRUD blog posts
	- [ ]  Implement categories and tags for blogs
	- [ ]  Integrate Markdown/WYSIWYG editor
- [ ] Admin Panel
	- [ ] Implement Admin Panel.
	- [ ]  Implement user management in admin panel
	- [ ]  Implement product management in admin panel
	- [ ]  Implement order management in admin panel
	- [ ]  Implement blog content management in admin panel
- [ ]  Allow sellers to add/manage their products
- [ ] Seller Management(Optional)
	- [ ]  Create dashboard with sales and user metrics
	- [ ]  Implement seller registration and login.
	- [ ]  (Optional) Implement earnings and payouts for sellers

### Phase 2: Advanced Features
- [ ] Order Management System
	- [ ] Implement order tracking
	- [ ]  Set up automated email notifications for orders
- [ ] User Profile & Address Management
	- [ ] Allow users to save multiple addresses
	- [ ] Implement order history view
- [ ] Search & Filtering Optimization
	- [ ] Integrate ElasticSearch for advanced search
	- [ ] Implement faceted filtering
- [ ] Multi-Language & Currency Support
	- [ ] Implement internationalization (i18n)
	- [ ] (Optional) Add support for multiple currencies.
- [ ] Notifications System
	- [ ] Set up email notifications
	- [ ]  Implement push notifications
- [ ] Wishlist & Reviews
	- [ ] Implement wishlist functionality
	- [ ]  Add product ratings and reviews
- [ ] (Optional) Affiliate Marketing & Referral System
	- [ ] Implement referral discounts
	- [ ]  Set up affiliate links

### Phase 3: Scaling & Enhancements
- [ ] (Optional) Microservices Migration 
	- [ ] (Optional) Evaluate and plan microservices architecture
	- [ ]  (Optional) Migrate monolithic services to microservices if necessary
- [ ] Real-time Chat Support
	- [ ] Implement customer support chat system
- [ ] Live Order Tracking
	- [ ] Set up live order tracking for deliveries
- [ ] Subscriptions & Memberships
	- [ ] Implement subscription plans
	- [ ] Add membership features
- [ ] Multi-Vendor Marketplace Features
	- [ ] Enhance vendor management for multi-vendor support

---
---
## Contributing

Pick a task from the phases above and submit a pull request. For more details, see [CONTRIBUTING.md](CONTRIBUTING.md) (to be added).

## License

This project is licensed under the MIT License (to be added).
