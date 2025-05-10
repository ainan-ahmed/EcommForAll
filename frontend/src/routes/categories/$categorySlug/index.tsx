import { createFileRoute } from "@tanstack/react-router";
import { CategoryDetails } from "../../../domains/category/components/CategoryDetails";

export const Route = createFileRoute("/categories/$categorySlug/")({
  component: RouteComponent,
});

export function RouteComponent() {
  const categorySlug = Route.useParams().categorySlug;
  return <CategoryDetails slug={categorySlug}/>;
}
