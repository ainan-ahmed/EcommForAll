import { createFileRoute } from "@tanstack/react-router";
import { UserProfile } from "../../domains/user/components/UserProfile";
import { authGuard } from "../../shared/utils/authGuard";

export const Route = createFileRoute("/profile/")({
    beforeLoad: authGuard,
    component: UserProfilePage,
});

function UserProfilePage() {
    return <UserProfile />;
}
