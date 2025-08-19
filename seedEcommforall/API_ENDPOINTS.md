# EcommForAll Backend API Endpoints

**Base URL:** `http://localhost:8080`

## 🔐 Authentication Endpoints (`/api/auth`)

| Method | Endpoint             | Description              | Auth Required | Body/Params             |
| ------ | -------------------- | ------------------------ | ------------- | ----------------------- |
| `POST` | `/api/auth/register` | Register new user        | ❌            | `UserAuthDto`           |
| `POST` | `/api/auth/login`    | User login               | ❌            | `LoginDto`              |
| `GET`  | `/api/auth/validate` | Validate JWT token       | ❌            | Header: `Authorization` |
| `GET`  | `/api/auth/user`     | Get current user details | ✅            | Header: `Authorization` |

## 👤 User Management (`/api/user`)

| Method   | Endpoint                   | Description     | Auth Required | Body/Params                     |
| -------- | -------------------------- | --------------- | ------------- | ------------------------------- |
| `GET`    | `/api/user/{id}`           | Get user by ID  | ✅            | Path: `id`                      |
| `PUT`    | `/api/user/{id}`           | Update user     | ✅            | Path: `id`, Body: `UserAuthDto` |
| `DELETE` | `/api/user/{id}`           | Delete user     | ✅            | Path: `id`                      |
| `PUT`    | `/api/user/changePassword` | Change password | ✅            | Body: `ChangePasswordDto`       |

## 👑 Admin Endpoints (`/api/admin`)

**Role Required:** `ADMIN`

| Method | Endpoint                                        | Description                                      | Body/Params                                |
| ------ | ----------------------------------------------- | ------------------------------------------------ | ------------------------------------------ |
| `GET`  | `/api/admin/users`                              | Get all users (paginated)                        | Query: `page`, `size`, `sort`, `direction` |
| `PUT`  | `/api/admin/users/{userId}/changeRole`          | Change user role                                 | Path: `userId`, Body: `RoleUpdateDto`      |
| `POST` | `/api/admin/sync-embeddings`                    | Sync product embeddings for AI                   | ❌                                         |
| `POST` | `/api/admin/create-default-wishlists-and-carts` | Create default wishlists and carts for all users | ❌                                         |

## 🏷️ Brand Management (`/api/brands`)

| Method   | Endpoint                  | Description                | Auth Required | Body/Params                   |
| -------- | ------------------------- | -------------------------- | ------------- | ----------------------------- |
| `GET`    | `/api/brands`             | Get all brands (paginated) | ❌            | Query: Pageable               |
| `GET`    | `/api/brands/active`      | Get all active brands      | ❌            | Query: Pageable               |
| `GET`    | `/api/brands/{id}`        | Get brand by ID            | ❌            | Path: `id`                    |
| `GET`    | `/api/brands/name/{name}` | Get brand by name          | ❌            | Path: `name`                  |
| `POST`   | `/api/brands`             | Create new brand           | ✅            | Body: `BrandCreateDto`        |
| `PUT`    | `/api/brands/{id}`        | Update brand               | ✅            | Path: `id`, Body: `BrandDto`  |
| `DELETE` | `/api/brands/{id}`        | Delete brand               | ✅            | Path: `id`                    |
| `POST`   | `/api/brands/{id}/image`  | Upload brand image         | ✅            | Path: `id`, FormData: `image` |
| `DELETE` | `/api/brands/{id}/image`  | Delete brand image         | ✅            | Path: `id`                    |

## 📂 Category Management (`/api/categories`)

