import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "../domains/auth/components/ResetPasswordPage";

export const Route = createFileRoute("/reset-password")({
    component: ResetPasswordRoute,
    validateSearch: (search: Record<string, unknown>) => {
        return {
            token: search.token as string,
        };
    },
});

export function ResetPasswordRoute() {
    const { token } = Route.useSearch();
    return <ResetPasswordPage token={token} />;
}
