import { createFileRoute } from "@tanstack/react-router";
import { CategoryCreate } from "../../domains/category/components/CategoryCreate";
import { authGuard } from "../../shared/utils/authGuard";

export const Route = createFileRoute("/categories/new")({
    beforeLoad: authGuard,
    component: CategoryCreatePage,
});

export function CategoryCreatePage() {
    return <CategoryCreate />;
}
