import { createFileRoute } from "@tanstack/react-router";
import { BrandCreate } from "../../domains/brand/components/BrandCreate";

export const Route = createFileRoute("/brands/new")({
    component: BrandCreatePage,
});

export function BrandCreatePage() {
    return <BrandCreate />;
}
