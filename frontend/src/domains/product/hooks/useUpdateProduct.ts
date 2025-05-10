import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "../types";
import { updateProduct } from "../api/productApi";

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (product: Product) => updateProduct(product),
        onSuccess: (data) => {
            // Invalidate the product query to refetch updated data
            queryClient.invalidateQueries({
                queryKey: ["product", data.id],
            });
        },
    });
}
