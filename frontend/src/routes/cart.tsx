// src/routes/cart.tsx
import { createFileRoute } from "@tanstack/react-router";
import { AllCartDetails } from "../domains/cart/components/AllCartDetails";

export const Route = createFileRoute("/cart")({
    component: AllCartDetails,
});
