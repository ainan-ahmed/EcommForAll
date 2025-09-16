# Complete E-commerce Dataset Documentation

## Overview
This dataset contains 14 CSV files with over 7,000 records representing a complete e-commerce system. All entities have proper UUID relationships and realistic data suitable for development, testing, or demonstration purposes.

## Dataset Summary
- **Total Records**: 7,135+ across all tables
- **Users**: 500 (85 sellers, 6 admins, 409 customers)
- **Products**: 229 with variants, images, and reviews
- **Orders**: 602 orders with 2,140 order items
- **Categories**: 56 hierarchical categories
- **Brands**: 18 brands (14 active)

## File Descriptions

### 1. users.csv
**Records**: 500  
**Description**: User accounts with different roles
**Key Fields**:
- `id` (UUID): Primary key
- `firstName`, `lastName`: User names
- `email`, `username`: Authentication fields
- `role`: USER | SELLER | ADMIN
- `createdAt`, `updatedAt`: Timestamps

### 2. categories.csv
**Records**: 56  
**Description**: Hierarchical product categories
**Key Fields**:
- `id` (UUID): Primary key
- `name`: Category name
- `slug`, `fullSlug`: URL-friendly identifiers
- `parent` (UUID): Parent category reference (null for root categories)
- `productCount`: Number of products (calculated)

**Hierarchy**: 8 root categories, 48 subcategories

### 3. brands.csv
**Records**: 18  
**Description**: Product brands
**Key Fields**:
- `id` (UUID): Primary key
- `name`: Brand name
- `description`: Brand description
- `website`: Brand website URL
- `isActive`: Active status (75% active)
- `imageUrl`: Brand logo URL

### 4. products.csv
**Records**: 229  
**Description**: Main product catalog
**Key Fields**:
- `id` (UUID): Primary key
- `name`: Product name
- `description`: Product description
- `sku`: Stock keeping unit
- `price`: Base price
- `stock`: Inventory count
- `hasVariants`: Whether product has variants
- `isActive`: Active status (75% active)
- `isFeatured`: Featured status (20% featured)
- `brandId` (UUID): Foreign key to brands
- `categoryId` (UUID): Foreign key to categories
- `sellerId` (UUID): Foreign key to users (sellers)

### 5. product_variants.csv
**Records**: 154  
**Description**: Product variants (color, size combinations)
**Key Fields**:
- `id` (UUID): Primary key
- `productId` (UUID): Foreign key to products
- `attributeValues`: JSON string with variant attributes
- `sku`: Variant SKU
- `price`: Variant price
- `stock`: Variant inventory

### 6. product_images.csv
**Records**: 563  
**Description**: Product images
**Key Fields**:
- `id` (UUID): Primary key
- `productId` (UUID): Foreign key to products
- `imageUrl`: Image URL
- `altText`: Alt text for accessibility
- `sortOrder`: Display order

### 7. variant_images.csv
**Records**: 299  
**Description**: Variant-specific images
**Key Fields**:
- `id` (UUID): Primary key
- `variantId` (UUID): Foreign key to product_variants
- `imageUrl`: Image URL
- `altText`: Alt text
- `sortOrder`: Display order

### 8. reviews.csv
**Records**: 414  
**Description**: Product reviews (40% of products have reviews)
**Key Fields**:
- `id` (UUID): Primary key
- `productId` (UUID): Foreign key to products
- `userId` (UUID): Foreign key to users
- `rating`: 1-5 star rating (weighted towards higher ratings)
- `title`: Review title
- `comment`: Review text
- `createdAt`, `updatedAt`: Timestamps

### 9. orders.csv
**Records**: 602  
**Description**: Customer orders
**Key Fields**:
- `id` (UUID): Primary key
- `userId` (UUID): Foreign key to users
- `status`: PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED | RETURNED | REFUNDED
- `paymentStatus`: PENDING | PROCESSING | COMPLETED | FAILED | REFUNDED
- `subtotal`, `tax`, `shippingCost`, `totalAmount`: Pricing fields
- `shippingAddress`, `billingAddress`: Addresses
- `paymentMethod`: Payment method used
- `trackingNumber`, `shippingCarrier`: Shipping info
- Various timestamp fields for order lifecycle

