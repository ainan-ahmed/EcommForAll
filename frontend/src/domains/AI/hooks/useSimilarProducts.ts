import { useQuery } from "@tanstack/react-query";
import { fetchSimilarProducts } from "../api/similarProductsApi";

export function useSimilarProducts(
    productId: string,
    enabled: boolean = true,
    limit: number = 5
) {
    return useQuery({
        queryKey: ["similarProducts", productId, limit],
        queryFn: () => fetchSimilarProducts(productId, limit),
        enabled: enabled && !!productId, // Only run query if productId exists and enabled is true
    });
}
