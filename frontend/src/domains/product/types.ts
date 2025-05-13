export interface ProductImage {
    id: string;
    productId: string;
    imageUrl: string;
    altText: string;
    sortOrder: number;
    file?: File; // optional property for client-side use
    isVariantImage?: boolean; // optional property for client-side use
}

export interface VariantImage {
    id: string;
    variantId: string;
    imageUrl: string;
    altText: string;
    sortOrder: number;
    file?: File; // optional property for client-side use
}

export interface ProductVariant {
    id: string;
    productId: string;
    attributeValues: Record<string, string>;
    sku: string;
    price: number;
    stock: number;
    images?: VariantImage[];
}

export interface Product {
    id: string;
    name: string;
    description: string;
    sku: string;
    isActive: boolean;
    isFeatured: boolean;
    minPrice: number;
    brandId: string;
    categoryId: string;
    sellerId: string;
    images: ProductImage[];
    variants: ProductVariant[];
    primaryImage?: ProductImage;
}
export interface ProductsResponse {
    content: Product[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}
export interface ProductQueryParams {
    page?: number;
    size?: number;
    sort?: string;
    name?: string;
    description?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sellerId?: string;
    brandId?: string;
    isActive?: boolean;
    isFeatured?: boolean;
}
export interface WishlistProductSummary {
    id: string;
    name: string;
    sku: string;
    isActive: boolean;
    minPrice: number;
    primaryImage?: ProductImage;
    brand: string;
}

export interface Wishlist {
    id: string;
    name: string;
    userId: string;
    products: WishlistProductSummary[];
    createdAt: string;
    updatedAt: string;
}
