#!/usr/bin/env python3
"""
seed_ecommforall.py - Minimal E-commerce Data Seeder

Usage:
    python seed_ecommforall.py --help

Flow Order:
    1. Login (get JWT token)
    2. Create Categories
    3. Create Brands
    4. Create Users (including Sellers)
    5. Create Products (requires categories, brands, sellers)
    6. Upload Product Images (requires products)
    7. Create Product Variants (requires products)
"""

import os
import sys
import argparse
import random
import logging
from typing import List, Dict, Optional, Any
import requests
from faker import Faker

# Configuration
DEFAULT_BASE_URL = "http://localhost:8080/api"
DEFAULT_ADMIN_USER = "admin"
DEFAULT_ADMIN_PASS = "password"

parser = argparse.ArgumentParser(description="Minimal E-commerce Data Seeder")
parser.add_argument("--base-url", default=DEFAULT_BASE_URL, help="Base API URL")
parser.add_argument("--admin-user", default=DEFAULT_ADMIN_USER, help="Admin username")
parser.add_argument("--admin-pass", default=DEFAULT_ADMIN_PASS, help="Admin password")
parser.add_argument(
    "--categories", type=int, default=15, help="Number of categories to create"
)
parser.add_argument("--brands", type=int, default=10, help="Number of brands to create")
parser.add_argument("--users", type=int, default=5, help="Number of users to create")
parser.add_argument(
    "--products", type=int, default=100, help="Number of products to create"
)
parser.add_argument(
    "--dry-run",
    action="store_true",
    help="Don't POST anything; show intended actions only",
)
parser.add_argument("--verbose", "-v", action="store_true", help="Verbose logging")
args = parser.parse_args()

# Logging setup
log_level = logging.DEBUG if args.verbose else logging.INFO
logging.basicConfig(level=log_level, format="%(asctime)s %(levelname)s: %(message)s")
logger = logging.getLogger("ecomm-seeder")

# Initialize
session = requests.Session()
faker = Faker()
random.seed(42)
Faker.seed(42)
BASE = args.base_url.rstrip("/")

# Global storage for created entities
created_categories = []
created_brands = []
created_users = []
created_products = []

# ========================================
# STEP 1: AUTHENTICATION
# ========================================


def login_get_jwt(username: str, password: str) -> str:
    """Login and get JWT token"""
    url = f"{BASE}/auth/login"
    payload = {"username": username, "password": password}
    logger.info("🔐 STEP 1: Logging in as '%s'...", username)

    if args.dry_run:
        logger.info("[DRY-RUN] POST %s -> %s", url, payload)
        return "DRY_RUN_TOKEN"

    resp = session.post(url, json=payload, timeout=15)
    resp.raise_for_status()
    resp_data = resp.json()

    # Extract token from various possible response formats
    token = None
    if "token" in resp_data:
        token = resp_data["token"]
    elif "data" in resp_data and "token" in resp_data["data"]:
        token = resp_data["data"]["token"]
    elif "accessToken" in resp_data:
        token = resp_data["accessToken"]

    if not token:
        logger.error("Login response: %s", resp_data)
        raise RuntimeError("Could not extract JWT token from login response")

    logger.info("✅ Login successful, token length=%d", len(token))
    return token


# ========================================
# STEP 2: CREATE CATEGORIES
# ========================================


def create_category(
    name: str, description, parent_id: Optional[int], headers: Dict[str, str]
) -> Dict[str, Any]:
    """Create a category"""
    url = f"{BASE}/categories"
    payload = {"name": name, "description": description}
    if parent_id:
        payload["parentId"] = parent_id

    logger.info("📁 Creating category: %s", name)

    if args.dry_run:
        fake_id = f"cat_{len(created_categories) + 1}"
        return {"id": fake_id, "name": name, "parentId": parent_id}

    resp = session.post(url, json=payload, headers=headers, timeout=15)
    resp.raise_for_status()
    return resp.json().get("data") or resp.json()


