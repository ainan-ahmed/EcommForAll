import { API } from "../../../config/api";
import {
    Order,
    OrdersResponse,
    CreateOrderRequest,
    UpdateOrderRequest,
    OrderQueryParams,
    CheckoutSession,
    ShippingAddress,
    PaymentDetails,
} from "../types";

/**
 * Get all orders for the current user with pagination and filtering
 */
export async function fetchUserOrders(
    params: OrderQueryParams = {}
): Promise<OrdersResponse> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const url = new URL(`${API.BASE_URL}/orders`);

    // Add query parameters
    if (params.page !== undefined)
        url.searchParams.append("page", params.page.toString());
    if (params.size !== undefined)
        url.searchParams.append("size", params.size.toString());
    if (params.sort) url.searchParams.append("sort", params.sort);
    if (params.status) url.searchParams.append("status", params.status);
    if (params.dateFrom) url.searchParams.append("dateFrom", params.dateFrom);
    if (params.dateTo) url.searchParams.append("dateTo", params.dateTo);
    if (params.minAmount !== undefined)
        url.searchParams.append("minAmount", params.minAmount.toString());
    if (params.maxAmount !== undefined)
        url.searchParams.append("maxAmount", params.maxAmount.toString());
    if (params.orderNumber)
        url.searchParams.append("orderNumber", params.orderNumber);

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Failed to fetch orders: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Get a specific order by ID (user can only access their own orders)
 */
export async function fetchOrderById(orderId: string): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/orders/${orderId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Failed to fetch order: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Create a new order
 */
export async function createOrder(
    orderData: CreateOrderRequest
): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Failed to create order: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Update an existing order (limited fields for users)
 */
export async function updateOrder(
    orderId: string,
    orderData: UpdateOrderRequest
): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Failed to update order: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Cancel an order (user can cancel their own orders)
 */
export async function cancelOrder(
    orderId: string,
    reason?: string
): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Failed to cancel order: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Create checkout session
 */
export async function createCheckoutSession(sessionData: {
    items: Array<{
        productId: string;
        variantId?: string;
        quantity: number;
    }>;
}): Promise<CheckoutSession> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/checkout/session`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message ||
                `Failed to create checkout session: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Get checkout session by ID
 */
export async function fetchCheckoutSession(
    sessionId: string
): Promise<CheckoutSession> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(
        `${API.BASE_URL}/checkout/session/${sessionId}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message ||
                `Failed to fetch checkout session: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Update checkout session
 */
export async function updateCheckoutSession(
    sessionId: string,
    sessionData: Partial<CheckoutSession>
): Promise<CheckoutSession> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(
        `${API.BASE_URL}/checkout/session/${sessionId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(sessionData),
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message ||
                `Failed to update checkout session: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Complete checkout and create order from session
 */
export async function completeCheckout(sessionId: string): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(
        `${API.BASE_URL}/checkout/session/${sessionId}/complete`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message ||
                `Failed to complete checkout: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Update shipping address for an order (user can update their own orders)
 */
export async function updateOrderShippingAddress(
    orderId: string,
    shippingAddress: ShippingAddress
): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(
        `${API.BASE_URL}/orders/${orderId}/shipping-address`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(shippingAddress),
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message ||
                `Failed to update shipping address: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Track order by order number or tracking number
 */
export async function trackOrder(trackingInfo: string): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(
        `${API.BASE_URL}/orders/track/${trackingInfo}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Failed to track order: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Get order payment details (user can view their own order payment details)
 */
export async function fetchOrderPaymentDetails(
    orderId: string
): Promise<PaymentDetails> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/orders/${orderId}/payment`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message ||
                `Failed to fetch payment details: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Reorder - create a new order based on a previous order
 */
export async function reorder(orderId: string): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/orders/${orderId}/reorder`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Failed to reorder: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Create order from cart
 */
export async function createOrderFromCart(orderData: {
    shippingAddress: ShippingAddress;
    billingAddress: ShippingAddress;
    paymentMethod: string;
    notes?: string;
}): Promise<Order> {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication required");
    }

    const response = await fetch(`${API.BASE_URL}/orders/from-cart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message ||
                `Failed to create order from cart: ${response.status}`
        );
    }

    return response.json();
}
