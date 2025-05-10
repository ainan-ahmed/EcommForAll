import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/productApi";
import { ProductQueryParams, ProductsResponse } from "../types";

export function useProducts(params: ProductQueryParams) {
    return useQuery<ProductsResponse>({
        queryKey: ["products", params],
        queryFn: () => fetchProducts(params),
        placeholderData: previousData => previousData,
    });
}
