import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useStore } from 'zustand';
import { LoginFormValues } from '../../../types/formTypes';
import { login } from '../api/authApi';
import { authStore } from '../../../stores/authStore';
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
            setAuth(response.user); // Update global auth state
            notifications.show({ title: 'Success', message: 'Logged in!', color: 'green' });
            onSuccess?.(response); // Call optional callback
        },
        onError: (error: Error) => {
            notifications.show({ title: 'Error', message: error.message, color: 'red' });
            onError?.(error); // Call optional error callback
        },
    });
}