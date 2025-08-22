import { useMutation } from "@tanstack/react-query";
import { generateProductDescription } from "../api/productDescriptionGenApi";
import { ProductDescriptionRequest, ProductDescriptionResponse } from "../types";

interface UseAiDescriptionOptions {
    onSuccess?: (data: ProductDescriptionResponse) => void;
    onError?: (error: Error) => void;
}

export function useProductDescriptionGenAI(options: UseAiDescriptionOptions = {}) {
    return useMutation({
        mutationFn: ({
            request,
            productId,
        }: {
            request: ProductDescriptionRequest;
            productId?: string;
        }) => generateProductDescription(request, productId),
        onSuccess: (data) => {
            options.onSuccess?.(data);
        },
        onError: (error: Error) => {
            options.onError?.(error);
        },
    });
}
