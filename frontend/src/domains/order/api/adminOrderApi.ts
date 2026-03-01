import { API } from "../../../config/api";
import {
    Order,
    OrdersResponse,
    OrderQueryParams,
    OrderStatus,
    OrderStats,
    ShippingDetails,
    PaymentDetails,
} from "../types";

/**
 * Get all orders (admin/seller can access all orders or filter by seller)
 */
export async function fetchAllOrders(params: OrderQueryParams = {}): Promise<OrdersResponse> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const url = new URL(`${API.BASE_URL}/admin/orders`);

    // Add query parameters
    if (params.page !== undefined) url.searchParams.append("page", params.page.toString());
    if (params.size !== undefined) url.searchParams.append("size", params.size.toString());
    if (params.sort) url.searchParams.append("sort", params.sort);
    if (params.status) url.searchParams.append("status", params.status);
    if (params.userId) url.searchParams.append("userId", params.userId);
    if (params.dateFrom) url.searchParams.append("dateFrom", params.dateFrom);
    if (params.dateTo) url.searchParams.append("dateTo", params.dateTo);
    if (params.minAmount !== undefined)
        url.searchParams.append("minAmount", params.minAmount.toString());
    if (params.maxAmount !== undefined)
        url.searchParams.append("maxAmount", params.maxAmount.toString());
    if (params.orderNumber) url.searchParams.append("orderNumber", params.orderNumber);

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch orders: ${response.status}`);
    }

    return response.json();
}

/**
 * Get orders for a specific seller (seller can access their own orders)
 */
export async function fetchSellerOrders(
    sellerId: string,
    params: OrderQueryParams = {}
): Promise<OrdersResponse> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const url = new URL(`${API.BASE_URL}/seller/${sellerId}/orders`);

    // Add query parameters
    if (params.page !== undefined) url.searchParams.append("page", params.page.toString());
    if (params.size !== undefined) url.searchParams.append("size", params.size.toString());
    if (params.sort) url.searchParams.append("sort", params.sort);
    if (params.status) url.searchParams.append("status", params.status);
    if (params.dateFrom) url.searchParams.append("dateFrom", params.dateFrom);
    if (params.dateTo) url.searchParams.append("dateTo", params.dateTo);
    if (params.minAmount !== undefined)
        url.searchParams.append("minAmount", params.minAmount.toString());
    if (params.maxAmount !== undefined)
        url.searchParams.append("maxAmount", params.maxAmount.toString());

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch seller orders: ${response.status}`);
    }

    return response.json();
}

/**
 * Get any order by ID (admin can access any order, seller can access orders with their products)
 */
export async function fetchOrderByIdAdmin(orderId: string): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/admin/orders/${orderId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch order: ${response.status}`);
    }

    return response.json();
}

/**
 * Update order status (admin/seller privilege)
 */
export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    notes?: string,
    trackingNumber?: string,
    estimatedDelivery?: string
): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            status,
            notes,
            trackingNumber,
            estimatedDelivery,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update order status: ${response.status}`);
    }

    return response.json();
}

/**
 * Force cancel order (admin privilege)
 */
export async function forceCancelOrder(
    orderId: string,
    reason: string,
    refundAmount?: number
): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/admin/orders/${orderId}/force-cancel`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason, refundAmount }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to force cancel order: ${response.status}`);
    }

    return response.json();
}

/**
 * Get comprehensive order statistics (admin/seller dashboard)
 */
export async function fetchOrderStats(
    sellerId?: string,
    dateFrom?: string,
    dateTo?: string
): Promise<OrderStats> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const url = new URL(`${API.BASE_URL}/admin/orders/stats`);

    if (sellerId) url.searchParams.append("sellerId", sellerId);
    if (dateFrom) url.searchParams.append("dateFrom", dateFrom);
    if (dateTo) url.searchParams.append("dateTo", dateTo);

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch order stats: ${response.status}`);
    }

    return response.json();
}

/**
 * Update shipping details (admin/seller can update shipping info)
 */
export async function updateShippingDetails(
    orderId: string,
    shippingDetails: Partial<ShippingDetails>
): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/admin/orders/${orderId}/shipping`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shippingDetails),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Failed to update shipping details: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Update payment status (admin privilege)
 */
export async function updatePaymentStatus(
    orderId: string,
    paymentStatus: string,
    transactionId?: string,
    notes?: string
): Promise<PaymentDetails> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/admin/orders/${orderId}/payment/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus, transactionId, notes }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update payment status: ${response.status}`);
    }

    return response.json();
}

/**
 * Bulk update order status (admin privilege)
 */
export async function bulkUpdateOrderStatus(
    orderIds: string[],
    status: OrderStatus,
    notes?: string
): Promise<Order[]> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/admin/orders/bulk/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderIds, status, notes }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Failed to bulk update order status: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Export orders to CSV (admin privilege)
 */
export async function exportOrdersToCSV(params: OrderQueryParams = {}): Promise<Blob> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const url = new URL(`${API.BASE_URL}/admin/orders/export`);

    // Add query parameters
    if (params.status) url.searchParams.append("status", params.status);
    if (params.userId) url.searchParams.append("userId", params.userId);
    if (params.dateFrom) url.searchParams.append("dateFrom", params.dateFrom);
    if (params.dateTo) url.searchParams.append("dateTo", params.dateTo);
    if (params.minAmount !== undefined)
        url.searchParams.append("minAmount", params.minAmount.toString());
    if (params.maxAmount !== undefined)
        url.searchParams.append("maxAmount", params.maxAmount.toString());

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to export orders: ${response.status}`);
    }

    return response.blob();
}

/**
 * Get order audit log (admin privilege)
 */
export async function fetchOrderAuditLog(orderId: string): Promise<any[]> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/admin/orders/${orderId}/audit`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch order audit log: ${response.status}`);
    }

    return response.json();
}

/**
 * Process refund (admin privilege)
 */
export async function processRefund(
    orderId: string,
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
    }
): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/admin/orders/${orderId}/refund`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(refundData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to process refund: ${response.status}`);
    }

    return response.json();
}

/**
 * Mark order as shipped with tracking info (seller privilege)
 */
export async function markOrderAsShipped(
    orderId: string,
    shippingData: {
        carrier: string;
        trackingNumber: string;
        shippingMethod: string;
        estimatedDelivery?: string;
        notes?: string;
    }
): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/seller/orders/${orderId}/ship`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shippingData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to mark order as shipped: ${response.status}`);
    }

    return response.json();
}

/**
 * Confirm order (seller can confirm orders containing their products)
 */
export async function confirmOrder(
    orderId: string,
    estimatedProcessingTime?: string
): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/seller/orders/${orderId}/confirm`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estimatedProcessingTime }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to confirm order: ${response.status}`);
    }

    return response.json();
}
