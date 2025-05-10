import { createFileRoute } from "@tanstack/react-router";
import { AllProducts } from "../../domains/product/components/AllProducts";

export const Route = createFileRoute("/products/")({
    component: ProductsPage,
});

export function ProductsPage() {
    return <AllProducts />;
}
