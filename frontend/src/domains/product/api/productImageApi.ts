import { API } from "../../../config/api";
import { ProductImage } from "../types";

export async function uploadProductImage(
    productId: string,
    file: File
): Promise<ProductImage> {
    const formData = new FormData();
    formData.append("file", file);
    console.log("Form data", formData);
    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}/${productId}/images`,
        {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.status}`);
    }

    return response.json();
}

export async function updateProductImage(
    productId: string,
    imageId: string,
    data: { file?: File; altText?: string; sortOrder?: number }
): Promise<ProductImage> {
    const formData = new FormData();

    if (data.file) {
        formData.append("file", data.file);
    }

    if (data.altText !== undefined) {
        formData.append("altText", data.altText);
    }

    if (data.sortOrder !== undefined) {
        formData.append("sortOrder", data.sortOrder.toString());
    }

    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}/${productId}/images/${imageId}`,
        {
            method: "PUT",
            body: formData,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to update image: ${response.status}`);
    }

    return response.json();
}

export async function deleteProductImage(
    productId: string,
    imageId: string
): Promise<void> {
    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}/${productId}/images/${imageId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to delete image: ${response.status}`);
    }
}

export async function updateProductImagesOrder(
    productId: string,
    imageIds: string[]
): Promise<ProductImage[]> {
    // Create the array of ImageSortOrderDto objects
    const imageSortOrders = imageIds.map((id, index) => ({
        id: id,
        sortOrder: index ,
    }));

    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}/${productId}/images/reorder`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(imageSortOrders), // Send the array of objects, not wrapped in another object
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to reorder images: ${response.status}`);
    }

    return response.json();
}
