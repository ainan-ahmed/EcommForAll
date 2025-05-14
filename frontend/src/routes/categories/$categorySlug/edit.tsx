import { createFileRoute } from "@tanstack/react-router";
import { CategoryEdit } from "../../../domains/category/components/CategoryEdit";
import { authGuard } from "../../../shared/utils/authGuard";

export const Route = createFileRoute("/categories/$categorySlug/edit")({
    beforeLoad: authGuard,
    component: RouteComponent,
});

export function RouteComponent() {
    const categorySlug = Route.useParams().categorySlug;
    return <CategoryEdit slug={categorySlug} />;
}
