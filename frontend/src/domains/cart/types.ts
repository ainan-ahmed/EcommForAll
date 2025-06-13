import { ProductImage } from "../product/types";

// src/domains/cart/types.ts
export interface CartItem {
    id: string;
    productId: string;
    productName: string;
    productDescription: string;
    variantId: string;
    sku: string;
    variantAttributes: Record<string, string>;
    imageUrl: ProductImage;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    inStock: boolean;
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    status: boolean; // true for active, false for archived
}

export interface AddToCartRequest {
    productId: string;
    variantId?: string;
    quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}
