import { useQuery } from "@tanstack/react-query";
import { BrandsResponse } from "../types";
import { fetchBrands } from "../api/brandApi";

interface BrandParams {
    page?: number;
    size?: number;
    sort?: string;
}

export function useBrands({ page = 0, size = 12, sort }: BrandParams) {
    return useQuery<BrandsResponse>({
        queryKey: ["brands", page, size, sort],
        queryFn: () => fetchBrands(page, size, sort),
    });
}
