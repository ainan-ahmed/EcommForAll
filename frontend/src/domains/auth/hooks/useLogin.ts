import { useMutation } from "@tanstack/react-query";
import { useStore } from "zustand";
import { LoginFormValues } from "../types";
import { login } from "../api/authApi";
import { authStore } from "../../../stores/authStore";
// import { NavigateOptions } from '@tanstack/react-router';

interface UseLoginOptions {
    onSuccess?: (response: { user: string }) => void; // Additional success callback
    onError?: (error: Error) => void; // Custom error handling
}

export function useLogin(options: UseLoginOptions = {}) {
    const setAuth = useStore(authStore, (state) => state.login);
    const { onSuccess, onError } = options;

    return useMutation({
        mutationFn: (data: LoginFormValues) => login(data),
        onSuccess: (response) => {
            const { user, token } = response;
            // console.log(response);
            localStorage.setItem("authToken", token);
            setAuth(user); // Update global auth state
            onSuccess?.(response); // Call optional callback
        },
        onError: (error: Error) => {
            // console.error('Login failed:', error.message);
            onError?.(error); // Call optional error callback
        },
    });
}
