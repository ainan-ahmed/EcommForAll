import { useQuery } from "@tanstack/react-query";
import { fetchSimilarProducts } from "../api/similarProductsApi";

export function useSimilarProducts(productId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: ["similarProducts", productId],
        queryFn: () => fetchSimilarProducts(productId),
        enabled: enabled && !!productId, // Only run query if productId exists and enabled is true
    });
}
