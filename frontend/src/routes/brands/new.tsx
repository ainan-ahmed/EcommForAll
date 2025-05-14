import { createFileRoute } from "@tanstack/react-router";
import { BrandCreate } from "../../domains/brand/components/BrandCreate";
import { authGuard } from "../../shared/utils/authGuard";

export const Route = createFileRoute("/brands/new")({
    beforeLoad: authGuard,
    component: BrandCreatePage,
});

export function BrandCreatePage() {
    return <BrandCreate />;
}
