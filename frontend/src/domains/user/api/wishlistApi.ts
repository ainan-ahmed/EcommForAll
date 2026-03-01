import { API } from "../../../config/api";
import { Wishlist } from "../types";

/**
 * Get all wishlists for the current user
 */
export async function fetchUserWishlists(): Promise<Wishlist[]> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const url = `${API.BASE_URL}/wishlists`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch wishlists: ${response.status}`);
    }

    return response.json();
}

/**
 * Get a specific wishlist by ID
 */
export async function fetchWishlistById(wishlistId: string): Promise<Wishlist> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const url = `${API.BASE_URL}/wishlists/${wishlistId}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch wishlist: ${response.status}`);
    }

    return response.json();
}

/**
 * Create a new wishlist
 */
export async function createWishlist(name: string): Promise<Wishlist> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/wishlists`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        throw new Error(`Failed to create wishlist: ${response.status}`);
    }

    return response.json();
}

/**
 * Add a product to a wishlist
 */
export async function addToWishlist(wishlistId: string, productId: string): Promise<Wishlist> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/wishlists/${wishlistId}/add`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
        throw new Error(`Failed to add to wishlist: ${response.status}`);
    }

    return response.json();
}

/**
 * Remove a product from a wishlist
 */
export async function removeFromWishlist(wishlistId: string, productId: string): Promise<Wishlist> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/wishlists/${wishlistId}/products/${productId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to remove from wishlist: ${response.status}`);
    }

    return response.json();
}

/**
 * Update a wishlist (rename)
 */
export async function updateWishlist(wishlistId: string, name: string): Promise<Wishlist> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/wishlists/${wishlistId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        throw new Error(`Failed to update wishlist: ${response.status}`);
    }

    return response.json();
}

/**
 * Delete a wishlist
 */
export async function deleteWishlist(wishlistId: string): Promise<void> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/wishlists/${wishlistId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to delete wishlist: ${response.status}`);
    }
}

/**
 * Check if a product is in a wishlist
 */
export async function isProductInWishlist(wishlistId: string, productId: string): Promise<boolean> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return false; // If not authenticated, product is not in wishlist
    }

    const response = await fetch(
        `${API.BASE_URL}/wishlists/${wishlistId}/products/${productId}/check`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        if (response.status === 404) {
            return false; // Product not in wishlist
        }
        throw new Error(`Failed to check wishlist status: ${response.status}`);
    }

    return response.json();
}
