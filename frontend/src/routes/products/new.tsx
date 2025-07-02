import { createFileRoute } from "@tanstack/react-router";
import { ProductCreate } from "../../domains/product/components/ProductCreate";
import { sellerGuard } from "../../shared/utils/authGuard";

export const Route = createFileRoute("/products/new")({
    beforeLoad: sellerGuard,
    component: ProductCreatePage,
});

export function ProductCreatePage() {
    return <ProductCreate />;
}
