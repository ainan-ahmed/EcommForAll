import { useQuery } from "@tanstack/react-query";
import { fetchProductsByBrandId } from "../api/productApi";
import { ProductsResponse } from "../types";

interface UseProductsByBrandIdParams {
    brandId: string;
    page?: number;
    size?: number;
    sort?: string;
    enabled?: boolean;
}

export function useProductsByBrandId({
    brandId,
    page = 0,
    size = 10,
    sort = "",
    enabled = true,
}: UseProductsByBrandIdParams) {
    return useQuery<ProductsResponse>({
        queryKey: ["products", "brand", brandId, page, size, sort],
        queryFn: () => fetchProductsByBrandId(brandId, page, size, sort),
        enabled: enabled && !!brandId,
    });
}
