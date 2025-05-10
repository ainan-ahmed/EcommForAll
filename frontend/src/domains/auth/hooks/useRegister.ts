import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useStore } from "zustand";
import { RegisterFormValues } from "../types";
import { login, register } from "../api/authApi";
import { authStore } from "../../../stores/authStore";

interface UseRegisterOptions {
    onSuccess?: (response: { user: string; token: string }) => void;
    onError?: (error: Error) => void;
}

export function useRegister(options: UseRegisterOptions = {}) {
    const setAuth = useStore(authStore, (state) => state.login);
    const { onSuccess, onError } = options;

    return useMutation({
        mutationFn: async (data: RegisterFormValues) => {
            await register(data);
            const loginResponse = await login({
                username: data.username,
                password: data.password,
            });

            return {
                user: loginResponse.user,
                token: loginResponse.token,
            };
        },
        onSuccess: (response) => {
            //get token . i am not getting token from register api
            // login api will return token
            // get token from login api
            const { user, token } = response;
            localStorage.setItem("authToken", token);
            setAuth(user); // Update global auth state
            notifications.show({
                title: "Success",
                position: "top-center",
                message: "Registration successful!",
                color: "green",
            });
            onSuccess?.(response);
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                position: "top-center",
                message: error.message,
                color: "red",
            });
            onError?.(error);
        },
    });
}
