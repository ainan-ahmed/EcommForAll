import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { fetchProductReviews, createReview, deleteReview } from "../api/reviewApi";
import { ReviewCreateRequest } from "../types";

export function useProductReviews(productId: string, page: number = 0, size: number = 10) {
    return useQuery({
        queryKey: ["reviews", productId, page, size],
        queryFn: () => fetchProductReviews(productId, page, size),
        enabled: !!productId,
        retry: (failureCount, error: Error) => {
            // Don't retry on authentication errors
            if (error.message.includes("Authentication required")) {
                return false;
            }
            return failureCount < 3;
        },
    });
}

export function useCreateReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (review: ReviewCreateRequest) => createReview(review),
        onSuccess: (data) => {
            // Invalidate reviews for the specific product
            queryClient.invalidateQueries({
                queryKey: ["reviews", data.productId],
            });

            notifications.show({
                title: "Review Posted",
                message: "Your review has been posted successfully",
                color: "green",
                position: "top-center",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message || "Failed to post review",
                color: "red",
                position: "top-center",
            });
        },
    });
}

export function useDeleteReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewId: string) => deleteReview(reviewId),
        onSuccess: () => {
            // Invalidate all review queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ["reviews"] });

            notifications.show({
                title: "Review Deleted",
                message: "Review has been deleted successfully",
                color: "blue",
                position: "top-center",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message || "Failed to delete review",
                color: "red",
                position: "top-center",
            });
        },
    });
}
