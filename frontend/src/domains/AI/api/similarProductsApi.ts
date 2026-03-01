import { API } from "../../../config/api";
import { similarProductsResponse } from "../types";

export async function fetchSimilarProducts(
    productId: string,
    limit: number = 5
): Promise<similarProductsResponse> {
    const url = new URL(`${API.BASE_URL}/ai/similar-products/${productId}`);
    url.searchParams.set("limit", String(limit));
    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Failed to fetch similar products: ${response.status}`
        );
    }

    const data = await response.json();
    return data as similarProductsResponse;
}
