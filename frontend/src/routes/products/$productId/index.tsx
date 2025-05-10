import { createFileRoute, useParams } from "@tanstack/react-router";
import { ProductDetails } from "../../../domains/product/components/ProductDetails";

export const Route = createFileRoute("/products/$productId/")({
    component: ProductDetailRoute,
});

export function ProductDetailRoute() {
    const { productId } = Route.useParams();
    return <ProductDetails id={productId} />;
}
