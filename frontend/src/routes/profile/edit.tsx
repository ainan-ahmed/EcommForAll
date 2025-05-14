import { createFileRoute } from "@tanstack/react-router";
import { EditUserProfile } from "../../domains/user/components/EditUserProfile";
import { authGuard } from "../../shared/utils/authGuard";

export const Route = createFileRoute("/profile/edit")({
    beforeLoad: authGuard,
    component: EditUserProfilePage,
});

function EditUserProfilePage() {
    return <EditUserProfile />;
}
