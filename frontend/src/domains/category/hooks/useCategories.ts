// src/domains/category/hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/categoryApi";
import { CategoriesResponse } from "../types";

interface UseCategoriesParams {
    page: number;
    size?: number;
    sort?: string;
}

export function useCategories({ page = 0, size = 12, sort = "" }: UseCategoriesParams) {
    return useQuery<CategoriesResponse>({
        queryKey: ["categories", page, size],
        queryFn: () => fetchCategories(page, size, sort),
    });
}
