import { redirect } from "@tanstack/react-router";
import { authStore } from "../../stores/authStore";

/**
 * Authentication guard for protected routes
 * Use in route's beforeLoad to redirect unauthenticated users to login
 */
export async function authGuard({ location }: { location: { href: string } }) {
    // Get the initial auth state
    const { isAuthenticated } = authStore.getState();

    // If not authenticated by the stored state, try to refresh auth state
    if (!isAuthenticated) {
        // Call checkAuth and wait for it to complete
        // This validates the token with the server
        await authStore.getState().checkAuth();

        // Check the updated auth state
        const { isAuthenticated: refreshedAuth } = authStore.getState();

        if (!refreshedAuth) {
            throw redirect({
                to: "/login",
                search: { redirect: location.href },
                replace: true,
            });
        }
    }

    // User is authenticated, allow access
    return;
}

export async function sellerGuard({ location }: { location: { href: string } }) {
    // Get the initial auth state
    const { isAuthenticated, user } = authStore.getState();

    // If not authenticated or no user data, try to refresh auth state
    if (!isAuthenticated || !user) {
        await authStore.getState().checkAuth();

        // Check the updated auth state
        const { isAuthenticated: refreshedAuth, user: refreshedUser } = authStore.getState();

        if (
            !refreshedAuth ||
            (refreshedUser?.role !== "SELLER" && refreshedUser?.role !== "ADMIN")
        ) {
            throw redirect({
                to: "/login",
                search: { redirect: location.href },
                replace: true,
            });
        }
    } else if (user.role !== "SELLER" && user.role !== "ADMIN") {
        // User is authenticated but not a seller or admin
        throw redirect({
            to: "/products",
            replace: true,
        });
    }

    // User is authenticated and has the right role
    return;
}

export async function adminGuard({ location }: { location: { href: string } }) {
    // Get the initial auth state
    const { isAuthenticated, user } = authStore.getState();

    // If not authenticated or no user data, try to refresh auth state
    if (!isAuthenticated || !user) {
        await authStore.getState().checkAuth();

        // Check the updated auth state
        const { isAuthenticated: refreshedAuth, user: refreshedUser } = authStore.getState();

        if (!refreshedAuth || refreshedUser?.role !== "ADMIN") {
            throw redirect({
                to: "/login",
                search: { redirect: location.href },
                replace: true,
            });
        }
    } else if (user.role !== "ADMIN") {
        // User is authenticated but not an admin
        throw redirect({
            to: "/products",
            replace: true,
        });
    }

    // User is authenticated and has the right role
    return;
}
