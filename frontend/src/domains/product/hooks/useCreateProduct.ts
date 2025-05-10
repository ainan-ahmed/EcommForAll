import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "../types";
import { createProduct } from "../api/productApi";

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (product: Product) => createProduct(product),
        onSuccess: () => {
            // Invalidate relevant product queries to refresh the data
            queryClient.invalidateQueries({
                queryKey: ["products"],
            });
        },
    });
}
