// src/domains/cart/hooks/useCart.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from "../cartApi";
import { AddToCartRequest, UpdateCartItemRequest } from "../types";

// Hook to fetch cart
export function useCart() {
    return useQuery({
        queryKey: ["cart"],
        queryFn: getCart,
        retry: (failureCount, error) => {
            // Don't retry on auth errors
            if (error.message.includes("Authentication required")) {
                return false;
            }
            return failureCount < 2;
        },
    });
}

// Hook to add to cart
export function useAddToCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: AddToCartRequest) => addToCart(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            notifications.show({
                title: "Added to Cart",
                message: "Item added to your cart successfully",
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message || "Failed to add item to cart",
                color: "red",
            });
        },
    });
}

// Hook to update cart item
export function useUpdateCartItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            itemId,
            request,
        }: {
            itemId: string;
            request: UpdateCartItemRequest;
        }) => updateCartItem(itemId, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message || "Failed to update cart item",
                color: "red",
            });
        },
    });
}

// Hook to remove from cart
export function useRemoveFromCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (itemId: string) => removeFromCart(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            notifications.show({
                title: "Removed",
                message: "Item removed from cart",
                color: "blue",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message || "Failed to remove item from cart",
                color: "red",
            });
        },
    });
}

// Hook to clear cart
export function useClearCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            notifications.show({
                title: "Cart Cleared",
                message: "All items removed from cart",
                color: "blue",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message || "Failed to clear cart",
                color: "red",
            });
        },
    });
}
