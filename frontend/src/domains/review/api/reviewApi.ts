import { API } from "../../../config/api";
import { Review, ReviewCreateRequest, ReviewsResponse } from "../types";

export async function fetchProductReviews(
    productId: string,
    page: number = 0,
    size: number = 10
): Promise<ReviewsResponse> {
    const token = localStorage.getItem("authToken");
    const headers: HeadersInit = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.REVIEW.PRODUCT_REVIEWS}/${productId}/reviews?page=${page}&size=${size}`,
        {
            method: "GET",
            headers,
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch reviews: ${response.status}`);
    }

    return response.json();
}

export async function createReview(review: ReviewCreateRequest): Promise<Review> {
    const token = localStorage.getItem("authToken");
    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.REVIEW.CREATE_REVIEW}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(review),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create review: ${response.status}`);
    }

    return response.json();
}

export async function deleteReview(reviewId: string): Promise<void> {
    const token = localStorage.getItem("authToken");
    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.REVIEW.DELETE_REVIEW}/${reviewId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to delete review: ${response.status}`);
    }
}
