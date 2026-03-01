import { API } from "../../../config/api";
import { ProductDescriptionRequest, ProductDescriptionResponse } from "../types";

export async function generateProductDescription(
    request: ProductDescriptionRequest,
    productId?: string
): Promise<ProductDescriptionResponse> {
    const token = localStorage.getItem("authToken");
    if (!token) {
        throw new Error("Authentication required");
    }

    const url = new URL(`${API.BASE_URL}/ai/generate-description`);
    if (productId) {
        url.searchParams.append("productId", productId);
    }

    const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.errorMessage || `Failed to generate description: ${response.status}`
        );
    }

    return response.json();
}
