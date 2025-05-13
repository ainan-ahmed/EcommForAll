import { createFileRoute } from '@tanstack/react-router'
import { WishlistsPage } from '../../domains/product/components/WishlistsPage';

export const Route = createFileRoute("/wishlists/")({
    component: WishlistsComponent,
});

function WishlistsComponent() {
  return <WishlistsPage />;
}
