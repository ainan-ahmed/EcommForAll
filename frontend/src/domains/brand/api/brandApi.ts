import { API } from "../../../config/api";
import { Brand, BrandsResponse } from "../types";

export async function fetchBrands(
    page: number,
    size: number,
    sort: string = ""
): Promise<BrandsResponse> {
    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.BRANDS}?page=${page}&size=${size}&sort=${sort}`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch brands");
    }
    return response.json();
}
export async function fetchBrandById(id: string): Promise<Brand> {
    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.BRANDS}/${id}`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch brand");
    }
    return response.json();
}
export async function createBrand(
    brand: Omit<Brand, "id" | "createdAt" | "updatedAt" | "productCount">
): Promise<Brand> {
    const token = localStorage.getItem("authToken");
    console.log("Creating brand with data:", brand);
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.BRANDS}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(brand),
    });

    if (!response.ok) {
        throw new Error(`Failed to create brand: ${response.status}`);
    }

    return response.json();
}

// Helper function for image upload
export async function uploadBrandImage(file: File, id: string): Promise<Brand> {
    const token = localStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("image", file);
    console.log("Uploading file:", file);
    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.BRANDS}/${id}/image`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("Failed to upload image");
    }

    return response.json();
}

/**
 * Updates an existing brand
 */
export async function updateBrand(
    id: string,
    brand: Omit<Brand, "id" | "createdAt" | "updatedAt" | "productCount">
): Promise<Brand> {
    const token = localStorage.getItem("authToken");

    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.BRANDS}/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(brand),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to update brand: ${response.status}`);
    }

    return response.json();
}
