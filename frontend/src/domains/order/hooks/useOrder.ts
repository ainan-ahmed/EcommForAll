import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
    fetchUserOrders,
    fetchOrderById,
    createOrder,
    updateOrder,
    cancelOrder,
    createCheckoutSession,
    fetchCheckoutSession,
    updateCheckoutSession,
    completeCheckout,
    updateOrderShippingAddress,
    trackOrder,
    fetchOrderPaymentDetails,
    reorder,
    createOrderFromCart,
} from "../api/orderApi";
import {
    CreateOrderRequest,
    UpdateOrderRequest,
    OrderQueryParams,
    CheckoutSession,
    ShippingAddress,
    OrdersResponse,
    Order,
    OrderSummary,
} from "../types";

// =====================================
// QUERY HOOKS
// =====================================

/**
 * Hook to fetch user orders with pagination and filtering
 */
export function useUserOrders(params: OrderQueryParams) {
    return useQuery<OrdersResponse, Error>({
        queryKey: ["orders", "user", params],
        queryFn: () => fetchUserOrders(params),
        staleTime: 30000, // 30 seconds
    });
}

/**
 * Hook to fetch a specific order by ID
 */
export function useOrder(orderId: string) {
    return useQuery<Order, Error>({
        queryKey: ["orders", orderId],
        queryFn: () => fetchOrderById(orderId),
        enabled: !!orderId,
        staleTime: 60000, // 1 minute
    });
}

/**
 * Hook to fetch order statistics (admin/seller functionality moved to separate hooks)
 */
