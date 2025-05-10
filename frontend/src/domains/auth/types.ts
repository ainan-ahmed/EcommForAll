export interface LoginFormValues {
    username: string;
    password: string;
}

export interface RegisterFormValues {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    createdAt: string | null;
    updatedAt: string | null;
    role: "ADMIN" | "SELLER" | "CUSTOMER" | string; // Add other roles if needed
}