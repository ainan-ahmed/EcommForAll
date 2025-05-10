import { createFileRoute } from "@tanstack/react-router";
import { BrandEdit } from "../../../domains/brand/components/BrandEdit";

export const Route = createFileRoute("/brands/$brandId/edit")({
    component: RouteComponent,
});

export function RouteComponent() {
    const brandId = Route.useParams().brandId;
    return <BrandEdit id={brandId} />;
}