export function useOrderStats() {
    return useQuery({
        queryKey: ["orders", "stats"],
        queryFn: () => {
            throw new Error("Order stats functionality moved to admin hooks");
        },
        enabled: false, // Disabled - use admin hooks instead
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

/**
 * Hook to fetch checkout session
 */
export function useCheckoutSession(sessionId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: ["checkout", "session", sessionId],
        queryFn: () => fetchCheckoutSession(sessionId),
        enabled: enabled && !!sessionId,
        staleTime: 30 * 1000, // 30 seconds (checkout sessions are time-sensitive)
    });
}

/**
 * Hook to track an order
 */
export function useTrackOrder(trackingInfo: string, enabled: boolean = true) {
    return useQuery({
        queryKey: ["orders", "track", trackingInfo],
        queryFn: () => trackOrder(trackingInfo),
        enabled: enabled && !!trackingInfo,
        staleTime: 60 * 1000, // 1 minute
    });
}

/**
 * Hook to fetch order payment details
 */
export function useOrderPaymentDetails(
    orderId: string,
    enabled: boolean = true
) {
    return useQuery({
        queryKey: ["orders", orderId, "payment"],
        queryFn: () => fetchOrderPaymentDetails(orderId),
        enabled: enabled && !!orderId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// =====================================
// MUTATION HOOKS
// =====================================

/**
 * Hook to create a new order
 */
export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderData: CreateOrderRequest) => createOrder(orderData),
        onSuccess: (newOrder) => {
            // Invalidate and refetch orders
            queryClient.invalidateQueries({ queryKey: ["orders"] });

            // Add the new order to cache
            queryClient.setQueryData(["orders", newOrder.id], newOrder);

            notifications.show({
                title: "Order Created",
                message: `Order #${newOrder.orderNumber} has been created successfully`,
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Order Creation Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to update an order
 */
export function useUpdateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            orderData,
        }: {
            orderId: string;
            orderData: UpdateOrderRequest;
        }) => updateOrder(orderId, orderData),
        onSuccess: (updatedOrder) => {
            // Update the specific order in cache
            queryClient.setQueryData(["orders", updatedOrder.id], updatedOrder);

            // Invalidate orders list to refresh
            queryClient.invalidateQueries({ queryKey: ["orders", "user"] });

            notifications.show({
                title: "Order Updated",
                message: `Order #${updatedOrder.orderNumber} has been updated`,
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Order Update Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to cancel an order
 */
export function useCancelOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            reason,
        }: {
            orderId: string;
            reason?: string;
        }) => cancelOrder(orderId, reason),
        onSuccess: (cancelledOrder) => {
            // Update the specific order in cache
            queryClient.setQueryData(
                ["orders", cancelledOrder.id],
                cancelledOrder
            );

            // Invalidate orders list to refresh
            queryClient.invalidateQueries({ queryKey: ["orders", "user"] });

            notifications.show({
                title: "Order Cancelled",
                message: `Order #${cancelledOrder.orderNumber} has been cancelled`,
                color: "orange",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Order Cancellation Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to update order status (admin/seller functionality moved to separate hooks)
 */
export function useUpdateOrderStatus() {
    return useMutation({
        mutationFn: () => {
            throw new Error(
                "Order status update functionality moved to admin hooks"
            );
        },
        onError: () => {
            notifications.show({
                title: "Access Denied",
                message: "Order status updates require admin/seller privileges",
                color: "red",
            });
        },
    });
}

/**
 * Hook to create a checkout session
 */
export function useCreateCheckoutSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sessionData: {
            items: Array<{
                productId: string;
                variantId?: string;
                quantity: number;
            }>;
        }) => createCheckoutSession(sessionData),
        onSuccess: (session) => {
            // Cache the checkout session
            queryClient.setQueryData(
                ["checkout", "session", session.id],
                session
            );

            notifications.show({
                title: "Checkout Session Created",
                message: "You can now proceed with your order",
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Checkout Session Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to update a checkout session
 */
export function useUpdateCheckoutSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            sessionId,
            sessionData,
        }: {
            sessionId: string;
            sessionData: Partial<CheckoutSession>;
        }) => updateCheckoutSession(sessionId, sessionData),
        onSuccess: (session) => {
            // Update the checkout session in cache
            queryClient.setQueryData(
                ["checkout", "session", session.id],
                session
            );
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Checkout Update Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to complete checkout
 */
export function useCompleteCheckout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sessionId: string) => completeCheckout(sessionId),
        onSuccess: (order) => {
            // Add the new order to cache
            queryClient.setQueryData(["orders", order.id], order);

            // Invalidate orders list
            queryClient.invalidateQueries({ queryKey: ["orders", "user"] });

            // Remove checkout session from cache
            queryClient.removeQueries({ queryKey: ["checkout", "session"] });

            notifications.show({
                title: "Order Placed Successfully",
                message: `Order #${order.orderNumber} has been placed`,
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Checkout Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to update order shipping address
 */
export function useUpdateOrderShippingAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            shippingAddress,
        }: {
            orderId: string;
            shippingAddress: ShippingAddress;
        }) => updateOrderShippingAddress(orderId, shippingAddress),
        onSuccess: (updatedOrder) => {
            // Update the specific order in cache
            queryClient.setQueryData(["orders", updatedOrder.id], updatedOrder);

            // Invalidate orders list
            queryClient.invalidateQueries({ queryKey: ["orders", "user"] });

            notifications.show({
                title: "Shipping Address Updated",
                message: `Shipping address for order #${updatedOrder.orderNumber} has been updated`,
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Address Update Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to reorder (create new order based on previous order)
 */
export function useReorder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderId: string) => reorder(orderId),
        onSuccess: (newOrder) => {
            // Add the new order to cache
            queryClient.setQueryData(["orders", newOrder.id], newOrder);

            // Invalidate orders list
            queryClient.invalidateQueries({ queryKey: ["orders", "user"] });

            notifications.show({
                title: "Order Reordered",
                message: `New order #${newOrder.orderNumber} has been created`,
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Reorder Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}

/**
 * Hook to create order from cart
 */
export function useCreateOrderFromCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderData: {
            shippingAddress: ShippingAddress;
            billingAddress: ShippingAddress;
            paymentMethod: string;
            notes?: string;
        }) => createOrderFromCart(orderData),
        onSuccess: (newOrder) => {
            // Add the new order to cache
            queryClient.setQueryData(["orders", newOrder.id], newOrder);

            // Invalidate orders list and cart
            queryClient.invalidateQueries({ queryKey: ["orders", "user"] });
            queryClient.invalidateQueries({ queryKey: ["cart"] });

            notifications.show({
                title: "Order Created from Cart",
                message: `Order #${newOrder.orderNumber} has been created from your cart`,
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Order Creation Failed",
                message: error.message,
                color: "red",
            });
        },
    });
}
