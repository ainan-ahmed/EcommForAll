import { createFileRoute } from "@tanstack/react-router";
import { AllBrands } from "../../domains/brand/components/AllBrands";

export const Route = createFileRoute("/brands/")({
    component: BrandsPage,
});

export function BrandsPage() {
    return <AllBrands />;
}
