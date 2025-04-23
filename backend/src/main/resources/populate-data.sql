-- Users
INSERT INTO users (id, first_name, last_name, email, username, password, role, created_at) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'John', 'Doe', 'user@example.com', 'johndoe', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'USER', CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d480', 'Jane', 'Smith', 'jane@example.com', 'janesmith', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'USER', CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d481', 'Admin', 'User', 'admin@example.com', 'adminuser', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'ADMIN', CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Seller', 'One', 'seller1@example.com', 'seller1', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'SELLER', CURRENT_TIMESTAMP);

-- Brands
INSERT INTO brand (id, name, description, logo_url, website, is_active, created_at) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d483', 'TechGiant', 'Leading technology brand', 'https://example.com/logos/techgiant.jpg', 'https://techgiant.com', true, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d484', 'FashionHub', 'Trendy fashion items', 'https://example.com/logos/fashionhub.jpg', 'https://fashionhub.com', true, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d485', 'HomeEssentials', 'Quality home products', 'https://example.com/logos/homeessentials.jpg', 'https://homeessentials.com', true, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d486', 'BookWorm', 'Books for everyone', 'https://example.com/logos/bookworm.jpg', 'https://bookworm.com', true, CURRENT_TIMESTAMP);

-- Categories
INSERT INTO category (id, name, slug, description, parent_id, created_at) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d487', 'Electronics', 'electronics', 'Electronic devices and gadgets', null, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d488', 'Smartphones', 'smartphones', 'Mobile phones and accessories', 'f47ac10b-58cc-4372-a567-0e02b2c3d487', CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d489', 'Laptops', 'laptops', 'Portable computers', 'f47ac10b-58cc-4372-a567-0e02b2c3d487', CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d490', 'Clothing', 'clothing', 'Fashion and apparel', null, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d491', 'Home & Kitchen', 'home-kitchen', 'Home appliances and kitchenware', null, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d492', 'Books', 'books', 'Books and literature', null, CURRENT_TIMESTAMP);

-- Products
INSERT INTO product (id, name, description, sku, is_active, is_featured, min_price, brand_id, seller_id, category_id, created_at) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d493', 'Smartphone X', 'Latest smartphone with advanced features', 'PHONE-X-001', true, true, 899.99, 'f47ac10b-58cc-4372-a567-0e02b2c3d483', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'f47ac10b-58cc-4372-a567-0e02b2c3d488', CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d494', 'Laptop Pro', 'High-performance laptop for professionals', 'LAPTOP-PRO-001', true, true, 1399.99, 'f47ac10b-58cc-4372-a567-0e02b2c3d483', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'f47ac10b-58cc-4372-a567-0e02b2c3d489', CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d495', 'T-shirt Basic', 'Comfortable cotton t-shirt', 'TSHIRT-BASIC-001', true, false, 19.99, 'f47ac10b-58cc-4372-a567-0e02b2c3d484', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'f47ac10b-58cc-4372-a567-0e02b2c3d490', CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d496', 'Jeans Classic', 'Classic blue jeans', 'JEANS-CLASSIC-001', true, false, 39.99, 'f47ac10b-58cc-4372-a567-0e02b2c3d484', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'f47ac10b-58cc-4372-a567-0e02b2c3d490', CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d497', 'Coffee Maker', 'Automatic coffee machine', 'COFFEE-MAKER-001', true, true, 99.99, 'f47ac10b-58cc-4372-a567-0e02b2c3d485', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'f47ac10b-58cc-4372-a567-0e02b2c3d491', CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d498', 'Adventure Novel', 'Bestselling adventure novel', 'BOOK-ADV-001', true, false, 19.99, 'f47ac10b-58cc-4372-a567-0e02b2c3d486', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', 'f47ac10b-58cc-4372-a567-0e02b2c3d492', CURRENT_TIMESTAMP);

