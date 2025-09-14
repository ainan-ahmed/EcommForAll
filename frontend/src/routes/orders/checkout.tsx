import { createFileRoute } from "@tanstack/react-router";
import { CheckoutForm } from "../../domains/order/components/CheckoutForm";

export const Route = createFileRoute("/orders/checkout")({
    component: CheckoutPage,
});

export function CheckoutPage() {
    return <CheckoutForm totalAmount={0} onComplete={() => {}} />;
}
