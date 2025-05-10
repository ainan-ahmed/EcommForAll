import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../api/productApi";
import { Product } from "../types";

export function useProduct(id: string) {
    return useQuery<Product>({
        queryKey: ["product", id],
        queryFn: () => fetchProductById(id),
        enabled: !!id,
    });
}
