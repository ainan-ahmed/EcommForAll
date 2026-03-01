import { createFileRoute } from "@tanstack/react-router";
import { AllCategories } from "../../domains/category/components/AllCategories.tsx";

export const Route = createFileRoute("/categories/")({
    component: CategoriesPage,
});

export function CategoriesPage() {
    return <AllCategories />;
}
