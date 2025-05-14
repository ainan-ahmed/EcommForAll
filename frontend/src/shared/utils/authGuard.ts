import { redirect } from "@tanstack/react-router";
import { authStore } from "../../stores/authStore";

/**
 * Authentication guard for protected routes
 * Use in route's beforeLoad to redirect unauthenticated users to login
 */
export function authGuard({ location }: { location: { href: string } }) {
    const { isAuthenticated } = authStore.getState();
    if (!isAuthenticated) {
        throw redirect({
            to: "/login",
            search: { redirect: location.href },
            replace: true,
        });
    }
}

export function sellerGuard({ location }: { location: { href: string } }) {
    const { isAuthenticated, user } = authStore.getState();

    if (!isAuthenticated || (user?.role !== "SELLER" && user?.role !== "ADMIN")) {
        throw redirect({
            to: "/login",
            search: { redirect: location.href },
            replace: true,
        });
    }
}

export function adminGuard({ location }: { location: { href: string } }) {
    const { isAuthenticated, user } = authStore.getState();

    if (!isAuthenticated || user?.role !== "ADMIN") {
        throw redirect({
            to: "/login",
            search: { redirect: location.href },
            replace: true,
        });
    }
}
