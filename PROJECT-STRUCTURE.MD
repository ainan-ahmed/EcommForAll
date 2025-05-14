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
