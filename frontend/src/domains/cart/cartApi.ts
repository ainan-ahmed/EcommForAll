// src/domains/cart/api/cartApi.ts
import { API } from "../../config/api";
import {
    Cart,
    CartItem,
    AddToCartRequest,
    UpdateCartItemRequest,
} from "./types";

/**
 * Get current user's cart
 */
export async function getCart(): Promise<Cart> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/cart`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch cart: ${response.status}`);
    }

    return response.json();
}

/**
 * Add item to cart
 */
export async function addToCart(request: AddToCartRequest): Promise<CartItem> {
    const token = localStorage.getItem("authToken");
    console.log("Adding to cart with request:", request);
    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Failed to add to cart: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
    itemId: string,
    request: UpdateCartItemRequest
): Promise<CartItem> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/cart/items/${itemId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(`Failed to update cart item: ${response.status}`);
    }

    return response.json();
}

/**
 * Remove item from cart
 */
export async function removeFromCart(itemId: string): Promise<void> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/cart/items/${itemId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to remove from cart: ${response.status}`);
    }
}

/**
 * Clear entire cart
 */
export async function clearCart(): Promise<void> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/cart/items/clearCart`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to clear cart: ${response.status}`);
    }
}
