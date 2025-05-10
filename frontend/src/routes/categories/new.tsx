import { createFileRoute } from "@tanstack/react-router";
import { CategoryCreate } from "../../domains/category/components/CategoryCreate";

export const Route = createFileRoute("/categories/new")({
    component: CategoryCreatePage,
});

export function CategoryCreatePage() {
    return <CategoryCreate />;
}
