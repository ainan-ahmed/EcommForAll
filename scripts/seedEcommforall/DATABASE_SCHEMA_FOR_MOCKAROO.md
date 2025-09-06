# EcommForAll Database Schema for Mockaroo

## Complete Table Schema with Field Specifications

### 1. **USERS** Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- ENUM: 'ADMIN', 'SELLER', 'USER'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Mockaroo Fields:**

-   `id`: UUID
-   `first_name`: First Name
-   `last_name`: Last Name
-   `username`: Username (3-50 chars, alphanumeric + underscore)
-   `email`: Email Address
-   `password`: Password (BCrypt hash - use: `$2a$12$akMKbzqNIbW41iHQPLv0AO/QvKadYkM3z2dC7d1SOhqGLjkE2Qdbi`)
-   `role`: Custom List ['ADMIN', 'SELLER', 'USER'] (weight: USER=70%, SELLER=25%, ADMIN=5%)
-   `created_at`: Date (past 2 years)
-   `updated_at`: Date (after created_at)

### 2. **BRAND** Table

```sql
CREATE TABLE brand (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    website VARCHAR(255) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Mockaroo Fields:**

-   `id`: UUID
-   `name`: Company
-   `description`: Sentences (2-3 sentences)
-   `image_url`: URL (https://example.com/brand/#{id}.jpg) - Optional (50% blank)
-   `website`: URL
-   `is_active`: Boolean (95% true)
-   `created_at`: Date (past 2 years)
-   `updated_at`: Date (after created_at)

### 3. **CATEGORY** Table

```sql
CREATE TABLE category (
    id UUID PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    parent_id UUID REFERENCES category(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Mockaroo Fields:**

-   `id`: UUID
-   `name`: Department
-   `slug`: Formula: `lower(gsub(this.name, /[^a-zA-Z0-9]/, '-'))`
-   `description`: Sentences (1-2 sentences)
-   `image_url`: URL (https://example.com/categories/#{slug}.jpg) - Optional (40% blank)
-   `parent_id`: Row Number (20% of rows should have parent_id from existing categories)
-   `created_at`: Date (past 2 years)
-   `updated_at`: Date (after created_at)

### 4. **PRODUCT** Table

```sql
CREATE TABLE product (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2),
    stock INTEGER DEFAULT 0,
    min_price DECIMAL(10,2),
    brand_id UUID NOT NULL REFERENCES brand(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    category_id UUID NOT NULL REFERENCES category(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Mockaroo Fields:**

-   `id`: UUID
-   `name`: Product Name
-   `description`: Paragraphs (2-4 sentences)
-   `sku`: Formula: `upper(gsub(this.name, /[^a-zA-Z0-9]/, '')) + "-" + random_int(100, 999)`
-   `is_active`: Boolean (95% true)
-   `is_featured`: Boolean (20% true)
-   `price`: Money (10-2000, 2 decimal places)
-   `stock`: Number (0-500)
-   `min_price`: Formula: `this.price * 0.9` (10% less than price)
-   `brand_id`: Dataset Column (from brand table)
-   `seller_id`: Dataset Column (from users where role='SELLER')
-   `category_id`: Dataset Column (from category table)
-   `created_at`: Date (past 1 year)
-   `updated_at`: Date (after created_at)

### 5. **PRODUCT_VARIANT** Table

```sql
CREATE TABLE product_variant (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES product(id),
    attribute_values JSONB NOT NULL, -- {"color":"red","size":"XL"}
    sku VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Mockaroo Fields:**

-   `id`: UUID
-   `product_id`: Dataset Column (from product table)
-   `attribute_values`: JSON Object: `{"color":"#{color}","size":"#{shirt_size}"}` or `{"color":"#{color}","storage":"#{phone_storage}"}` or `{"material":"#{material}","size":"#{shoe_size}"}`
-   `sku`: Formula: `upper(gsub(parent_product.sku, /[^a-zA-Z0-9-]/, '')) + "-VAR-" + random_int(1, 99)`
-   `price`: Money (product.price ± 20%)
-   `stock`: Number (1-100)
-   `created_at`: Date (after product created_at)
-   `updated_at`: Date (after created_at)

### 6. **PRODUCT_IMAGE** Table

```sql
CREATE TABLE product_image (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES product(id),
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Mockaroo Fields:**

-   `id`: UUID
-   `product_id`: Dataset Column (from product table)
-   `image_url`: NULL (you'll fill later)
-   `alt_text`: Formula: `parent_product.name + " - Image " + this.sort_order`
-   `sort_order`: Sequence (1,2,3...)
-   `created_at`: Date (after product created_at)

### 7. **VARIANT_IMAGE** Table

```sql
CREATE TABLE variant_image (
    id UUID PRIMARY KEY,
    variant_id UUID NOT NULL REFERENCES product_variant(id),
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Mockaroo Fields:**

-   `id`: UUID
-   `variant_id`: Dataset Column (from product_variant table)
-   `image_url`: NULL (you'll fill later)
-   `alt_text`: Formula: `parent_variant.sku + " - Image " + this.sort_order`
-   `sort_order`: Sequence (1,2,3...)
-   `created_at`: Date (after variant created_at)
-   `updated_at`: Date (after created_at)

### 8. **SHOPPING_CARTS** Table

```sql
CREATE TABLE shopping_carts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Mockaroo Fields:**

-   `id`: UUID
-   `user_id`: Dataset Column (from users table, unique)
-   `status`: Boolean (98% true)
-   `created_at`: Date (after user created_at)
-   `updated_at`: Date (after created_at)

### 9. **CART_ITEMS** Table

```sql
CREATE TABLE cart_items (
    id UUID PRIMARY KEY,
    cart_id UUID NOT NULL REFERENCES shopping_carts(id),
    product_id UUID REFERENCES product(id),
    variant_id UUID UNIQUE REFERENCES product_variant(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Mockaroo Fields:**

-   `id`: UUID
-   `cart_id`: Dataset Column (from shopping_carts table)
-   `product_id`: Dataset Column (from product table) - 60% of time
-   `variant_id`: Dataset Column (from product_variant table) - 40% of time
-   `quantity`: Number (1-10)
-   `unit_price`: Money (copy from product/variant price)
-   `created_at`: Date (after cart created_at)
-   `updated_at`: Date (after created_at)

### 10. **WISHLISTS** Table

```sql
CREATE TABLE wishlists (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Mockaroo Fields:**

-   `id`: UUID
-   `name`: Custom List ['My Favorites', 'Christmas Wishlist', 'Birthday Wishlist', 'Dream Items', 'To Buy Later']
-   `user_id`: Dataset Column (from users table)
-   `created_at`: Date (after user created_at)
-   `updated_at`: Date (after created_at)

### 11. **WISHLIST_PRODUCTS** (Junction Table)

```sql
CREATE TABLE wishlist_products (
    wishlist_id UUID REFERENCES wishlists(id),
    product_id UUID REFERENCES product(id),
    PRIMARY KEY (wishlist_id, product_id)
);
```

**Mockaroo Fields:**

-   `wishlist_id`: Dataset Column (from wishlists table)
-   `product_id`: Dataset Column (from product table)

### 12. **REVIEW** Table

```sql
CREATE TABLE review (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES product(id),
    user_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Mockaroo Fields:**

-   `id`: UUID
-   `product_id`: Dataset Column (from product table)
-   `user_id`: Dataset Column (from users table)
-   `rating`: Number (1-5, weighted: 5=40%, 4=35%, 3=15%, 2=7%, 1=3%)
-   `title`: Words (3-8 words)
-   `comment`: Sentences (1-4 sentences)
-   `is_approved`: Boolean (85% true)
-   `created_at`: Date (after product created_at)
-   `updated_at`: Date (after created_at)

## Mockaroo Generation Strategy

### **Order of Data Generation:**

1. **USERS** (1000 rows)
2. **BRAND** (20-30 rows)
3. **CATEGORY** (15-25 rows)
4. **PRODUCT** (500 rows)
5. **PRODUCT_VARIANT** (800-1200 rows - 1-3 variants per product)
6. **PRODUCT_IMAGE** (1500-2000 rows - 2-4 images per product)
7. **VARIANT_IMAGE** (800-1200 rows - 1 image per variant)
8. **SHOPPING_CARTS** (1000 rows - one per user)
9. **CART_ITEMS** (1500 rows)
10. **WISHLISTS** (1200 rows - 1-2 per user)
11. **WISHLIST_PRODUCTS** (3000 rows)
12. **REVIEW** (2000 rows)

### **Tips for Mockaroo:**

1. Use **Datasets** to maintain referential integrity between tables
2. Set **realistic percentages** for optional fields (NULL values)
3. Use **Formulas** for calculated fields (slugs, SKUs, min_price)
4. Apply **date constraints** to ensure logical chronological order
5. Export as **SQL INSERT** statements for easy import

### **Custom Lists for Realistic Data:**

-   **Categories**: Electronics, Fashion, Home & Garden, Sports, Books, Toys, Beauty, Automotive
-   **Colors**: Black, White, Red, Blue, Green, Yellow, Pink, Purple, Gray, Brown
-   **Sizes**: XS, S, M, L, XL, XXL, XXXL
-   **Materials**: Cotton, Polyester, Leather, Metal, Plastic, Wood, Glass, Ceramic

This schema will generate realistic, interconnected e-commerce data perfect for testing your Ollama-powered application!
