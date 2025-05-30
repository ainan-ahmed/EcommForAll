import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../domains/user/types";

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
                    const response = await fetch(`${API.BASE_URL}/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const user = await response.json();
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
