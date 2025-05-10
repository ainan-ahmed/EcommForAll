import { API } from "../../../config/api";
import { CategoriesResponse, Category } from "../types";

// interface PageRequest {
//   page?: number; // 0-based page index in Spring
//   size?: number; // Page size
//   sort?: string; // Optional sort parameter
// }
export async function fetchCategories(
    page: number,
    size: number,
    sort: string = ""
): Promise<CategoriesResponse> {
    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.CATEGORIES}?page=${page}&size=${size}&sort=${sort}`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }
    return response.json();
}

export async function fetchCategoryBySlug(slug: string): Promise<Category> {
    console.log(slug, API.BASE_URL);
    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.CATEGORIES}/slug/${slug}`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch category");
    }
    return response.json();
}

export async function createCategory(
    category: Omit<Category, "id" | "productCount" | "slug" | "imageUrl">
): Promise<Category> {
    const token = localStorage.getItem("authToken");
    console.log("Creating category with data:", category);
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.CATEGORIES}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(category),
    });

    if (!response.ok) {
        throw new Error(`Failed to create category: ${response.status}`);
    }

    return response.json();
}

/**
 * Uploads an image for a category
 * @param categoryId ID of the category to upload image for
 * @param file Image file to upload
 */
export async function uploadCategoryImage(
    categoryId: string,
    file: File
): Promise<Category> {
    const token = localStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.CATEGORIES}/${categoryId}/image`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to upload category image: ${response.status}`);
    }

    return response.json();
}

/**
 * Updates an existing category
 * @param categoryId ID of the category to update
 * @param category Updated category data
 */
export async function updateCategory(
    categoryId: string,
    category: Omit<Category, "id" | "productCount" | "slug" | "imageUrl">
): Promise<Category> {
    const token = localStorage.getItem("authToken");

    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.CATEGORIES}/${categoryId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(category),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to update category: ${response.status}`);
    }

    return response.json();
}

/**
 * Deletes a category
 * @param categoryId ID of the category to delete
 */
export async function deleteCategory(categoryId: string): Promise<void> {
    const token = localStorage.getItem("authToken");

    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.CATEGORIES}/${categoryId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to delete category: ${response.status}`);
    }
}
