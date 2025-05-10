import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBrand } from "../api/brandApi";
import { Brand } from "../types";

export function useCreateBrand() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            brand: Omit<
                Brand,
                "id" | "createdAt" | "updatedAt" | "productCount"
            >
        ) => createBrand(brand),
        onSuccess: () => {
            // Invalidate brands queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
    });
}
