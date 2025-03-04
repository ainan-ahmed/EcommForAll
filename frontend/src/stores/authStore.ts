import { create } from 'zustand';

interface AuthState {
    user: string | null;
    isAuthenticated: boolean;
    login: (user: string) => void;
    logout: () => void;
}

export const authStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));