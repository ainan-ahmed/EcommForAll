// src/domains/auth/hooks/useLogout.ts
import { useNavigate } from "@tanstack/react-router";
import { notifications } from "@mantine/notifications";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";

export function useLogout() {
    const logout = useStore(authStore, (state) => state.logout);
    const navigate = useNavigate();

    return () => {
        // Clear token from localStorage
        localStorage.removeItem("authToken");

        // Update global state
        logout();

        // Show notification
        notifications.show({
            title: "Success",
            position: "top-center",
            message: "Logged out successfully",
            color: "blue",
        });

        // Redirect to login page
        navigate({ to: "/" });
    };
}
