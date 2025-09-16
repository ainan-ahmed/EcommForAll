import { createFileRoute } from "@tanstack/react-router";
import { AdminOrderList } from "../../domains/order/components/AdminOrderList";

export const Route = createFileRoute("/orders/admin")({
    component: AdminOrdersPage,
});

export function AdminOrdersPage() {
    return (
        <AdminOrderList
            orders={[]}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onOrderView={() => {}}
            onStatusUpdate={() => {}}
            onRefund={() => {}}
        />
    );
}
