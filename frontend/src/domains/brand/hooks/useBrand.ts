import { useQuery } from "@tanstack/react-query";
import { Brand } from "../types";
import { fetchBrandById } from "../api/brandApi";
export function useBrand(id: string) {
    return useQuery<Brand>({
        queryKey: ["brand", id],
        queryFn: () => fetchBrandById(id),
    });
}
