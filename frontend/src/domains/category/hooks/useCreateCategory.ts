import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../api/categoryApi";
import { Category } from "../types";

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (category: Omit<Category, "id" | "productCount" | "slug" | "imageUrl">) =>
            createCategory(category),
        onSuccess: () => {
            // Invalidate categories queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error) => {
            console.error("Error creating category:", error);
        },
    });
}
