import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Brand } from "../types";
import { updateBrand } from "../api/brandApi";

interface UpdateBrandParams {
    id: string;
    data: Omit<Brand, "id" | "createdAt" | "updatedAt" | "productCount">;
}

export function useUpdateBrand() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateBrandParams) => updateBrand(id, data),
        onSuccess: (data) => {
            // Invalidate the brand query to refetch updated data
            queryClient.invalidateQueries({
                queryKey: ["brand", data.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["brands"],
            });
        },
    });
}
