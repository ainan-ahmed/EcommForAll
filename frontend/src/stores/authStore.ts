import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../domains/auth/types";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
}

export const authStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (user) => set({ user, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: "auth-storage", // unique name for localStorage key
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            // Optional: you can customize storage
            // storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead
        }
    )
);