def seed_categories(headers: Dict[str, str]):
    """STEP 2: Create all categories"""
    logger.info("🏗️  STEP 2: Creating %d categories...", args.categories)

    # Create root categories first
    num_root = max(1, args.categories // 3)
    for i in range(num_root):
        name = faker.word().capitalize()
        description = faker.paragraph(nb_sentences=3)
        try:
            cat = create_category(name, description, parent_id=None, headers=headers)
            created_categories.append(cat)
            logger.info(
                "  ✅ Root category: %s (id=%s)", cat.get("name"), cat.get("id")
            )
        except Exception as e:
            logger.error("  ❌ Failed creating root category '%s': %s", name, e)

    # Create child categories
    for i in range(len(created_categories), args.categories):
        parent = random.choice(created_categories)
        name = f"{faker.word().capitalize()}{i}"
        description = faker.paragraph(nb_sentences=3)
        try:
            cat = create_category(
                name, description, parent_id=parent.get("id"), headers=headers
            )
            created_categories.append(cat)
            logger.info(
                "  ✅ Child category: %s -> parent: %s",
                cat.get("name"),
                parent.get("name"),
            )
        except Exception as e:
            logger.error("  ❌ Failed creating child category '%s': %s", name, e)


# ========================================
# STEP 3: CREATE BRANDS
# ========================================


def create_brand(
    name: str, description: str, headers: Dict[str, str]
) -> Dict[str, Any]:
    """Create a brand"""
    url = f"{BASE}/brands"
    payload = {"name": name, "description": description}

    logger.info("🏷️  Creating brand: %s", name)

    if args.dry_run:
        fake_id = f"brand_{len(created_brands) + 1}"
        return {"id": fake_id, "name": name}

    resp = session.post(url, json=payload, headers=headers, timeout=15)
    resp.raise_for_status()
    return resp.json().get("data") or resp.json()


def seed_brands(headers: Dict[str, str]):
    """STEP 3: Create all brands"""
    logger.info("🏗️  STEP 3: Creating %d brands...", args.brands)

    for i in range(args.brands):
        name = f"{faker.company()} {i + 1}"
        description = faker.text(max_nb_chars=100)
        try:
            brand = create_brand(name, description, headers)
            created_brands.append(brand)
            logger.info("  ✅ Brand: %s (id=%s)", brand.get("name"), brand.get("id"))
        except Exception as e:
            logger.error("  ❌ Failed creating brand '%s': %s", name, e)


# ========================================
# STEP 4: CREATE USERS
# ========================================


def register_user(user_payload: Dict[str, Any]) -> Dict[str, Any]:
    """Register a user"""
    url = f"{BASE}/auth/register"
    username = user_payload.get("username")
    role = user_payload.get("role", "USER")

    logger.info("👤 Registering %s: %s", role, username)

    if args.dry_run:
        fake_id = f"user_{len(created_users) + 1}"
        return {"id": fake_id, **user_payload}

    resp = session.post(url, json=user_payload, timeout=15)
    resp.raise_for_status()
    return resp.json().get("data") or resp.json()


def seed_users():
    """STEP 4: Create all users"""
    logger.info("🏗️  STEP 4: Creating %d users...", args.users)

    # Create sellers (10% of users)
    num_sellers = max(1, args.users // 10)
    for i in range(num_sellers):
        username = f"seller_{i + 1}"
        payload = {
            "username": username,
            "email": f"{username}@dev.local",
            "password": "passwordSeller",
            "firstName": faker.first_name(),
            "lastName": faker.last_name(),
            "role": "SELLER",
        }
        try:
            user = register_user(payload)
            created_users.append(user)
            logger.info("  ✅ Seller: %s (id=%s)", user.get("username"), user.get("id"))
        except Exception as e:
            logger.error("  ❌ Failed creating seller %s: %s", username, e)

    # Create regular users
    for i in range(num_sellers, args.users):
        username = f"user_{i + 1}"
        payload = {
            "username": username,
            "email": f"{username}@dev.local",
            "password": "passwordUser",
            "firstName": faker.first_name(),
            "lastName": faker.last_name(),
            "role": "USER",
        }
        try:
            user = register_user(payload)
            created_users.append(user)
            logger.info("  ✅ User: %s (id=%s)", user.get("username"), user.get("id"))
        except Exception as e:
            logger.error("  ❌ Failed creating user %s: %s", username, e)


# ========================================
# STEP 5: CREATE PRODUCTS
# ========================================


def create_product(
    product_payload: Dict[str, Any], headers: Dict[str, str]
) -> Dict[str, Any]:
    """Create a product"""
    url = f"{BASE}/products"
    name = product_payload.get("name")

    logger.info("🛍️  Creating product: %s", name)

    if args.dry_run:
        fake_id = f"prod_{len(created_products) + 1}"
        return {"id": fake_id, **product_payload}

    resp = session.post(url, json=product_payload, headers=headers, timeout=20)
    resp.raise_for_status()
    return resp.json().get("data") or resp.json()


def seed_products(headers: Dict[str, str]):
    """STEP 5: Create all products (requires categories, brands, users)"""
    logger.info("🏗️  STEP 5: Creating %d products...", args.products)

    # Get seller IDs
    seller_ids = [u.get("id") for u in created_users if u.get("role") == "SELLER"]
    if not seller_ids:
        logger.error("❌ No sellers found! Cannot create products.")
        return

    for i in range(args.products):
        name = faker.sentence(nb_words=3).rstrip(".")
        price = round(random.uniform(10.0, 500.0), 2)
        stock = random.randint(1, 100)

        # Randomly assign brand, category, seller
        brand = random.choice(created_brands)
        category = random.choice(created_categories)
        seller_id = random.choice(seller_ids)

        payload = {
            "name": name,
            "description": faker.paragraph(nb_sentences=2),
            "price": price,
            "stock": stock,
            "brandId": brand.get("id"),
            "categoryId": category.get("id"),
            "sellerId": seller_id,
            "isActive": True,
            "isFeatured": random.choice([True, False]),
        }

        try:
            product = create_product(payload, headers)
            created_products.append(product)
            logger.info(
                "  ✅ Product: %s (brand=%s, category=%s, price=%.2f)",
                product.get("name"),
                brand.get("name"),
                category.get("name"),
                price,
            )
        except Exception as e:
            logger.error("  ❌ Failed creating product '%s': %s", name, e)


# ========================================
# STEP 6: UPLOAD PRODUCT IMAGES (Fetches products from backend)
# ========================================


def fetch_all_products(headers: Dict[str, str]) -> List[Dict[str, Any]]:
    """Fetch all products from the backend API"""
    url = f"{BASE}/products"

    logger.info("🔍 Fetching all products from backend...")

    if args.dry_run:
        # Return mock data for dry run
        return [
            {"id": "prod_1", "name": "Sample Product 1"},
            {"id": "prod_2", "name": "Sample Product 2"},
        ]

    try:
        resp = session.get(url, headers=headers, timeout=30)
        resp.raise_for_status()

        data = resp.json()
        logger.debug("Raw API response type: %s", type(data))
        logger.debug(
            "Raw API response keys: %s",
            data.keys() if isinstance(data, dict) else "Not a dict",
        )

        # Handle different response formats
        products = None

        if isinstance(data, list):
            # Direct list of products
            products = data
        elif isinstance(data, dict):
            # Try common nested structures
            if "data" in data:
                products = data["data"]
            elif "content" in data:
                products = data["content"]  # Spring Boot Page response
            elif "products" in data:
                products = data["products"]
            elif "items" in data:
                products = data["items"]
            else:
                # Log the structure for debugging
                logger.debug("Dict response structure: %s", list(data.keys()))
                # Try to find any list in the response
                for key, value in data.items():
                    if isinstance(value, list):
                        logger.info(
                            "Found list under key '%s', using it as products", key
                        )
                        products = value
                        break

        if products is None:
            logger.error("❌ Could not find products list in response: %s", data)
            return []

        if isinstance(products, list):
            logger.info("✅ Fetched %d products from backend", len(products))
            return products
        else:
            logger.error("❌ Products data is not a list: %s", type(products))
            return []

    except Exception as e:
        logger.error("❌ Failed to fetch products: %s", e)
        return []


def fetch_product_variants(
    product_id: str, headers: Dict[str, str]
) -> List[Dict[str, Any]]:
    """Fetch all variants for a specific product"""
    url = f"{BASE}/products/{product_id}/variants"

    logger.debug("🔍 Fetching variants for product %s...", product_id)

    if args.dry_run:
        return [
            {
                "id": f"var_1_{product_id}",
                "attributeValues": {"color": "Red", "size": "M"},
            },
            {
                "id": f"var_2_{product_id}",
                "attributeValues": {"color": "Blue", "size": "L"},
            },
        ]

    try:
        resp = session.get(url, headers=headers, timeout=15)
        resp.raise_for_status()

        data = resp.json()
        logger.debug(
            "Variants response type: %s for product %s", type(data), product_id
        )

        # Handle different response formats
        variants = None

        if isinstance(data, list):
            # Direct list of variants
            variants = data
        elif isinstance(data, dict):
            # Try common nested structures
            if "data" in data:
                variants = data["data"]
            elif "content" in data:
                variants = data["content"]  # Spring Boot Page response
            elif "variants" in data:
                variants = data["variants"]
            elif "items" in data:
                variants = data["items"]
            else:
                # Try to find any list in the response
                for key, value in data.items():
                    if isinstance(value, list):
                        logger.debug("Found variants list under key '%s'", key)
                        variants = value
                        break

        if variants is None:
            logger.debug("  ⚠️  No variants data found for product %s", product_id)
            return []

        if isinstance(variants, list):
            logger.debug(
                "  ✅ Found %d variants for product %s", len(variants), product_id
            )
            return variants
        else:
            logger.debug(
                "  ⚠️  Variants data is not a list for product %s: %s",
                product_id,
                type(variants),
            )
            return []

    except Exception as e:
        logger.error("  ❌ Failed to fetch variants for product %s: %s", product_id, e)
        return []


def generate_placeholder_image() -> bytes:
    """Generate simple placeholder image as bytes"""
    # Simple placeholder - just return minimal PNG bytes
    # In a real implementation, you'd use PIL to generate actual images
    return b"PLACEHOLDER_IMAGE_BYTES"


def upload_product_image(
    product_id: str, filename: str, headers: Dict[str, str]
) -> Dict[str, Any]:
    """Upload image to a product"""
    url = f"{BASE}/products/{product_id}/images"

    logger.info("🖼️  Uploading product image: %s", filename)

    if args.dry_run:
        fake_id = f"img_{random.randint(1000, 9999)}"
        return {
            "id": fake_id,
            "imageUrl": f"https://example.com/{filename}",
            "altText": filename,
        }

    # Generate placeholder image
    image_bytes = generate_placeholder_image()
    files = {"file": (filename, image_bytes, "image/png")}
    data = {"altText": f"Product image {filename}", "sortOrder": "0"}

    resp = session.post(url, files=files, data=data, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.json().get("data") or resp.json()


def upload_variant_image(
    product_id: str, variant_id: str, filename: str, headers: Dict[str, str]
) -> Dict[str, Any]:
    """Upload image to a product variant"""
    url = f"{BASE}/products/{product_id}/variants/{variant_id}/images"

    logger.info("🖼️  Uploading variant image: %s", filename)

    if args.dry_run:
        fake_id = f"vimg_{random.randint(1000, 9999)}"
        return {
            "id": fake_id,
            "imageUrl": f"https://example.com/{filename}",
            "altText": filename,
        }

    # Generate placeholder image
    image_bytes = generate_placeholder_image()
    files = {"file": (filename, image_bytes, "image/png")}
    data = {"altText": f"Variant image {filename}", "sortOrder": "0"}

    resp = session.post(url, files=files, data=data, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.json().get("data") or resp.json()


def seed_product_images(headers: Dict[str, str]):
    """STEP 6: Upload images for products (fetches products from backend)"""
    logger.info("🏗️  STEP 6: Uploading images for products...")

    # Fetch all products from backend instead of using created_products
    products = fetch_all_products(headers)

    if not products:
        logger.warning("⚠️  No products found in backend. Skipping image upload.")
        return

    total_images_uploaded = 0

    for product in products:
        product_id = product.get("id")
        product_name = product.get("name", f"product_{product_id}")

        if not product_id:
            logger.warning("⚠️  Product missing ID, skipping: %s", product)
            continue

        # Upload 1-3 images per product
        num_images = random.randint(1, 3)
        for i in range(num_images):
            # Clean filename
            clean_name = product_name.replace(" ", "_").replace("/", "_").lower()[:20]
            filename = f"{clean_name}_{i + 1}.png"

            try:
                image = upload_product_image(product_id, filename, headers)
                total_images_uploaded += 1
                logger.info(
                    "  ✅ Product image: %s -> %s",
                    product_name,
                    image.get("imageUrl", "uploaded"),
                )
            except Exception as e:
                logger.error(
                    "  ❌ Failed uploading image for product '%s': %s", product_name, e
                )

    logger.info(
        "📊 Uploaded %d images for %d products", total_images_uploaded, len(products)
    )


def seed_variant_images(headers: Dict[str, str]):
    """STEP 6B: Upload images for product variants (fetches data from backend)"""
    logger.info("🏗️  STEP 6B: Uploading images for product variants...")

    # Fetch all products from backend
    products = fetch_all_products(headers)

    if not products:
        logger.warning(
            "⚠️  No products found in backend. Skipping variant image upload."
        )
        return

    total_variant_images = 0

    for product in products:
        product_id = product.get("id")
        product_name = product.get("name", f"product_{product_id}")

        if not product_id:
            continue

        # Fetch variants for this product
        variants = fetch_product_variants(product_id, headers)

        if not variants:
            logger.debug("  ⚠️  No variants found for product: %s", product_name)
            continue

        for variant in variants:
            variant_id = variant.get("id")
            attribute_values = variant.get("attributeValues", {})

            if not variant_id:
                continue

            # Upload 1-2 images per variant
            num_images = random.randint(1, 2)
            for i in range(num_images):
                # Create filename from product name and attributes
                clean_name = (
                    product_name.replace(" ", "_").replace("/", "_").lower()[:15]
                )

                # Add attribute info to filename
                attr_str = "_".join(
                    [f"{k}{v}" for k, v in list(attribute_values.items())[:2]]
                )
                attr_str = attr_str.replace(" ", "").replace("/", "").lower()[:15]

                filename = f"{clean_name}_{attr_str}_{i + 1}.png"

                try:
                    image = upload_variant_image(
                        product_id, variant_id, filename, headers
                    )
                    total_variant_images += 1

                    # Create attribute display string
                    attr_display = ", ".join(
                        [f"{k}={v}" for k, v in attribute_values.items()]
                    )

                    logger.info(
                        "  ✅ Variant image: %s (%s) -> %s",
                        product_name,
                        attr_display,
                        image.get("imageUrl", "uploaded"),
                    )
                except Exception as e:
                    logger.error(
                        "  ❌ Failed uploading variant image for '%s': %s",
                        product_name,
                        e,
                    )

    logger.info("📊 Uploaded %d images for variants", total_variant_images)


# ========================================
# STEP 7: CREATE PRODUCT VARIANTS
# ========================================


def generate_attribute_values(product_name: str) -> Dict[str, str]:
    """Generate realistic attribute values based on product type"""
    attributes = {}

    # Determine product category based on name keywords
    name_lower = product_name.lower()

    if any(
        word in name_lower
        for word in ["shirt", "clothing", "apparel", "dress", "jacket"]
    ):
        # Clothing attributes
        attributes["color"] = random.choice(
            ["Red", "Blue", "Black", "White", "Green", "Yellow", "Gray", "Navy"]
        )
        attributes["size"] = random.choice(["XS", "S", "M", "L", "XL", "XXL"])

    elif any(
        word in name_lower
        for word in ["phone", "mobile", "smartphone", "iphone", "android"]
    ):
        # Phone attributes
        attributes["color"] = random.choice(
            ["Space Gray", "Silver", "Gold", "Rose Gold", "Midnight", "Blue"]
        )
        attributes["storage"] = random.choice(
            ["64GB", "128GB", "256GB", "512GB", "1TB"]
        )

    elif any(word in name_lower for word in ["laptop", "computer", "macbook", "pc"]):
        # Computer attributes
        attributes["color"] = random.choice(["Silver", "Space Gray", "Black", "White"])
        attributes["ram"] = random.choice(["8GB", "16GB", "32GB", "64GB"])
        attributes["storage"] = random.choice(
            ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"]
        )

    elif any(word in name_lower for word in ["shoe", "sneaker", "boot", "sandal"]):
        # Shoe attributes
        attributes["color"] = random.choice(
            ["Black", "White", "Brown", "Navy", "Red", "Gray"]
        )
        attributes["size"] = random.choice(
            ["7", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"]
        )

    elif any(word in name_lower for word in ["watch", "timepiece"]):
        # Watch attributes
        attributes["color"] = random.choice(
            ["Silver", "Gold", "Black", "Rose Gold", "Bronze"]
        )
        attributes["band"] = random.choice(["Leather", "Metal", "Rubber", "Nylon"])

    else:
        # Default attributes for other products
        attributes["color"] = random.choice(
            ["Black", "White", "Silver", "Gray", "Blue", "Red"]
        )
        attributes["variant"] = random.choice(
            ["Standard", "Premium", "Deluxe", "Basic"]
        )

    return attributes


def create_variant(
    product_id: str, variant_payload: Dict[str, Any], headers: Dict[str, str]
) -> Dict[str, Any]:
    """Create a product variant"""
    url = f"{BASE}/products/{product_id}/variants"
    attr_values = variant_payload.get("attributeValues", {})
    attr_display = ", ".join([f"{k}={v}" for k, v in attr_values.items()])

    logger.info("🔄 Creating variant with attributes: %s", attr_display)

    if args.dry_run:
        fake_id = f"var_{random.randint(1000, 9999)}"
        return {"id": fake_id, **variant_payload}

    resp = session.post(url, json=variant_payload, headers=headers, timeout=15)
    resp.raise_for_status()
    return resp.json().get("data") or resp.json()


def seed_product_variants(headers: Dict[str, str]):
    """STEP 7: Create variants for products (requires products)"""
    logger.info("🏗️  STEP 7: Creating variants for products...")

    if not created_products:
        logger.warning("⚠️  No products found. Skipping variant creation.")
        return

    total_variants_created = 0

    for product in created_products:
        product_id = product.get("id")
        product_name = product.get("name", "Unknown Product")
        base_price = float(product.get("price", 50.0))

        # Create 1-3 variants per product
        num_variants = random.randint(1, 3)

        for i in range(num_variants):
            # Generate attribute values based on product type
            attribute_values = generate_attribute_values(product_name)

            # Calculate variant price (±20% of base price)
            price_variation = random.uniform(-0.20, 0.20)
            variant_price = round(base_price * (1 + price_variation), 2)
            variant_stock = random.randint(0, 50)

            payload = {
                "productId": product_id,  # Fixed: changed from "product_id" to "productId"
                "attributeValues": attribute_values,  # Required field
                "price": variant_price,
                "stock": variant_stock,
            }

            try:
                variant = create_variant(product_id, payload, headers)
                total_variants_created += 1

                # Create attribute display string for logging
                attr_display = ", ".join(
                    [f"{k}={v}" for k, v in attribute_values.items()]
                )

                logger.info(
                    "  ✅ Variant: price=%.2f, stock=%d, attributes: %s",
                    variant_price,
                    variant_stock,
                    attr_display,
                )
            except Exception as e:
                logger.error(
                    "  ❌ Failed creating variant for product '%s': %s", product_name, e
                )

    logger.info(
        "📊 Created %d variants across %d products",
        total_variants_created,
        len(created_products),
    )


# ========================================
# MAIN EXECUTION FLOW
# ========================================


def main():
    """
    Main seeding flow - execute steps in order.
    Comment out steps you don't want to run.
    """
    logger.info("🚀 Starting E-commerce Data Seeding...")
    logger.info(
        "📊 Configuration: categories=%d, brands=%d, users=%d, products=%d",
        args.categories,
        args.brands,
        args.users,
        args.products,
    )

    # STEP 1: Authentication (Required for all other steps)
    try:
        token = login_get_jwt(args.admin_user, args.admin_pass)
        headers = {"Authorization": f"Bearer {token}"}
    except Exception as e:
        logger.error("❌ Login failed: %s", e)
        sys.exit(1)

    # # STEP 2: Create Categories (Comment out to skip)
    # seed_categories(headers)

    # # STEP 3: Create Brands (Comment out to skip)
    # seed_brands(headers)

    # # STEP 4: Create Users (Comment out to skip)
    # seed_users()

    # # STEP 5: Create Products (Requires categories, brands, users)
    # seed_products(headers)

    # STEP 6: Upload Product Images (Fetches products from backend)
    # seed_product_images(headers)

    # STEP 6B: Upload Variant Images (Fetches products and variants from backend)
    seed_variant_images(headers)

    # # STEP 7: Create Product Variants (Comment out to skip)
    # seed_product_variants(headers)

    # Summary
    logger.info("🎉 Seeding completed!")

    # Fetch final counts from backend for accurate summary
    if not args.dry_run:
        try:
            products = fetch_all_products(headers)
            logger.info("📈 Final Summary: %d products found in backend", len(products))
        except:
            logger.info("� Summary: Image upload step completed")
    else:
        logger.info("📈 Summary: Dry run completed - no actual uploads performed")


if __name__ == "__main__":
    main()
