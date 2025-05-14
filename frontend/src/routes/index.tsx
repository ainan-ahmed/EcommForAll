import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "../shared/components/HomePage";

export const Route = createFileRoute("/")({
    component: HomePage,
});
