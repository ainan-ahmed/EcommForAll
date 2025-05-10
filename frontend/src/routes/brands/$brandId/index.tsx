import { createFileRoute } from "@tanstack/react-router";
import { BrandDetails } from "../../../domains/brand/components/BrandDetails";

export const Route = createFileRoute("/brands/$brandId/")({
    component: RouteComponent,
});

export function RouteComponent() {
    const brandId = Route.useParams().brandId;
    return <BrandDetails id={brandId} />;
}
