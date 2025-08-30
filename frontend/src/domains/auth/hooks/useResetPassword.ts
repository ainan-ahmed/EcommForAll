import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { ResetPasswordFormValues, ResetPasswordResponse } from "../types";
import { resetPassword } from "../api/authApi";

interface UseResetPasswordOptions {
    onSuccess?: (data: ResetPasswordResponse) => void;
    onError?: (error: Error) => void;
}

export function useResetPassword(options: UseResetPasswordOptions = {}) {
    const { onSuccess, onError } = options;

    return useMutation({
        mutationFn: (data: ResetPasswordFormValues) => resetPassword(data),
        onSuccess: (data) => {
            notifications.show({
                title: "Password Reset Successfully",
                message: "Your password has been reset. You can now log in with your new password.",
                color: "green",
                position: "top-center",
            });
            onSuccess?.(data);
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message || "Failed to reset password",
                color: "red",
                position: "top-center",
            });
            onError?.(error);
        },
    });
}
