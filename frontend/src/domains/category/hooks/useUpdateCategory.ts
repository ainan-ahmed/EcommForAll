import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Category } from "../types";
import { updateCategory } from "../api/categoryApi";

interface UpdateCategoryParams {
    id: string;
    data: Omit<Category, "id" | "productCount" | "slug" | "imageUrl">;
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateCategoryParams) => updateCategory(id, data),
        onSuccess: (data) => {
            // Invalidate both slug-based and ID-based queries
            queryClient.invalidateQueries({
                queryKey: ["category", data.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["category", "slug", data.slug],
            });
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
    });
}
