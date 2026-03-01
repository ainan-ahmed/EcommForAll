import { API } from "../../../config/api";
import { Product, ProductQueryParams, ProductsResponse } from "../types";
import { uploadProductImage } from "./productImageApi";

export async function fetchProducts(params: ProductQueryParams): Promise<ProductsResponse> {
    const {
        page = 0,
        size = 12,
        sort,
        name: nameSearch,
        categoryId,
        minPrice,
        maxPrice,
        brandId,
        sellerId,
        isActive,
        isFeatured,
    } = params;

    let isFiltering =
        nameSearch ||
        categoryId ||
        minPrice !== undefined ||
        maxPrice !== undefined ||
        brandId ||
        sellerId ||
        isActive ||
        isFeatured;

    let baseUrl = `${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}`;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());

    // ✅ ADD THIS: Include variant data in the main products fetch
    queryParams.append("includes", "images,variants,variantImages");

    if (sort) {
        queryParams.append("sort", sort);
    }

    if (isFiltering) {
        if (nameSearch) queryParams.append("name", nameSearch);
        if (categoryId) queryParams.append("categoryId", categoryId);
        if (minPrice !== undefined) queryParams.append("minPrice", minPrice.toString());
        if (maxPrice !== undefined) queryParams.append("maxPrice", maxPrice.toString());
        if (brandId) queryParams.append("brandId", brandId);
        if (sellerId) queryParams.append("sellerId", sellerId);
        if (isActive) queryParams.append("isActive", isActive.toString());
        if (isFeatured) queryParams.append("isFeatured", isFeatured.toString());
    }

    const url = `${baseUrl}?${queryParams.toString()}`;
    console.log("Fetching products from URL:", url);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
    }

    return response.json();
}

export async function fetchProductById(productId: string): Promise<Product> {
    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}/${productId}?includes=images,variants,variantImages`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
    }
    return response.json();
}

export async function fetchProductsByCategoryId(
    categoryId: string,
    page: number = 0,
    size: number = 10,
    sort: string = ""
): Promise<ProductsResponse> {
    // ✅ Add includes parameter
    let url = `${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}/category/${categoryId}?page=${page}&size=${size}&sort=${sort}&includes=images,variants,variantImages`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
    }
    return response.json();
}

export async function fetchProductsByBrandId(
    brandId: string,
    page: number = 0,
    size: number = 10,
    sort: string = ""
): Promise<ProductsResponse> {
    // ✅ Add includes parameter
    let url = `${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}/brand/${brandId}?page=${page}&size=${size}&sort=${sort}&includes=images,variants,variantImages`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
    }
    return response.json();
}

export async function updateProduct(product: Product): Promise<Product> {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}/${product.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        throw new Error(`Failed to update product: ${response.status}`);
    }

    return response.json();
}

/**
 * Creates a new product with basic information only
 * Does NOT handle image uploads - that should be done as a separate step
 */
export async function createProduct(product: Product): Promise<Product> {
    const token = localStorage.getItem("authToken");

    // Filter out temporary images before sending to API
    const productToSend = {
        ...product,
        images: product.images.filter((img) => !img.id.startsWith("temp-")),
        variants: product.variants.map((variant) => ({
            ...variant,
            images: variant.images?.filter((img) => !img.id.startsWith("temp-")),
        })),
    };

    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productToSend),
    });

    if (!response.ok) {
        throw new Error(`Failed to create product: ${response.status}`);
    }

    return response.json();
}

/**
 * Uploads all temporary images for a product and refreshes product data
 * Returns the updated product with all images included
 */
export async function uploadProductTempImages(
    productId: string,
    tempImages: Array<{ id: string; file?: File }>
): Promise<Product> {
    if (tempImages.length === 0) {
        // No images to upload, just return current product
        return fetchProductById(productId);
    }

    // Upload each temporary image
    for (const img of tempImages) {
        if (img.file) {
            try {
                await uploadProductImage(productId, img.file);
            } catch (error: any) {
                console.error("Failed to upload product image:", error);
                throw new Error(`Failed to upload image: ${error.message}`);
            }
        }
    }

    // Fetch updated product with all images
    return fetchProductById(productId);
}

/**
 * Updates product variants in a separate API call
 */
export async function updateProductVariants(
    productId: string,
    variants: Product["variants"]
): Promise<Product> {
    const token = localStorage.getItem("authToken");

    // Process existing variants first (non-temporary IDs)
    for (const variant of variants.filter((v) => !v.id.startsWith("temp-"))) {
        console.log(`Updating existing variant ${variant.id}`);

        const response = await fetch(
            `${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}/${productId}/variants/${variant.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(variant),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to update variant ${variant.id}: ${response.status} - ${errorText}`
            );
        }
    }

    // Then create new variants (with temporary IDs)
    for (const variant of variants.filter((v) => v.id.startsWith("temp-"))) {
        console.log(`Creating new variant from ${variant.id}`);

        // Remove the temporary ID for new variants
        const { id, ...variantData } = variant;

        const response = await fetch(
            `${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}/${productId}/variants`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...variantData,
                    productId, // Ensure product ID is set correctly
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create new variant: ${response.status} - ${errorText}`);
        }
    }
    return refreshProductData(productId);
}

/**
 * Refreshes product data from the server
 * Useful after making multiple updates to ensure latest data
 */
export async function refreshProductData(productId: string): Promise<Product> {
    return fetchProductById(productId);
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string): Promise<void> {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}/${productId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status}`);
    }
}
