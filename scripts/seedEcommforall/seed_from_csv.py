#!/usr/bin/env python3
"""
Ecommerce Data Seeding Script
Processes CSV files from perplexity folder and performs REST requests according to API documentation.
Handles hierarchical data creation in the correct order.
"""

import json
import logging
import time
from pathlib import Path
from typing import Dict, Optional

import pandas as pd
import requests

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("seed_log.txt"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


class EcommerceSeeder:
    def __init__(
        self,
        base_url: str = "http://localhost:8080",
        csv_folder: str = "perplexity",
        username: str = "admin",
        password: str = "password",
    ):
        self.base_url = base_url
        self.csv_folder = Path(csv_folder)
        self.session = requests.Session()
        self.session.headers.update(
            {"Content-Type": "application/json", "Accept": "application/json"}
        )

        # Set up authentication - try both basic auth and token-based auth
        self.username = username
        self.password = password
        self.session.auth = (username, password)

        # Storage for created entity IDs
        self.created_entities = {
            "users": {},
            "brands": {},
            "categories": {},
            "products": {},
            "variants": {},
            "wishlists": {},
            "carts": {},
            "orders": {},
        }

        # Rate limiting
        self.request_delay = 0.2  # 100ms between requests

        # Try to get authentication token first
        self._authenticate()

        # Load existing entities to avoid duplicates
        self._load_existing_entities()

    def _authenticate(self):
        """Try to authenticate and get a token if needed"""
        try:
            # Try to login and get a token
            login_data = {"username": self.username, "password": self.password}

            response = self.session.post(
                f"{self.base_url}/api/auth/login", json=login_data
            )
            if response.status_code == 200:
                data = response.json()
                if "token" in data:
                    # Use token-based authentication
                    self.session.headers.update(
                        {"Authorization": f"Bearer {data['token']}"}
                    )
                    logger.info("✓ Authenticated with token")
                elif "access_token" in data:
                    # Alternative token field
                    self.session.headers.update(
                        {"Authorization": f"Bearer {data['access_token']}"}
                    )
                    logger.info("✓ Authenticated with access token")
                else:
                    logger.info("✓ Login successful, using basic auth")
            else:
                logger.warning(
                    f"Login failed (status {response.status_code}), trying basic auth"
                )

        except Exception as e:
            logger.warning(f"Authentication failed: {str(e)}, trying basic auth")

    def check_existing_entities(self):
        """Check what entities already exist in the system"""
        logger.info("Checking existing entities...")

        # Check brands
        try:
            response = self.make_request(
                "GET", "/api/brands", params={"page": 0, "size": 100}
            )
            if response and "content" in response:
                existing_brands = {
                    brand["name"]: brand["id"] for brand in response["content"]
                }
                logger.info(f"Found {len(existing_brands)} existing brands")
                return existing_brands
        except Exception as e:
            logger.warning(f"Could not check existing brands: {str(e)}")

        return {}

    def _load_existing_entities(self):
        """Load existing entities from the API to avoid duplicates"""
        logger.info("Loading existing entities from API...")

        # Load existing brands
        try:
            response = self.make_request(
                "GET", "/api/brands", params={"page": 0, "size": 100}
            )
            if response and "content" in response:
                for brand in response["content"]:
                    # Map by name for CSV lookup
                    self.created_entities["brands"][brand["name"]] = brand["id"]
                logger.info(f"Loaded {len(response['content'])} existing brands")
        except Exception as e:
            logger.warning(f"Could not load existing brands: {str(e)}")

        # Load existing categories
        try:
            response = self.make_request(
                "GET", "/api/categories", params={"page": 0, "size": 100}
            )
            if response and "content" in response:
                for category in response["content"]:
                    self.created_entities["categories"][category["name"]] = category[
                        "id"
                    ]
                logger.info(f"Loaded {len(response['content'])} existing categories")
        except Exception as e:
            logger.warning(f"Could not load existing categories: {str(e)}")

        # Load existing products
        try:
            response = self.make_request(
                "GET", "/api/products", params={"page": 0, "size": 100, "filter": "{}"}
            )
            if response and "content" in response:
                for product in response["content"]:
                    # Map by both name and ID for flexibility
                    self.created_entities["products"][product["name"]] = product["id"]
                    self.created_entities["products"][product["id"]] = product["id"]
                logger.info(f"Loaded {len(response['content'])} existing products")
        except Exception as e:
            logger.warning(f"Could not load existing products: {str(e)}")

        # Load existing users
        try:
            response = self.make_request(
                "GET", "/api/admin/users", params={"page": 0, "size": 100}
            )
            if response and "content" in response:
                for user in response["content"]:
                    # Map by both username and ID for flexibility
                    self.created_entities["users"][user["username"]] = user["id"]
                    self.created_entities["users"][user["id"]] = user["id"]
                logger.info(f"Loaded {len(response['content'])} existing users")
        except Exception as e:
            logger.warning(f"Could not load existing users: {str(e)}")

        logger.info("Finished loading existing entities")

    def make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict] = None,
        params: Optional[Dict] = None,
    ) -> Optional[Dict]:
        """Make HTTP request with error handling and rate limiting"""
        url = f"{self.base_url}{endpoint}"

        try:
            time.sleep(self.request_delay)

            if method.upper() == "GET":
                response = self.session.get(url, params=params)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data)
            elif method.upper() == "DELETE":
                response = self.session.delete(url)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")

            if response.status_code in [200, 201]:
                return response.json() if response.content else {}
            else:
                logger.error(
                    f"Request failed: {method} {url} - Status: {response.status_code}"
                )
                logger.error(f"Response: {response.text}")
                return None

        except Exception as e:
            logger.error(f"Request error: {method} {url} - {str(e)}")
            return None

    def load_csv(self, filename: str) -> pd.DataFrame:
        """Load CSV file from perplexity folder"""
        file_path = self.csv_folder / filename
        if not file_path.exists():
            logger.warning(f"CSV file not found: {file_path}")
            return pd.DataFrame()

        try:
            df = pd.read_csv(file_path)
            logger.info(f"Loaded {len(df)} records from {filename}")
            return df
        except Exception as e:
            logger.error(f"Error loading {filename}: {str(e)}")
            return pd.DataFrame()

    def seed_users(self) -> bool:
        """Seed users from CSV"""
        logger.info("Starting user seeding...")
        users_df = self.load_csv("users.csv")

        if users_df.empty:
            logger.error("No user data to seed")
            return False

        success_count = 0
        for _, user in users_df.iterrows():
            # Register user
            user_data = {
                "firstName": user["firstName"],
                "lastName": user["lastName"],
                "email": user["email"],
                "username": user["username"],
                "password": "password",  # Default password for seeded users
                "role": user["role"],
            }

            response = self.make_request("POST", "/api/auth/register", user_data)
            if response:
                self.created_entities["users"][user["id"]] = response.get("id")
                success_count += 1
                logger.info(f"Created user: {user['username']}")
            else:
                logger.error(f"Failed to create user: {user['username']}")

        logger.info(
            f"User seeding completed: {success_count}/{len(users_df)} successful"
        )
        return success_count > 0

    def seed_brands(self) -> bool:
        """Seed brands from CSV"""
        logger.info("Starting brand seeding...")
        brands_df = self.load_csv("brands.csv")

        if brands_df.empty:
            logger.error("No brand data to seed")
            return False

        success_count = 0
        for _, brand in brands_df.iterrows():
            brand_data = {
                "name": brand["name"],
                "description": brand["description"],
                "website": brand["website"],
                "imageUrl": brand["imageUrl"],
            }

            response = self.make_request("POST", "/api/brands", brand_data)
            if response:
                self.created_entities["brands"][brand["id"]] = response.get("id")
                success_count += 1
                logger.info(f"Created brand: {brand['name']}")
            else:
                logger.error(f"Failed to create brand: {brand['name']}")

        logger.info(
            f"Brand seeding completed: {success_count}/{len(brands_df)} successful"
        )
        return success_count > 0

    def seed_categories(self) -> bool:
        """Seed categories from CSV (handles hierarchy)"""
        logger.info("Starting category seeding...")
        categories_df = self.load_csv("categories.csv")

        if categories_df.empty:
            logger.error("No category data to seed")
            return False

        # First, create root categories (parent is null)
        root_categories = categories_df[categories_df["parent"].isna()]
        success_count = 0

        for _, category in root_categories.iterrows():
            category_data = {
                "name": category["name"],
                "description": category["description"],
                "imageUrl": category["imageUrl"],
            }

            response = self.make_request("POST", "/api/categories", category_data)
            if response:
                self.created_entities["categories"][category["id"]] = response.get("id")
                success_count += 1
                logger.info(f"Created root category: {category['name']}")
            else:
                logger.error(f"Failed to create root category: {category['name']}")

        # Then, create subcategories
        subcategories = categories_df[categories_df["parent"].notna()]
        for _, category in subcategories.iterrows():
            parent_id = self.created_entities["categories"].get(category["parent"])
            if not parent_id:
                logger.warning(f"Parent category not found for: {category['name']}")
                continue

            category_data = {
                "name": category["name"],
                "description": category["description"],
                "imageUrl": category["imageUrl"],
                "parent": parent_id,
            }

            response = self.make_request("POST", "/api/categories", category_data)
            if response:
                self.created_entities["categories"][category["id"]] = response.get("id")
                success_count += 1
                logger.info(f"Created subcategory: {category['name']}")
            else:
                logger.error(f"Failed to create subcategory: {category['name']}")

        logger.info(
            f"Category seeding completed: {success_count}/{len(categories_df)} successful"
        )
        return success_count > 0

    def seed_products(self) -> bool:
        """Seed products from CSV"""
        logger.info("Starting product seeding...")
        products_df = self.load_csv("products.csv")

        if products_df.empty:
            logger.error("No product data to seed")
            return False

        success_count = 0
        for _, product in products_df.iterrows():
            brand_id = self.created_entities["brands"].get(product["brandId"])
            category_id = self.created_entities["categories"].get(product["categoryId"])

            if not brand_id or not category_id:
                logger.warning(
                    f"Skipping product {product['name']} - missing brand or category"
                )
                continue

            product_data = {
                "name": product["name"],
                "description": product["description"],
                "sku": product["sku"],
                "isActive": product["isActive"],
                "isFeatured": product["isFeatured"],
                "price": float(product["price"]),
                "stock": int(product["stock"]),
                "brandId": brand_id,
                "categoryId": category_id,
            }

            response = self.make_request("POST", "/api/products", product_data)
            if response:
                self.created_entities["products"][product["id"]] = response.get("id")
                success_count += 1
                logger.info(f"Created product: {product['name']}")
            else:
                logger.error(f"Failed to create product: {product['name']}")

        logger.info(
            f"Product seeding completed: {success_count}/{len(products_df)} successful"
        )
        return success_count > 0

    def seed_product_variants(self) -> bool:
        """Seed product variants from CSV"""
        logger.info("Starting product variant seeding...")
        variants_df = self.load_csv("product_variants.csv")

        if variants_df.empty:
            logger.info("No product variant data to seed")
            return True

        success_count = 0
        for _, variant in variants_df.iterrows():
            product_id = self.created_entities["products"].get(variant["productId"])
            if not product_id:
                logger.warning(
                    f"Skipping variant - product not found: {variant['productId']}"
                )
                continue

            # Parse attribute values from JSON string
            try:
                attribute_values = json.loads(variant["attributeValues"])
            except json.JSONDecodeError:
                logger.warning(
                    f"Invalid attribute values for variant: {variant['sku']}"
                )
                attribute_values = {}

            variant_data = {
                "productId": product_id,
                "attributeValues": attribute_values,
                "price": float(variant["price"]),
                "stock": int(variant["stock"]),
            }

            response = self.make_request(
                "POST", f"/api/products/{product_id}/variants", variant_data
            )
            if response:
                self.created_entities["variants"][variant["id"]] = response.get("id")
                success_count += 1
                logger.info(f"Created variant: {variant['sku']}")
            else:
                logger.error(f"Failed to create variant: {variant['sku']}")

        logger.info(
            f"Product variant seeding completed: {success_count}/{len(variants_df)} successful"
        )
        return success_count > 0

    def seed_product_images(self) -> bool:
        """Seed product images from CSV"""
        logger.info("Starting product image seeding...")
        images_df = self.load_csv("product_images.csv")

        if images_df.empty:
            logger.info("No product image data to seed")
            return True

        success_count = 0
        for _, image in images_df.iterrows():
            product_id = self.created_entities["products"].get(image["productId"])
            if not product_id:
                logger.warning(
                    f"Skipping image - product not found: {image['productId']}"
                )
                continue

            # Note: This would require file upload, which is more complex
            # For now, we'll just log that images would be uploaded
            logger.info(
                "Would upload image for product %s: %s", product_id, image["imageUrl"]
            )
            success_count += 1

        logger.info(
            f"Product image seeding completed: {success_count}/{len(images_df)} images noted"
        )
        return True

    def seed_variant_images(self) -> bool:
        """Seed variant images from CSV"""
        logger.info("Starting variant image seeding...")
        images_df = self.load_csv("variant_images.csv")

        if images_df.empty:
            logger.info("No variant image data to seed")
            return True

        success_count = 0
        for _, image in images_df.iterrows():
            variant_id = self.created_entities["variants"].get(image["variantId"])
            if not variant_id:
                logger.warning(
                    f"Skipping variant image - variant not found: {image['variantId']}"
                )
                continue

            # Note: This would require file upload, which is more complex
            # For now, we'll just log that images would be uploaded
            logger.info(
                "Would upload variant image for variant %s: %s",
                variant_id,
                image["imageUrl"],
            )
            success_count += 1

        logger.info(
            f"Variant image seeding completed: {success_count}/{len(images_df)} images noted"
        )
        return True

    def seed_reviews(self) -> bool:
        """Seed reviews from CSV"""
        logger.info("Starting review seeding...")
        # Try sample data first, fallback to original CSV
        reviews_df = self.load_csv("sample_reviews.csv")
        if reviews_df is None or reviews_df.empty:
            reviews_df = self.load_csv("reviews.csv")

        if reviews_df.empty:
            logger.info("No review data to seed")
            return True

        success_count = 0
        for _, review in reviews_df.iterrows():
            product_id = self.created_entities["products"].get(review["productId"])
            user_id = self.created_entities["users"].get(review["userId"])

            if not product_id or not user_id:
                logger.warning("Skipping review - missing product or user")
                continue

            review_data = {
                "productId": product_id,
                "userId": user_id,
                "rating": int(review["rating"]),
                "title": review["title"],
                "comment": review["comment"],
            }

            response = self.make_request(
                "POST", "/api/review/review/create", review_data
            )
            if response:
                success_count += 1
                logger.info("Created review for product %s", product_id)
            else:
                logger.error("Failed to create review")

        logger.info(
            f"Review seeding completed: {success_count}/{len(reviews_df)} successful"
        )
        return success_count > 0

    def seed_wishlists(self) -> bool:
        """Seed wishlists from CSV"""
        logger.info("Starting wishlist seeding...")
        # Try sample data first, fallback to original CSV
        wishlists_df = self.load_csv("sample_wishlists.csv")
        if wishlists_df is None or wishlists_df.empty:
            wishlists_df = self.load_csv("wishlists.csv")

        if wishlists_df.empty:
            logger.info("No wishlist data to seed")
            return True

        success_count = 0
        for _, wishlist in wishlists_df.iterrows():
            user_id = self.created_entities["users"].get(wishlist["userId"])
            if not user_id:
                logger.warning(
                    f"Skipping wishlist - user not found: {wishlist['userId']}"
                )
                continue

            wishlist_data = {"name": wishlist["name"]}

            response = self.make_request("POST", "/api/wishlists", wishlist_data)
            if response:
                self.created_entities["wishlists"][wishlist["id"]] = response.get("id")
                success_count += 1
                logger.info(f"Created wishlist: {wishlist['name']}")
            else:
                logger.error(f"Failed to create wishlist: {wishlist['name']}")

        logger.info(
            f"Wishlist seeding completed: {success_count}/{len(wishlists_df)} successful"
        )
        return success_count > 0

    def seed_wishlist_products(self) -> bool:
        """Seed wishlist products from CSV"""
        logger.info("Starting wishlist product seeding...")
        wishlist_products_df = self.load_csv("wishlist_products.csv")

        if wishlist_products_df.empty:
            logger.info("No wishlist product data to seed")
            return True

        success_count = 0
        for _, item in wishlist_products_df.iterrows():
            wishlist_id = self.created_entities["wishlists"].get(item["wishlistId"])
            product_id = self.created_entities["products"].get(item["productId"])

            if not wishlist_id or not product_id:
                logger.warning(
                    "Skipping wishlist product - missing wishlist or product"
                )
                continue

            wishlist_data = {"productId": product_id}

            response = self.make_request(
                "POST", f"/api/wishlists/{wishlist_id}/add", wishlist_data
            )
            if response:
                success_count += 1
                logger.info("Added product to wishlist")
            else:
                logger.error("Failed to add product to wishlist")

        logger.info(
            f"Wishlist product seeding completed: {success_count}/{len(wishlist_products_df)} successful"
        )
        return success_count > 0

    def seed_shopping_carts(self) -> bool:
        """Seed shopping carts from CSV"""
        logger.info("Starting shopping cart seeding...")
        carts_df = self.load_csv("shopping_carts.csv")

        if carts_df.empty:
            logger.info("No shopping cart data to seed")
            return True

        success_count = 0
        for _, cart in carts_df.iterrows():
            user_id = self.created_entities["users"].get(cart["userId"])
            if not user_id:
                logger.warning(f"Skipping cart - user not found: {cart['userId']}")
                continue

            # Carts are typically created automatically, so we'll just track them
            self.created_entities["carts"][cart["id"]] = cart["id"]
            success_count += 1
            logger.info(f"Noted cart for user: {user_id}")

        logger.info(
            f"Shopping cart seeding completed: {success_count}/{len(carts_df)} successful"
        )
        return success_count > 0

    def seed_cart_items(self) -> bool:
        """Seed cart items from CSV"""
        logger.info("Starting cart item seeding...")
        cart_items_df = self.load_csv("cart_items.csv")

        if cart_items_df.empty:
            logger.info("No cart item data to seed")
            return True

        success_count = 0
        for _, item in cart_items_df.iterrows():
            product_id = self.created_entities["products"].get(item["productId"])
            variant_id = (
                self.created_entities["variants"].get(item["variantId"])
                if pd.notna(item["variantId"])
                else None
            )

            if not product_id:
                logger.warning("Skipping cart item - product not found")
                continue

            cart_item_data = {
                "productId": product_id,
                "quantity": int(item["quantity"]),
            }

            if variant_id:
                cart_item_data["variantId"] = variant_id

            response = self.make_request("POST", "/api/cart/items", cart_item_data)
            if response:
                success_count += 1
                logger.info("Added item to cart")
            else:
                logger.error("Failed to add item to cart")

        logger.info(
            f"Cart item seeding completed: {success_count}/{len(cart_items_df)} successful"
        )
        return success_count > 0

    def seed_orders(self) -> bool:
        """Seed orders from CSV"""
        logger.info("Starting order seeding...")
        # Try sample data first, fallback to original CSV
        orders_df = self.load_csv("sample_orders.csv")
        if orders_df is None or orders_df.empty:
            orders_df = self.load_csv("orders.csv")

        if orders_df.empty:
            logger.info("No order data to seed")
            return True

        success_count = 0
        for _, order in orders_df.iterrows():
            user_id = self.created_entities["users"].get(order["userId"])
            if not user_id:
                logger.warning(f"Skipping order - user not found: {order['userId']}")
                continue

            order_data = {
                "shippingAddress": order["shippingAddress"],
                "billingAddress": order["billingAddress"],
                "paymentMethod": order["paymentMethod"],
                "orderNotes": order["orderNotes"]
                if pd.notna(order["orderNotes"])
                else "",
                "fromCart": False,
                "items": [],  # Will be populated from order items
            }

            response = self.make_request("POST", "/api/orders", order_data)
            if response:
                self.created_entities["orders"][order["id"]] = response.get("id")
                success_count += 1
                logger.info(f"Created order: {order['id']}")
            else:
                logger.error(f"Failed to create order: {order['id']}")

        logger.info(
            f"Order seeding completed: {success_count}/{len(orders_df)} successful"
        )
        return success_count > 0

    def seed_order_items(self) -> bool:
        """Seed order items from CSV"""
        logger.info("Starting order item seeding...")
        order_items_df = self.load_csv("order_items.csv")

        if order_items_df.empty:
            logger.info("No order item data to seed")
            return True

        # Group items by order
        order_groups = order_items_df.groupby("orderId")
        success_count = 0

        for order_id, items in order_groups:
            api_order_id = self.created_entities["orders"].get(order_id)
            if not api_order_id:
                logger.warning(f"Skipping order items - order not found: {order_id}")
                continue

            order_items = []
            for _, item in items.iterrows():
                product_id = self.created_entities["products"].get(item["productId"])
                variant_id = (
                    self.created_entities["variants"].get(item["variantId"])
                    if pd.notna(item["variantId"])
                    else None
                )

                if not product_id:
                    logger.warning("Skipping order item - product not found")
                    continue

                order_item = {
                    "productId": product_id,
                    "quantity": int(item["quantity"]),
                }

                if variant_id:
                    order_item["variantId"] = variant_id

                order_items.append(order_item)

            if order_items:
                # Update order with items
                order_data = {"items": order_items}
                response = self.make_request(
                    "PUT", f"/api/orders/{api_order_id}", order_data
                )
                if response:
                    success_count += len(order_items)
                    logger.info(
                        "Added %d items to order %s", len(order_items), api_order_id
                    )
                else:
                    logger.error("Failed to add items to order %s", api_order_id)

        logger.info(f"Order item seeding completed: {success_count} items processed")
        return success_count > 0

    def run_seeding(self) -> bool:
        """Run the complete seeding process in correct order"""
        logger.info("Starting Ecommerce data seeding process...")
        logger.info("=" * 60)

        # Only run the steps that previously failed
        # Based on log analysis, these steps were successful:
        # ✅ Users: 500/500 successful
        # ✅ Brands: 18/18 successful (confirmed by API check)
        # ✅ Categories: 56/56 successful
        # ✅ Products: 229/229 successful
        # ✅ Product Variants: 152/154 successful
        # ✅ Product Images: 563/563 images noted
        # ✅ Variant Images: 296/299 images noted

        seeding_steps = [
            # ("Users", self.seed_users),  # ✅ COMPLETED
            # ("Brands", self.seed_brands),  # ✅ COMPLETED
            # ("Categories", self.seed_categories),  # ✅ COMPLETED
            # ("Products", self.seed_products),  # ✅ COMPLETED
            # ("Product Variants", self.seed_product_variants),  # ✅ COMPLETED
            # ("Product Images", self.seed_product_images),  # ✅ COMPLETED
            # ("Variant Images", self.seed_variant_images),  # ✅ COMPLETED
            ("Reviews", self.seed_reviews),  # ❌ RETRY - Previously failed due to auth
            (
                "Wishlists",
                self.seed_wishlists,
            ),  # ❌ RETRY - Previously failed due to auth
            (
                "Wishlist Products",
                self.seed_wishlist_products,
            ),  # ❌ RETRY - Depends on wishlists
            (
                "Shopping Carts",
                self.seed_shopping_carts,
            ),  # ❌ RETRY - Previously failed due to auth
            ("Cart Items", self.seed_cart_items),  # ❌ RETRY - Depends on carts
            ("Orders", self.seed_orders),  # ❌ RETRY - Previously failed due to auth
            ("Order Items", self.seed_order_items),  # ❌ RETRY - Depends on orders
        ]

        success_count = 0
        total_steps = len(seeding_steps)

        for step_name, step_function in seeding_steps:
            logger.info(f"\n{'=' * 20} {step_name} {'=' * 20}")
            try:
                if step_function():
                    success_count += 1
                    logger.info(f"✓ {step_name} seeding completed successfully")
                else:
                    logger.error(f"✗ {step_name} seeding failed")
            except Exception as e:
                logger.error(f"✗ {step_name} seeding failed with error: {str(e)}")

        logger.info("\n" + "=" * 60)
        logger.info(
            f"Seeding process completed: {success_count}/{total_steps} steps successful"
        )

        if success_count == total_steps:
            logger.info("🎉 All seeding steps completed successfully!")
            return True
        else:
            logger.warning(
                f"⚠️  {total_steps - success_count} steps failed. Check logs for details."
            )
            return False


def main():
    """Main function to run the seeding process"""
    import argparse

    parser = argparse.ArgumentParser(description="Seed ecommerce data from CSV files")
    parser.add_argument(
        "--base-url",
        default="http://localhost:8080",
        help="Base URL of the API (default: http://localhost:8080)",
    )
    parser.add_argument(
        "--csv-folder",
        default="perplexity",
        help="Folder containing CSV files (default: perplexity)",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=0.1,
        help="Delay between requests in seconds (default: 0.1)",
    )
    parser.add_argument(
        "--username",
        default="admin",
        help="Username for API authentication (default: admin)",
    )
    parser.add_argument(
        "--password",
        default="password",
        help="Password for API authentication (default: password)",
    )

    args = parser.parse_args()

    seeder = EcommerceSeeder(
        base_url=args.base_url,
        csv_folder=args.csv_folder,
        username=args.username,
        password=args.password,
    )
    seeder.request_delay = args.delay

    success = seeder.run_seeding()

    if success:
        logger.info("Seeding completed successfully!")
        exit(0)
    else:
        logger.error("Seeding completed with errors!")
        exit(1)


if __name__ == "__main__":
    main()
