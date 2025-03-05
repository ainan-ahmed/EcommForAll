import { LoginFormValues, RegisterFormValues } from "../../../types/formTypes.ts";

export async function login(data: LoginFormValues) {
    const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok)
    {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
    }
    return response.json(); // { user: string, token: string }
}

export async function register(data: RegisterFormValues) {
    const { confirmPassword, ...registerData } = data;


    const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
    }

    return response.json(); // { user: string, token: string }
}