### 10. order_items.csv
**Records**: 2,140  
**Description**: Items within orders
**Key Fields**:
- `id` (UUID): Primary key
- `orderId` (UUID): Foreign key to orders
- `productId` (UUID): Foreign key to products
- `variantId` (UUID): Foreign key to product_variants (nullable)
- `productName`, `productDescription`: Product info snapshot
- `sku`: Product/variant SKU
- `price`: Price at time of order
- `quantity`: Quantity ordered
- `subtotal`: Line item total

### 11. wishlists.csv
**Records**: 294  
**Description**: User wishlists
**Key Fields**:
- `id` (UUID): Primary key
- `name`: Wishlist name
- `userId` (UUID): Foreign key to users
- `createdAt`, `updatedAt`: Timestamps

### 12. wishlist_products.csv
**Records**: 1,947  
**Description**: Products in wishlists (many-to-many relationship)
**Key Fields**:
- `wishlistId` (UUID): Foreign key to wishlists
- `productId` (UUID): Foreign key to products

### 13. shopping_carts.csv
**Records**: 180  
**Description**: Active shopping carts
**Key Fields**:
- `id` (UUID): Primary key
- `userId` (UUID): Foreign key to users
- `totalItems`: Total item count
- `totalAmount`: Cart total value
- `status`: Cart status (active/inactive)
- `createdAt`, `updatedAt`: Timestamps

### 14. cart_items.csv
**Records**: 731  
**Description**: Items in shopping carts
**Key Fields**:
- `id` (UUID): Primary key
- `userId` (UUID): Foreign key to users
- `productId` (UUID): Foreign key to products
- `variantId` (UUID): Foreign key to product_variants (nullable)
- `productName`: Product name
- `sku`: Product/variant SKU
- `unitPrice`: Price per unit
- `quantity`: Quantity in cart
- `totalPrice`: Line total
- `inStock`: Stock availability

## Relationships

### Primary Relationships
- **Users** → Products (via sellerId)
- **Categories** → Products (hierarchical categories)
- **Brands** → Products
- **Products** → Product Variants (1:many)
- **Products** → Product Images (1:many)
- **Product Variants** → Variant Images (1:many)
- **Products** → Reviews (1:many)
- **Users** → Reviews (1:many)

### Order Relationships
- **Users** → Orders (1:many)
- **Orders** → Order Items (1:many)
- **Products** → Order Items (1:many)
- **Product Variants** → Order Items (1:many, nullable)

### Wishlist Relationships
- **Users** → Wishlists (1:many)
- **Wishlists** ↔ Products (many:many via wishlist_products)

### Cart Relationships
- **Users** → Shopping Carts (1:1 typically)
- **Users** → Cart Items (1:many)
- **Products** → Cart Items (1:many)
- **Product Variants** → Cart Items (1:many, nullable)

## Data Quality Features

- **Realistic Data**: Names, addresses, product descriptions, and reviews
- **Proper Relationships**: All foreign keys maintain referential integrity
- **Business Logic**: 
  - Free shipping over $50
  - 8% tax rate
  - Weighted ratings (bias toward positive reviews)
  - Proper order status progression
- **Temporal Consistency**: Created/updated timestamps maintain logical order
- **Variant Logic**: Products with variants have proper attribute combinations
- **Stock Management**: Realistic inventory levels

## Usage Notes

1. **UUID Format**: All IDs use standard UUID v4 format
2. **Timestamps**: ISO 8601 format with microseconds and 'Z' suffix
3. **JSON Fields**: `attributeValues` in variants contains escaped JSON
4. **Price Precision**: All prices rounded to 2 decimal places
5. **Referential Integrity**: All foreign key relationships are valid

This dataset is ready for immediate use in development, testing, or demonstration environments.