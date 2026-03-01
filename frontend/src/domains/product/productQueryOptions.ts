import { queryOptions } from "@tanstack/react-query";
import { fetchProductById, fetchProducts, fetchProductsByCategoryId } from "./api/productApi";
import { ProductQueryParams } from "./types";

/**
 * Query options for fetching a single product by ID
 */
export const productQueryOptions = (productId: string) => {
    return queryOptions({
        queryKey: ["product", productId],
        queryFn: () => fetchProductById(productId),
        enabled: !!productId,
    });
};

/**
 * Query options for fetching products with filters
 */
export const productsQueryOptions = (params: ProductQueryParams) => {
    return queryOptions({
        queryKey: ["products", params],
        queryFn: () => fetchProducts(params),
        placeholderData: (previousData) => previousData,
    });
};

/**
 * Query options for fetching products by category ID
 */
export const productsByCategoryQueryOptions = (
    categoryId: string,
    page: number = 0,
    size: number = 10,
    sort: string = ""
) => {
    return queryOptions({
        queryKey: ["products", "category", categoryId, page, size, sort],
        queryFn: () => fetchProductsByCategoryId(categoryId, page, size, sort),
        enabled: !!categoryId,
    });
};

/**
 * Query options for featured products (example of a specialized query)
 */
export const featuredProductsQueryOptions = (limit: number = 4) => {
    return queryOptions({
        queryKey: ["products", "featured", limit],
        queryFn: () =>
            fetchProducts({
                page: 0,
                size: limit,
                isFeatured: true,
                sort: "createdAt,desc",
            }),
    });
};

/**
 * Query options for related products (similar to current product)
 */
export const relatedProductsQueryOptions = (
    productId: string,
    categoryId: string,
    limit: number = 4
) => {
    return queryOptions({
        queryKey: ["products", "related", productId, categoryId, limit],
        queryFn: () =>
            fetchProducts({
                page: 0,
                size: limit,
                categoryId,
                sort: "createdAt,desc",
            }),
        enabled: !!productId && !!categoryId,
    });
};

/**
 * Query options for newest products
 */
export const newestProductsQueryOptions = (limit: number = 8) => {
    return queryOptions({
        queryKey: ["products", "newest", limit],
        queryFn: () =>
            fetchProducts({
                page: 0,
                size: limit,
                sort: "createdAt,desc",
            }),
    });
};
