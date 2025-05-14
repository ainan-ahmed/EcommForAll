import { createFileRoute } from "@tanstack/react-router";
import { BrandEdit } from "../../../domains/brand/components/BrandEdit";
import { authGuard } from "../../../shared/utils/authGuard";

export const Route = createFileRoute("/brands/$brandId/edit")({
    beforeLoad: authGuard,
    component: RouteComponent,
});

export function RouteComponent() {
    const brandId = Route.useParams().brandId;
    return <BrandEdit id={brandId} />;
}
