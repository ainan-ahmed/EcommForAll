import { useMutation } from "@tanstack/react-query";
import { ProductDescriptionRequest, ProductDescriptionResponse } from "../types";
import { generateProductDescription } from "../api/productApi";

interface UseAiDescriptionOptions {
  onSuccess?: (data: ProductDescriptionResponse) => void;
  onError?: (error: Error) => void;
}

export function useAIDescription(options: UseAiDescriptionOptions = {}) {
  return useMutation({
    mutationFn: ({ request, productId }: { 
      request: ProductDescriptionRequest, 
      productId?: string 
    }) => generateProductDescription(request, productId),
    onSuccess: (data) => {
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}