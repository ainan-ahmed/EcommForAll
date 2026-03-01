import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
    fetchAllOrders,
    fetchSellerOrders,
    fetchOrderByIdAdmin,
    updateOrderStatus,
    forceCancelOrder,
    fetchOrderStats,
    updateShippingDetails,
    updatePaymentStatus,
    bulkUpdateOrderStatus,
    exportOrdersToCSV,
    fetchOrderAuditLog,
    processRefund,
    markOrderAsShipped,
    confirmOrder,
} from "../api/adminOrderApi";
import { OrderQueryParams, OrderStatus, ShippingDetails } from "../types";

// =====================================
// ADMIN QUERY HOOKS
// =====================================

/**
 * Hook to fetch all orders (admin privilege)
 */
export function useAllOrders(params: OrderQueryParams = {}) {
    return useQuery({
        queryKey: ["admin", "orders", "all", params],
        queryFn: () => fetchAllOrders(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to fetch seller orders (seller privilege)
 */
export function useSellerOrders(sellerId: string, params: OrderQueryParams = {}) {
    return useQuery({
        queryKey: ["seller", "orders", sellerId, params],
        queryFn: () => fetchSellerOrders(sellerId, params),
        enabled: !!sellerId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to fetch any order by ID (admin/seller privilege)
 */
export function useOrderAdmin(orderId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: ["admin", "orders", orderId],
        queryFn: () => fetchOrderByIdAdmin(orderId),
        enabled: enabled && !!orderId,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}

/**
 * Hook to fetch order statistics (admin/seller dashboard)
 */
export function useOrderStatsAdmin(sellerId?: string, dateFrom?: string, dateTo?: string) {
    return useQuery({
        queryKey: ["admin", "orders", "stats", { sellerId, dateFrom, dateTo }],
        queryFn: () => fetchOrderStats(sellerId, dateFrom, dateTo),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch order audit log (admin privilege)
 */
export function useOrderAuditLog(orderId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: ["admin", "orders", orderId, "audit"],
        queryFn: () => fetchOrderAuditLog(orderId),
        enabled: enabled && !!orderId,
        staleTime: 30 * 1000, // 30 seconds
    });
}

// =====================================
// ADMIN MUTATION HOOKS
// =====================================

/**
 * Hook to update order status (admin/seller privilege)
 */
export function useUpdateOrderStatusAdmin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            status,
            notes,
            trackingNumber,
            estimatedDelivery,
        }: {
            orderId: string;
            status: OrderStatus;
            notes?: string;
            trackingNumber?: string;
            estimatedDelivery?: string;
        }) => updateOrderStatus(orderId, status, notes, trackingNumber, estimatedDelivery),
        onSuccess: (updatedOrder) => {
            // Update the specific order in cache
            queryClient.setQueryData(["admin", "orders", updatedOrder.id], updatedOrder);
            queryClient.setQueryData(["orders", updatedOrder.id], updatedOrder);

            // Invalidate orders lists and stats
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["seller", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["orders", "user"] });
            queryClient.invalidateQueries({
                queryKey: ["admin", "orders", "stats"],
            });

            notifications.show({
                title: "Order Status Updated",
                message: `Order #${updatedOrder.orderNumber} status changed to ${updatedOrder.status}`,
                color: "blue",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Status Update Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to force cancel order (admin privilege)
 */
export function useForceCancelOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            reason,
            refundAmount,
        }: {
            orderId: string;
            reason: string;
            refundAmount?: number;
        }) => forceCancelOrder(orderId, reason, refundAmount),
        onSuccess: (cancelledOrder) => {
            // Update the specific order in cache
            queryClient.setQueryData(["admin", "orders", cancelledOrder.id], cancelledOrder);
            queryClient.setQueryData(["orders", cancelledOrder.id], cancelledOrder);

            // Invalidate orders lists
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["orders", "user"] });

            notifications.show({
                title: "Order Force Cancelled",
                message: `Order #${cancelledOrder.orderNumber} has been force cancelled`,
                color: "orange",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Force Cancel Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to update shipping details (admin/seller privilege)
 */
export function useUpdateShippingDetails() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            shippingDetails,
        }: {
            orderId: string;
            shippingDetails: Partial<ShippingDetails>;
        }) => updateShippingDetails(orderId, shippingDetails),
        onSuccess: (updatedOrder) => {
            // Update the specific order in cache
            queryClient.setQueryData(["admin", "orders", updatedOrder.id], updatedOrder);
            queryClient.setQueryData(["orders", updatedOrder.id], updatedOrder);

            // Invalidate orders lists
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["seller", "orders"] });

            notifications.show({
                title: "Shipping Details Updated",
                message: `Shipping details for order #${updatedOrder.orderNumber} have been updated`,
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Shipping Update Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to update payment status (admin privilege)
 */
export function useUpdatePaymentStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            paymentStatus,
            transactionId,
            notes,
        }: {
            orderId: string;
            paymentStatus: string;
            transactionId?: string;
            notes?: string;
        }) => updatePaymentStatus(orderId, paymentStatus, transactionId, notes),
        onSuccess: (paymentDetails) => {
            // Invalidate orders and payment details
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });

            notifications.show({
                title: "Payment Status Updated",
                message: `Payment status has been updated to ${paymentDetails.paymentStatus}`,
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Payment Update Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to bulk update order status (admin privilege)
 */
export function useBulkUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderIds,
            status,
            notes,
        }: {
            orderIds: string[];
            status: OrderStatus;
            notes?: string;
        }) => bulkUpdateOrderStatus(orderIds, status, notes),
        onSuccess: (updatedOrders) => {
            // Invalidate all orders queries
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["seller", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["orders", "user"] });
            queryClient.invalidateQueries({
                queryKey: ["admin", "orders", "stats"],
            });

            notifications.show({
                title: "Bulk Update Successful",
                message: `${updatedOrders.length} orders have been updated`,
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Bulk Update Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to export orders to CSV (admin privilege)
 */
export function useExportOrdersToCSV() {
    return useMutation({
        mutationFn: (params: OrderQueryParams = {}) => exportOrdersToCSV(params),
        onSuccess: (blob) => {
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `orders-export-${new Date().toISOString().split("T")[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            notifications.show({
                title: "Export Successful",
                message: "Orders have been exported to CSV",
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Export Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to process refund (admin privilege)
 */
export function useProcessRefund() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            refundData,
        }: {
            orderId: string;
            refundData: {
                amount: number;
                reason: string;
                refundMethod?: string;
                notes?: string;
                items?: Array<{
                    orderItemId: string;
                    quantity: number;
                    amount: number;
                }>;
            };
        }) => processRefund(orderId, refundData),
        onSuccess: (refundedOrder) => {
            // Update the specific order in cache
            queryClient.setQueryData(["admin", "orders", refundedOrder.id], refundedOrder);
            queryClient.setQueryData(["orders", refundedOrder.id], refundedOrder);

            // Invalidate orders lists
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["orders", "user"] });

            notifications.show({
                title: "Refund Processed",
                message: `Refund has been processed for order #${refundedOrder.orderNumber}`,
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Refund Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to mark order as shipped (seller privilege)
 */
export function useMarkOrderAsShipped() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            shippingData,
        }: {
            orderId: string;
            shippingData: {
                carrier: string;
                trackingNumber: string;
                shippingMethod: string;
                estimatedDelivery?: string;
                notes?: string;
            };
        }) => markOrderAsShipped(orderId, shippingData),
        onSuccess: (shippedOrder) => {
            // Update the specific order in cache
            queryClient.setQueryData(["admin", "orders", shippedOrder.id], shippedOrder);
            queryClient.setQueryData(["orders", shippedOrder.id], shippedOrder);

            // Invalidate orders lists
            queryClient.invalidateQueries({ queryKey: ["seller", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });

            notifications.show({
                title: "Order Shipped",
                message: `Order #${shippedOrder.orderNumber} has been marked as shipped`,
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Ship Order Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to confirm order (seller privilege)
 */
export function useConfirmOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            estimatedProcessingTime,
        }: {
            orderId: string;
            estimatedProcessingTime?: string;
        }) => confirmOrder(orderId, estimatedProcessingTime),
        onSuccess: (confirmedOrder) => {
            // Update the specific order in cache
            queryClient.setQueryData(["admin", "orders", confirmedOrder.id], confirmedOrder);
            queryClient.setQueryData(["orders", confirmedOrder.id], confirmedOrder);

            // Invalidate orders lists
            queryClient.invalidateQueries({ queryKey: ["seller", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });

            notifications.show({
                title: "Order Confirmed",
                message: `Order #${confirmedOrder.orderNumber} has been confirmed`,
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Order Confirmation Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}
