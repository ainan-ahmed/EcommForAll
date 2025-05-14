import { createFileRoute } from "@tanstack/react-router";
import { ProductCreate } from "../../domains/product/components/ProductCreate";
import { authGuard } from "../../shared/utils/authGuard";

export const Route = createFileRoute("/products/new")({
    beforeLoad: authGuard,
    component: ProductCreatePage,
});

export function ProductCreatePage() {
    return <ProductCreate />;
}
