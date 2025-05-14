import { API } from "../../../config/api";
import { User } from "../types";

/**
 * Update user profile information
 */
export async function updateUserProfile(userData: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
}): Promise<User> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/user/${userData.id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            email: userData.email,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Failed to update profile: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Change user password
 */
export async function changePassword(data: {
    currentPassword: string;
    newPassword: string;
}): Promise<void> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/users/change-password`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Failed to change password: ${response.status}`
        );
    }
}
