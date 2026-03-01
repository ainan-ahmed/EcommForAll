import { API } from "../../../config/api.ts";
import {
    LoginFormValues,
    RegisterFormValues,
    ForgotPasswordFormValues,
    ResetPasswordFormValues,
    ForgotPasswordResponse,
    ResetPasswordResponse,
} from "../types.ts";

export async function login(data: LoginFormValues) {
    console.log("Login data:", data); // Debugging line to check the data being sent
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.AUTH.LOGIN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
    }
    return response.json(); // { user: string, token: string }
}

export async function register(data: RegisterFormValues) {
    const { confirmPassword, ...registerData } = data;

    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.AUTH.REGISTER}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Registration failed");
    }

    return response.json(); // { user: string, token: string }
}
export async function validateToken(): Promise<boolean> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return false;
    }

    try {
        const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.AUTH.VALIDATE}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.ok;
    } catch (error) {
        console.error("Token validation failed:", error);
        return false;
    }
}
export async function getCurrentUser() {
    const token = localStorage.getItem("authToken");
    if (!token) {
        throw new Error("No authentication token found");
    }

    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.AUTH.CURRENT_USER}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch current user");
    }

    return response.json();
}

export async function forgotPassword(
    data: ForgotPasswordFormValues
): Promise<ForgotPasswordResponse> {
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.AUTH.FORGOT_PASSWORD}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send reset email");
    }

    return response.json();
}

export async function resetPassword(data: ResetPasswordFormValues): Promise<ResetPasswordResponse> {
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.AUTH.RESET_PASSWORD}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to reset password");
    }

    return response.json();
}
