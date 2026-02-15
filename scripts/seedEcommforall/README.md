# Ecommerce Data Seeding Script

This script processes CSV files from the `perplexity` folder and performs REST requests according to the API documentation. It handles hierarchical data creation in the correct order to maintain referential integrity.

## Features

- **Hierarchical Data Creation**: Creates entities in the correct order (users → brands → categories → products → variants → etc.)
- **Error Handling**: Comprehensive error handling and logging
- **Rate Limiting**: Configurable delay between requests to avoid overwhelming the API
- **Progress Tracking**: Detailed logging of seeding progress
- **Flexible Configuration**: Configurable API base URL and CSV folder location

## Prerequisites

1. Python 3.7+
2. Backend API running (default: http://localhost:8080)
3. Required Python packages (install with `pip install -r requirements.txt`)
4. API authentication credentials (default: admin/password)

## Installation

### Option 1: Quick Setup (Recommended)
```bash
# Run the setup script
./setup_env.sh
```

### Option 2: Manual Setup
```bash
# Create virtual environment
python3 -m venv seedEcommforall

# Activate virtual environment
source seedEcommforall/bin/activate

# Install required packages
pip install pandas requests

# Make scripts executable
chmod +x seed_from_csv.py test_seed.py run_seed.py
```

## Usage

### Basic Usage

#### Using the wrapper script (Recommended)
```bash
# Run with default settings
./run_seed.py

# Specify custom API URL
./run_seed.py --base-url http://your-api-url:8080

# Specify custom CSV folder
./run_seed.py --csv-folder /path/to/csv/files

# Adjust request delay (seconds between requests)
./run_seed.py --delay 0.2

# Specify custom authentication credentials
./run_seed.py --username myuser --password mypass
```

#### Using the virtual environment directly
```bash
# Activate virtual environment first
source seedEcommforall/bin/activate

# Then run the script
python seed_from_csv.py --base-url http://your-api-url:8080 --username admin --password password
```

### Testing

Before running the actual seeding, test the setup:

```bash
# Run test suite (using virtual environment)
seedEcommforall/bin/python test_seed.py

# Or activate virtual environment first
source seedEcommforall/bin/activate
python test_seed.py
```

This will:
- Test CSV file loading
- Verify data structure and relationships
- Check API connectivity

## Data Seeding Order

The script creates entities in the following hierarchical order:

1. **Users** - No dependencies
2. **Brands** - No dependencies
3. **Categories** - Root categories first, then subcategories
4. **Products** - Depends on brands and categories
5. **Product Variants** - Depends on products
6. **Product Images** - Depends on products (noted for manual upload)
7. **Variant Images** - Depends on variants (noted for manual upload)
8. **Reviews** - Depends on products and users
9. **Wishlists** - Depends on users
10. **Wishlist Products** - Depends on wishlists and products
11. **Shopping Carts** - Depends on users
12. **Cart Items** - Depends on carts and products/variants
13. **Orders** - Depends on users
14. **Order Items** - Depends on orders and products/variants

## CSV Files Required

The script expects the following CSV files in the `perplexity` folder:

- `users.csv` - User accounts
- `brands.csv` - Brand information
- `categories.csv` - Category hierarchy
- `products.csv` - Product information
- `product_variants.csv` - Product variants with option values
- `product_images.csv` - Product images (URLs)
- `variant_images.csv` - Variant images (URLs)
- `reviews.csv` - Product reviews
- `wishlists.csv` - User wishlists
- `wishlist_products.csv` - Wishlist items
- `shopping_carts.csv` - Shopping carts
- `cart_items.csv` - Cart items
- `orders.csv` - Orders
- `order_items.csv` - Order items

## Configuration

### Authentication

The script uses HTTP Basic Authentication by default with the following credentials:
- **Username**: `admin`
- **Password**: `password`

You can customize these credentials using command-line arguments:

```bash
# Use custom credentials
./run_seed.py --username myuser --password mypass

# Or with the virtual environment
python seed_from_csv.py --username myuser --password mypass
```

### API Endpoints

The script uses the following API endpoints (full API documentation available at http://localhost:8080/swagger-ui.html):

- `POST /api/auth/register` - User registration
- `POST /api/brands` - Brand creation
- `POST /api/categories` - Category creation
- `POST /api/products` - Product creation
- `POST /api/products/{id}/variants` - Product variant creation
- `POST /api/review/review/create` - Review creation
- `POST /api/wishlists` - Wishlist creation
- `POST /api/wishlists/{id}/add` - Add product to wishlist
- `POST /api/cart/items` - Add item to cart
- `POST /api/orders` - Order creation

### Data Mapping

The script maps CSV columns to API fields as follows:

#### Users
- `firstName`, `lastName`, `email`, `username`, `role` → API fields
- Password is set to `TempPassword123!` for all seeded users

#### Brands
- `name`, `description`, `website`, `imageUrl` → API fields

#### Categories
- `name`, `description`, `imageUrl` → API fields
- `parent` → Used to establish hierarchy

#### Products
- `name`, `description`, `sku`, `isActive`, `isFeatured`, `price`, `stock` → API fields
- `brandId`, `categoryId` → Mapped to created entity IDs

#### Product Variants
- `attributeValues` → Parsed as JSON for option values (color, size, etc.)
- `sku`, `price`, `stock` → API fields

## Logging

The script creates detailed logs in `seed_log.txt` and outputs to console. Logs include:

- Progress updates for each seeding step
- Success/failure counts
- Error details for failed operations
- Entity ID mappings for debugging

## Error Handling

- **Missing Dependencies**: Skips entities if required dependencies aren't found
- **API Errors**: Logs detailed error information and continues with next entity
- **Invalid Data**: Handles malformed JSON, missing fields, etc.
- **Rate Limiting**: Configurable delay between requests

## Notes

### Image Uploads

Product and variant images are noted in logs but not actually uploaded. The API requires multipart/form-data for image uploads, which would require additional implementation. Image URLs from CSV are logged for manual reference.

### Authentication

The script assumes the API allows user registration without authentication. If authentication is required, the script would need to be modified to include login functionality.

### Data Validation

The script performs basic data validation but relies on the API for comprehensive validation. Ensure your CSV data is properly formatted before running.

## Troubleshooting

### Common Issues

1. **API Not Accessible**
   - Ensure backend is running on the specified URL
   - Check network connectivity
   - Verify API endpoints are correct

2. **CSV Files Not Found**
   - Ensure CSV files are in the correct folder
   - Check file names match expected names exactly

3. **Missing Dependencies**
   - Check logs for specific missing entity IDs
   - Ensure previous seeding steps completed successfully

4. **Rate Limiting**
   - Increase `--delay` parameter if getting rate limit errors
   - Check API rate limiting configuration

### Debug Mode

For detailed debugging, modify the logging level in the script:

```python
logging.basicConfig(level=logging.DEBUG, ...)
```

## Example Output

```
2024-01-15 10:30:00 - INFO - Starting Ecommerce data seeding process...
2024-01-15 10:30:00 - INFO - ============================================================
2024-01-15 10:30:01 - INFO - ==================== Users ====================
2024-01-15 10:30:01 - INFO - Loaded 500 records from users.csv
2024-01-15 10:30:05 - INFO - Created user: johnsmith123
2024-01-15 10:30:05 - INFO - User seeding completed: 500/500 successful
2024-01-15 10:30:05 - INFO - ✓ Users seeding completed successfully
...
2024-01-15 10:35:00 - INFO - ============================================================
2024-01-15 10:35:00 - INFO - Seeding process completed: 14/14 steps successful
2024-01-15 10:35:00 - INFO - 🎉 All seeding steps completed successfully!
```