-- Product Variants
INSERT INTO product_variant (id, product_id, attribute_values, sku, price, stock, created_at) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d499', 'f47ac10b-58cc-4372-a567-0e02b2c3d493', '{"color": "Black", "storage": "128GB"}', 'PHONE-X-BLACK-128', 899.99, 50, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d500', 'f47ac10b-58cc-4372-a567-0e02b2c3d493', '{"color": "Blue", "storage": "128GB"}', 'PHONE-X-BLUE-128', 899.99, 30, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d501', 'f47ac10b-58cc-4372-a567-0e02b2c3d493', '{"color": "Black", "storage": "256GB"}', 'PHONE-X-BLACK-256', 999.99, 25, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d502', 'f47ac10b-58cc-4372-a567-0e02b2c3d494', '{"color": "Silver", "ram": "16GB"}', 'LAPTOP-PRO-SILVER-16', 1399.99, 20, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'f47ac10b-58cc-4372-a567-0e02b2c3d495', '{"color": "White", "size": "M"}', 'TSHIRT-WHITE-M', 19.99, 100, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d504', 'f47ac10b-58cc-4372-a567-0e02b2c3d495', '{"color": "Black", "size": "M"}', 'TSHIRT-BLACK-M', 19.99, 80, CURRENT_TIMESTAMP);

-- Product Images
INSERT INTO product_image (id, product_id, image_url, alt_text, sort_order, created_at) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d505', 'f47ac10b-58cc-4372-a567-0e02b2c3d493', 'https://ecommforall.s3.eu-north-1.amazonaws.com/products/smartphone_1.jpg', 'Smartphone X front view', 1, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d506', 'f47ac10b-58cc-4372-a567-0e02b2c3d493', 'https://ecommforall.s3.eu-north-1.amazonaws.com/products/smartphone_2.jpg', 'Smartphone X side view', 2, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d507', 'f47ac10b-58cc-4372-a567-0e02b2c3d494', 'https://ecommforall.s3.eu-north-1.amazonaws.com/products/laptop_1.jpg', 'Laptop Pro front view', 1, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d508', 'f47ac10b-58cc-4372-a567-0e02b2c3d495', 'https://ecommforall.s3.eu-north-1.amazonaws.com/products/tshirt_1.jpg', 'T-shirt Basic', 1, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d509', 'f47ac10b-58cc-4372-a567-0e02b2c3d496', 'https://ecommforall.s3.eu-north-1.amazonaws.com/products/jeans_1.jpg', 'Jeans Classic', 1, CURRENT_TIMESTAMP);

-- Variant Images
INSERT INTO variant_image (id, variant_id, image_url, alt_text, sort_order, created_at) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d510', 'f47ac10b-58cc-4372-a567-0e02b2c3d499', 'https://ecommforall.s3.eu-north-1.amazonaws.com/variants/phone-black-1.jpg', 'Smartphone X Black 128GB', 1, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d511', 'f47ac10b-58cc-4372-a567-0e02b2c3d500', 'https://ecommforall.s3.eu-north-1.amazonaws.com/variants/phone-blue-1.jpg', 'Smartphone X Blue 128GB', 1, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d512', 'f47ac10b-58cc-4372-a567-0e02b2c3d503', 'https://ecommforall.s3.eu-north-1.amazonaws.com/variants/tshirt-white-m.jpg', 'White T-shirt size M', 1, CURRENT_TIMESTAMP),
('f47ac10b-58cc-4372-a567-0e02b2c3d513', 'f47ac10b-58cc-4372-a567-0e02b2c3d504', 'https://ecommforall.s3.eu-north-1.amazonaws.com/variants/tshirt-black-m.jpg', 'Black T-shirt size M', 1, CURRENT_TIMESTAMP);

-- Reviews
INSERT INTO review (id, product_id, user_id, rating, title, comment, is_approved, created_at) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d514', 'f47ac10b-58cc-4372-a567-0e02b2c3d493', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 5, 'Excellent Phone', 'This smartphone exceeds all my expectations. Great camera and battery life!', true, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('f47ac10b-58cc-4372-a567-0e02b2c3d515', 'f47ac10b-58cc-4372-a567-0e02b2c3d494', 'f47ac10b-58cc-4372-a567-0e02b2c3d480', 4, 'Good but not perfect', 'Great laptop but battery life could be better', true, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('f47ac10b-58cc-4372-a567-0e02b2c3d516', 'f47ac10b-58cc-4372-a567-0e02b2c3d495', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 5, 'Perfect fit', 'Very comfortable t-shirt, great quality', true, CURRENT_TIMESTAMP - INTERVAL '5 days');