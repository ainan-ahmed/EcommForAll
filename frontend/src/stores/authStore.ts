import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../domains/user/types";
import { API } from "../config/api";
import { getCurrentUser, validateToken } from "../domains/auth/api/authApi";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    login: (user: User) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const authStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setUser: (user) => set({ user }),
            checkAuth: async () => {
                
                const token = localStorage.getItem("authToken");

                if (!token) {
                    set({ user: null, isAuthenticated: false });
                    return;
                }

                try {
                    // Make a request to validate the token
                    const isValid = await validateToken();

                    if (isValid) {
                        const user: User = await getCurrentUser();
                        set({ user, isAuthenticated: true });
                    } else {
                        // If token is invalid, clear auth state
                        localStorage.removeItem("authToken");
                        set({ user: null, isAuthenticated: false });
                    }
                } catch (error) {
                    // On error, clear auth state
                    localStorage.removeItem("authToken");
                    set({ user: null, isAuthenticated: false });
                }
            },
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
