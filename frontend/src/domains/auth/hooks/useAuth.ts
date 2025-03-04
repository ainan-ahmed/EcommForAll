import { useStore } from 'zustand';
import { authStore } from '../../../stores/authStore';

export function useAuth() {
    const { user, isAuthenticated, login, logout } = useStore(authStore);
    return { user, isAuthenticated, login, logout };
}