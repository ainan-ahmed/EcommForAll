import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProductEdit } from "../../../domains/product/components/ProductEdit";
import { authStore } from "../../../stores/authStore";
import { Product } from "../../../domains/product/types";

export const Route = createFileRoute("/products/$productId/edit")({
    beforeLoad: ({ location }) => {
        // Check authentication first
        if (!authStore.getState().isAuthenticated) {
            throw redirect({
                to: "/login",
                search: { redirect: location.href },
                replace: true,
            });
        }
    },
    component: ProductEditRoute,
});

export function ProductEditRoute() {
    const { productId } = Route.useParams();
    // console.log("Product ID:", productId);
    return <ProductEdit id={productId} />;
}
