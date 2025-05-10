import { createFileRoute } from "@tanstack/react-router";
import { CategoryEdit } from "../../../domains/category/components/CategoryEdit";

export const Route = createFileRoute("/categories/$categorySlug/edit")({
    component: RouteComponent,
});

export function RouteComponent() {
    const categorySlug = Route.useParams().categorySlug;
    return <CategoryEdit slug={categorySlug} />;
}