| Method   | Endpoint                      | Description                    | Auth Required | Body/Params                     |
| -------- | ----------------------------- | ------------------------------ | ------------- | ------------------------------- |
| `GET`    | `/api/categories`             | Get all categories (paginated) | ❌            | Query: Pageable                 |
| `GET`    | `/api/categories/root`        | Get root categories only       | ❌            | Query: Pageable                 |
| `GET`    | `/api/categories/{id}`        | Get category by ID             | ❌            | Path: `id`                      |
| `GET`    | `/api/categories/slug/{slug}` | Get category by slug           | ❌            | Path: `slug`                    |
| `GET`    | `/api/categories/name/{name}` | Get category by name           | ❌            | Path: `name`                    |
| `POST`   | `/api/categories`             | Create new category            | ✅            | Body: `CategoryCreateDto`       |
| `PUT`    | `/api/categories/{id}`        | Update category                | ✅            | Path: `id`, Body: `CategoryDto` |
| `DELETE` | `/api/categories/{id}`        | Delete category                | ✅            | Path: `id`                      |
| `POST`   | `/api/categories/{id}/image`  | Upload category image          | ✅            | Path: `id`, FormData: `image`   |
| `DELETE` | `/api/categories/{id}/image`  | Delete category image          | ✅            | Path: `id`                      |

## 🛍️ Product Management (`/api/products`)

| Method   | Endpoint                              | Description                     | Auth Required | Body/Params                                                   |
| -------- | ------------------------------------- | ------------------------------- | ------------- | ------------------------------------------------------------- |
| `GET`    | `/api/products`                       | Get all products (with filters) | ❌            | Query: `ProductFilterDto`, `isActive`, `isFeatured`, Pageable |
| `GET`    | `/api/products/filter`                | Filter products                 | ❌            | Query: `ProductFilterDto`, Pageable                           |
| `GET`    | `/api/products/{id}`                  | Get product by ID               | ❌            | Path: `id`, Query: `includes` (images,variants,variantImages) |
| `GET`    | `/api/products/active`                | Get active products only        | ❌            | Query: Pageable                                               |
| `GET`    | `/api/products/featured`              | Get featured products only      | ❌            | Query: Pageable                                               |
| `GET`    | `/api/products/category/{categoryId}` | Get products by category        | ❌            | Path: `categoryId`, Query: Pageable                           |
| `GET`    | `/api/products/brand/{brandId}`       | Get products by brand           | ❌            | Path: `brandId`, Query: Pageable                              |
| `GET`    | `/api/products/seller/{sellerId}`     | Get products by seller          | ❌            | Path: `sellerId`, Query: Pageable                             |
| `POST`   | `/api/products`                       | Create new product              | ✅            | Body: `ProductCreateDto`                                      |
| `PUT`    | `/api/products/{id}`                  | Update product                  | ✅            | Path: `id`, Body: `ProductDto`                                |
| `DELETE` | `/api/products/{id}`                  | Delete product                  | ✅            | Path: `id`                                                    |

## 🖼️ Product Image Management (`/api/products/{productId}/images`)

| Method   | Endpoint                                   | Description             | Auth Required | Body/Params                                                       |
| -------- | ------------------------------------------ | ----------------------- | ------------- | ----------------------------------------------------------------- |
| `GET`    | `/api/products/{productId}/images`         | Get all product images  | ❌            | Path: `productId`, Query: Pageable                                |
| `GET`    | `/api/products/{productId}/images/{id}`    | Get product image by ID | ❌            | Path: `productId`, `id`                                           |
| `POST`   | `/api/products/{productId}/images`         | Upload product image    | ✅            | Path: `productId`, FormData: `file`, `altText`, `sortOrder`       |
| `PUT`    | `/api/products/{productId}/images/{id}`    | Update product image    | ✅            | Path: `productId`, `id`, FormData: `file`, `altText`, `sortOrder` |
| `DELETE` | `/api/products/{productId}/images/{id}`    | Delete product image    | ✅            | Path: `productId`, `id`                                           |
| `PUT`    | `/api/products/{productId}/images/reorder` | Reorder product images  | ✅            | Path: `productId`, Body: `List<ImageSortOrderDto>`                |

