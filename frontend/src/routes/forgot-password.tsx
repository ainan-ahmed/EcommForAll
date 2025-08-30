import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "../domains/auth/components/ForgotPasswordPage";

export const Route = createFileRoute("/forgot-password")({
    component: ForgotPasswordRoute,
});

export function ForgotPasswordRoute() {
    return <ForgotPasswordPage />;
}
