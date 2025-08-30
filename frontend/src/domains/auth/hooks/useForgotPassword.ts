import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { ForgotPasswordFormValues, ForgotPasswordResponse } from "../types";
import { forgotPassword } from "../api/authApi";

interface UseForgotPasswordOptions {
    onSuccess?: (data: ForgotPasswordResponse) => void;
    onError?: (error: Error) => void;
}

export function useForgotPassword(options: UseForgotPasswordOptions = {}) {
    const { onSuccess, onError } = options;

    return useMutation({
        mutationFn: (data: ForgotPasswordFormValues) => forgotPassword(data),
        onSuccess: (data) => {
            notifications.show({
                title: "Reset Email Sent",
                message: "If an account with that email exists, you will receive a password reset link.",
                color: "green",
                position: "top-center",
            });
            onSuccess?.(data);
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message || "Failed to send reset email",
                color: "red",
                position: "top-center",
            });
            onError?.(error);
        },
    });
}