## 🎭 Product Variant Management (`/api/products/{productId}/variants`)

| Method   | Endpoint                                  | Description              | Auth Required | Body/Params                                        |
| -------- | ----------------------------------------- | ------------------------ | ------------- | -------------------------------------------------- |
| `GET`    | `/api/products/{productId}/variants`      | Get all product variants | ❌            | Path: `productId`, Query: Pageable                 |
| `GET`    | `/api/products/{productId}/variants/{id}` | Get variant by ID        | ❌            | Path: `productId`, `id`                            |
| `POST`   | `/api/products/{productId}/variants`      | Create new variant       | ✅            | Path: `productId`, Body: `ProductVariantCreateDto` |
| `PUT`    | `/api/products/{productId}/variants/{id}` | Update variant           | ✅            | Path: `productId`, `id`, Body: `ProductVariantDto` |
| `DELETE` | `/api/products/{productId}/variants/{id}` | Delete variant           | ✅            | Path: `productId`, `id`                            |

## 🎨 Variant Image Management (`/api/products/{productId}/variants/{variantId}/images`)

| Method   | Endpoint                                                     | Description             | Auth Required | Body/Params                                                                    |
| -------- | ------------------------------------------------------------ | ----------------------- | ------------- | ------------------------------------------------------------------------------ |
| `GET`    | `/api/products/{productId}/variants/{variantId}/images`      | Get variant images      | ❌            | Path: `productId`, `variantId`, Query: Pageable                                |
| `GET`    | `/api/products/{productId}/variants/{variantId}/images/{id}` | Get variant image by ID | ❌            | Path: `productId`, `variantId`, `id`                                           |
| `POST`   | `/api/products/{productId}/variants/{variantId}/images`      | Upload variant image    | ✅            | Path: `productId`, `variantId`, FormData: `file`, `altText`, `sortOrder`       |
| `PUT`    | `/api/products/{productId}/variants/{variantId}/images/{id}` | Update variant image    | ✅            | Path: `productId`, `variantId`, `id`, FormData: `file`, `altText`, `sortOrder` |
| `DELETE` | `/api/products/{productId}/variants/{variantId}/images/{id}` | Delete variant image    | ✅            | Path: `productId`, `variantId`, `id`                                           |

## 🛒 Shopping Cart (`/api/cart`)

**Auth Required:** ✅

| Method   | Endpoint                       | Description              | Body/Params                             |
| -------- | ------------------------------ | ------------------------ | --------------------------------------- |
| `GET`    | `/api/cart`                    | Get user's shopping cart | ❌                                      |
| `GET`    | `/api/cart/items`              | Get cart items           | ❌                                      |
| `GET`    | `/api/cart/items/count`        | Get cart items count     | ❌                                      |
| `GET`    | `/api/cart/items/total`        | Get cart total amount    | ❌                                      |
| `POST`   | `/api/cart/items`              | Add item to cart         | Body: `CartItemCreateDto`               |
| `PUT`    | `/api/cart/items/{cartItemId}` | Update cart item         | Path: `cartItemId`, Body: `CartItemDto` |
| `DELETE` | `/api/cart/items/{cartItemId}` | Remove item from cart    | Path: `cartItemId`                      |
| `DELETE` | `/api/cart/items/clearCart`    | Clear shopping cart      | ❌                                      |

## ❤️ Wishlist Management (`/api/wishlists`)

**Auth Required:** ✅

