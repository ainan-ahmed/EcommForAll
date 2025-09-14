import { createFileRoute } from "@tanstack/react-router";
import { OrderDetails } from "../../../domains/order/components/OrderDetails";

export const Route = createFileRoute("/orders/$orderId/")({
    component: OrderDetailsPage,
});

export function OrderDetailsPage() {
    const { orderId } = Route.useParams();
    return <OrderDetails orderId={orderId as string} />;
}
