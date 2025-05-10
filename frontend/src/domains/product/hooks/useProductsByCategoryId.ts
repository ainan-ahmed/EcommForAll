import { useQuery } from "@tanstack/react-query";
import { fetchProductsByCategoryId } from "../api/productApi";
import { ProductsResponse } from "../types";
interface UseProductsByCategoryIdParams {
    categoryId: string;
    page?: number;
    size?: number;
    sort?: string;
    enabled?: boolean;
}

export function useProductsByCategoryId({
    categoryId,
    page = 0,
    size = 10,
    sort = "",
    enabled = true,
}: UseProductsByCategoryIdParams) {
    return useQuery<ProductsResponse>({
        queryKey: ["products", "category", categoryId, page, size, sort],
        queryFn: () => fetchProductsByCategoryId(categoryId, page, size, sort),
        enabled: enabled && !!categoryId,
    });
}
