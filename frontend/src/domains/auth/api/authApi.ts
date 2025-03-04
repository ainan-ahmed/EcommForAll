import {LoginFormValues} from "../../../types/formTypes.ts";

export async function login(data: LoginFormValues) {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json(); // { user: string, token: string }
}