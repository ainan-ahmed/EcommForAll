import { createFileRoute } from '@tanstack/react-router'
import { WishlistDetailsPage } from "../../../domains/product/components/WishlistDetails";

export const Route = createFileRoute("/wishlists/$wishlistId/")({
    component: WishlistComponent,
});

function WishlistComponent() {
  const { wishlistId } = Route.useParams();
  console.log("WishlistComponent", wishlistId);
  return <WishlistDetailsPage wishlistId={wishlistId} />;
}
