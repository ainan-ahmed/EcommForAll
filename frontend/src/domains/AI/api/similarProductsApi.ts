import { API } from "../../../config/api";
import { similarProductsResponse } from "../types";

export async function fetchSimilarProducts(
    productId: string
): Promise<similarProductsResponse> {
    const token = localStorage.getItem("authToken");
    if (!token) {
        throw new Error("Authentication required");
    }

    const url = new URL(`${API.BASE_URL}/ai/similar-products/${productId}`);
    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message ||
                `Failed to fetch similar products: ${response.status}`
        );
    }

    const data = await response.json();
    return data as similarProductsResponse;
}
