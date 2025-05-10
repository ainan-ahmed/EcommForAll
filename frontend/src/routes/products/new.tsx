import { createFileRoute } from "@tanstack/react-router";
import { ProductCreate } from "../../domains/product/components/ProductCreate";

export const Route = createFileRoute("/products/new")({
    component: ProductCreatePage,
});

export function ProductCreatePage() {
    return <ProductCreate />;
}
