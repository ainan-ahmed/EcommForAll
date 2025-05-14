import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProductEdit } from "../../../domains/product/components/ProductEdit";
import { sellerGuard } from "../../../shared/utils/authGuard";

export const Route = createFileRoute("/products/$productId/edit")({
    beforeLoad: sellerGuard,
    component: ProductEditRoute,
});

export function ProductEditRoute() {
    const { productId } = Route.useParams();
    // console.log("Product ID:", productId);
    return <ProductEdit id={productId} />;
}
