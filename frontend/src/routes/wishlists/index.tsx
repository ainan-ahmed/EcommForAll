import { createFileRoute } from "@tanstack/react-router";
import { WishlistsPage } from "../../domains/user/components/WishlistsPage";
import { authGuard } from "../../shared/utils/authGuard";

export const Route = createFileRoute("/wishlists/")({
    beforeLoad: authGuard,
    component: WishlistsComponent,
});

function WishlistsComponent() {
    return <WishlistsPage />;
}