| Method   | Endpoint                                           | Description                  | Body/Params                                       |
| -------- | -------------------------------------------------- | ---------------------------- | ------------------------------------------------- |
| `GET`    | `/api/wishlists`                                   | Get user's wishlists         | ❌                                                |
| `GET`    | `/api/wishlists/{wishlistId}`                      | Get wishlist by ID           | Path: `wishlistId`                                |
| `POST`   | `/api/wishlists`                                   | Create new wishlist          | Body: `WishlistCreateDto`                         |
| `PUT`    | `/api/wishlists/{wishlistId}`                      | Update wishlist              | Path: `wishlistId`, Body: `WishlistCreateDto`     |
| `DELETE` | `/api/wishlists/{wishlistId}`                      | Delete wishlist              | Path: `wishlistId`                                |
| `POST`   | `/api/wishlists/{wishlistId}/add`                  | Add product to wishlist      | Path: `wishlistId`, Body: `WishlistAddProductDto` |
| `DELETE` | `/api/wishlists/{wishlistId}/products/{productId}` | Remove product from wishlist | Path: `wishlistId`, `productId`                   |

## 🤖 AI Services (`/api/ai`)

| Method | Endpoint                       | Description                          | Auth Required     | Body/Params                                              |
| ------ | ------------------------------ | ------------------------------------ | ----------------- | -------------------------------------------------------- |
| `POST` | `/api/ai/generate-description` | Generate/improve product description | ✅ (SELLER/ADMIN) | Body: `ProductDescriptionRequestDto`, Query: `productId` |
| `GET`  | `/api/ai/health`               | Check AI service health              | ❌                | ❌                                                       |

## 💬 Chatbot (`/api/chatbot`)

**Auth Required:** ✅ (USER/ADMIN)

| Method | Endpoint            | Description              | Body/Params             |
| ------ | ------------------- | ------------------------ | ----------------------- |
| `POST` | `/api/chatbot/chat` | Send message to chatbot  | Body: `ChatRequestDto`  |
| `GET`  | `/api/chatbot/chat` | Get conversation history | Query: `conversationId` |

## 📊 Data Types & DTOs

### Authentication DTOs

-   **UserAuthDto**: `username`, `email`, `password`, `firstName`, `lastName`, `role`
-   **LoginDto**: `username`, `password`
-   **ChangePasswordDto**: `oldPassword`, `newPassword`

### Product DTOs

-   **ProductCreateDto**: `name`, `description`, `sku`, `price`, `stock`, `brandId`, `sellerId`, `categoryId`
-   **ProductDto**: Full product information with nested data
-   **ProductFilterDto**: `name`, `categoryId`, `brandId`, `minPrice`, `maxPrice`, `isActive`, `isFeatured`

### Cart & Wishlist DTOs

-   **CartItemCreateDto**: `productId`, `variantId`, `quantity`
-   **WishlistCreateDto**: `name`
-   **WishlistAddProductDto**: `productId`

### Image DTOs

-   **ProductImageCreateDto**: `productId`, `imageUrl`, `altText`, `sortOrder`
-   **VariantImageCreateDto**: `variantId`, `imageUrl`, `altText`, `sortOrder`

## 🔒 Authentication Notes

-   **JWT Token**: Include in `Authorization` header as `Bearer <token>`
-   **Roles**: `USER`, `SELLER`, `ADMIN`
-   **Anonymous Access**: Most GET endpoints for browsing products/categories
-   **Authenticated Access**: Cart, wishlist, user profile management
-   **Role-based Access**: Admin panel, product creation (SELLER/ADMIN)

## 📄 Response Formats

### Success Response

```json
{
  "data": {...},
  "timestamp": "2024-01-01T12:00:00",
  "status": "success"
}
```

### Paginated Response

```json
{
  "content": [...],
  "pageable": {...},
  "totalElements": 100,
  "totalPages": 10,
  "first": true,
  "last": false
}
```

### Error Response

```json
{
    "error": "Error message",
    "message": "Detailed error description",
    "timestamp": "2024-01-01T12:00:00",
    "status": 400
}
```

---

**Total Endpoints:** 70+ endpoints across 13 controllers  
**Authentication:** JWT-based with role-based access control  
**File Uploads:** S3-integrated image management  
**AI Integration:** Ollama-powered chatbot and product description generation  
**Database:** PostgreSQL with full CRUD operations
