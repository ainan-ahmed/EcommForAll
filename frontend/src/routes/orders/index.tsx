import { createFileRoute } from "@tanstack/react-router";
import { OrderList } from "../../domains/order/components/OrderList";

export const Route = createFileRoute("/orders/")({
    component: OrdersPage,
});

export function OrdersPage() {
    return <OrderList />;
}
