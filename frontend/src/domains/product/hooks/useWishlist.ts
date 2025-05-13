import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
    fetchUserWishlists,
    fetchWishlistById,
    createWishlist,
    addToWishlist,
    removeFromWishlist,
    updateWishlist,
    deleteWishlist,
    isProductInWishlist,
} from "../api/wishlistApi";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";

// Hook to fetch all user wishlists
export function useUserWishlists() {
    const { isAuthenticated } = useStore(authStore);

    return useQuery({
        queryKey: ["wishlists"],
        queryFn: fetchUserWishlists,
        enabled: isAuthenticated, // Only fetch if user is authenticated
    });
}

// Hook to fetch a specific wishlist by ID
export function useWishlistById(wishlistId: string) {
    const { isAuthenticated } = useStore(authStore);

    return useQuery({
        queryKey: ["wishlist", wishlistId],
        queryFn: () => fetchWishlistById(wishlistId),
        enabled: isAuthenticated && !!wishlistId,
    });
}

// Hook to check if a product is in a wishlist
export function useIsProductInWishlist(
    wishlistId?: string,
    productId?: string
) {
    const { isAuthenticated } = useStore(authStore);

    return useQuery({
        queryKey: ["wishlist", wishlistId, "product", productId],
        queryFn: () => isProductInWishlist(wishlistId!, productId!),
        enabled: isAuthenticated && !!wishlistId && !!productId,
    });
}

// Hook to create a new wishlist
export function useCreateWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (name: string) => createWishlist(name),
        onSuccess: () => {
            // Invalidate wishlists query to refresh the list
            queryClient.invalidateQueries({ queryKey: ["wishlists"] });

            notifications.show({
                title: "Success",
                message: "Wishlist created successfully",
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message || "Failed to create wishlist",
                color: "red",
            });
        },
    });
}

// Hook to add a product to a wishlist
export function useAddToWishlist(wishlistId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: string) =>
            addToWishlist(wishlistId!, productId),
        onSuccess: (_, productId) => {
            // Invalidate relevant queries to refresh data
            queryClient.invalidateQueries({
                queryKey: ["wishlist", wishlistId],
            });
            queryClient.invalidateQueries({
                queryKey: ["wishlist", wishlistId, "product", productId],
            });

            notifications.show({
                title: "Added to Wishlist",
                message: "Product added to your wishlist",
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message || "Failed to add product to wishlist",
                color: "red",
            });
        },
    });
}

// Hook to remove a product from a wishlist
export function useRemoveFromWishlist(wishlistId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: string) =>
            removeFromWishlist(wishlistId!, productId),
        onSuccess: (_, productId) => {
            // Invalidate relevant queries to refresh data
            queryClient.invalidateQueries({
                queryKey: ["wishlist", wishlistId],
            });
            queryClient.invalidateQueries({
                queryKey: ["wishlist", wishlistId, "product", productId],
            });

            notifications.show({
                title: "Removed from Wishlist",
                message: "Product removed from your wishlist",
                color: "blue",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message:
                    error.message || "Failed to remove product from wishlist",
                color: "red",
            });
        },
    });
}

// Hook to update a wishlist
export function useUpdateWishlist(wishlistId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (name: string) => updateWishlist(wishlistId!, name),
        onSuccess: () => {
            // Invalidate relevant queries to refresh data
            queryClient.invalidateQueries({ queryKey: ["wishlists"] });
            queryClient.invalidateQueries({
                queryKey: ["wishlist", wishlistId],
            });

            notifications.show({
                title: "Success",
                message: "Wishlist updated successfully",
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message || "Failed to update wishlist",
                color: "red",
            });
        },
    });
}

// Hook to delete a wishlist
export function useDeleteWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteWishlist,
        onSuccess: (_, wishlistId) => {
            // Invalidate relevant queries to refresh data
            queryClient.invalidateQueries({ queryKey: ["wishlists"] });
            queryClient.invalidateQueries({
                queryKey: ["wishlist", wishlistId],
            });

            notifications.show({
                title: "Success",
                message: "Wishlist deleted successfully",
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message || "Failed to delete wishlist",
                color: "red",
            });
        },
    });
}
