import { createFileRoute } from "@tanstack/react-router";
import { WishlistDetails } from "../../../domains/user/components/WishlistDetails";
import { authGuard } from "../../../shared/utils/authGuard";

export const Route = createFileRoute("/wishlists/$wishlistId/")({
    beforeLoad: authGuard,
    component: WishlistComponent,
});

function WishlistComponent() {
    const { wishlistId } = Route.useParams();
    console.log("WishlistComponent", wishlistId);
    return <WishlistDetails wishlistId={wishlistId} />;
}
