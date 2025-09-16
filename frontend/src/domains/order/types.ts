import { Product, ProductImage } from "../product/types";
import { User } from "../user/types";

// Order Status Enum
export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";

// Payment Status Enum
export type PaymentStatus =
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED";

// Payment Method Enum
export type PaymentMethod =
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "PAYPAL"
    | "BANK_TRANSFER"
    | "CASH_ON_DELIVERY";

// Shipping Address Interface
export interface ShippingAddress {
    id?: string;
    firstName: string;
    lastName: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    // state: string; (removed)
    postalCode: string;
    country: string;
    phone?: string;
    isDefault?: boolean;
}

// Billing Address Interface (can be same as shipping)
export interface BillingAddress extends ShippingAddress {}

// Order Item Interface
export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    productName: string;
    productDescription?: string;
    variantId?: string;
    variantAttributes?: Record<string, string>;
    sku: string;
    quantity: number;
    price: number;
    subtotal: number;
    imageUrl?: string;
    product?: Product; // Optional product details
    productImage?: ProductImage; // Primary product image
}

// Payment Details Interface
export interface PaymentDetails {
    id: string;
    orderId: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    amount: number;
    currency: string;
    transactionId?: string;
    paymentGateway?: string;
    processedAt?: string;
    failureReason?: string;
}

// Shipping Details Interface
export interface ShippingDetails {
    id: string;
    orderId: string;
    carrier?: string;
    trackingNumber?: string;
    shippingMethod: string;
    shippingCost: number;
    estimatedDelivery?: string;
    actualDelivery?: string;
    shippingAddress: ShippingAddress;
}

// Order Summary Interface (for minimal order data)
export interface OrderSummary {
    id: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    totalAmount: number;
    itemCount: number; // Just the count, not the items array
    createdAt: string;
    updatedAt: string;
    trackingNumber?: string;
}

// Full Order Interface (for detailed views)
export interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    totalAmount: number;
    currency: string;
    subtotalAmount: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount?: number;
    createdAt: string;
    updatedAt: string;

    // Full details - only available in detailed views
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    billingAddress: ShippingAddress;
    paymentDetails?: PaymentDetails;
    shippingDetails?: ShippingDetails;
    notes?: string;
}

// Order Creation Request Interface
export interface CreateOrderRequest {
    // Items from cart or direct selection
    items: Array<{
        productId: string;
        variantId?: string;
        quantity: number;
    }>;

    // Addresses
    shippingAddress: Omit<ShippingAddress, "id">;
    billingAddress: Omit<BillingAddress, "id">;

    // Payment
    paymentMethod: PaymentMethod;

    // Optional
    notes?: string;
    shippingMethod?: string;
}

// Order Update Request Interface
export interface UpdateOrderRequest {
    status?: OrderStatus;
    shippingAddress?: Partial<ShippingAddress>;
    billingAddress?: Partial<BillingAddress>;
    notes?: string;
}

// Orders Response Interface (for paginated results)
export interface OrdersResponse {
    content: OrderSummary[]; // Changed from Order[] to OrderSummary[]
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

// Order Query Parameters Interface
export interface OrderQueryParams {
    page?: number;
    size?: number;
    sort?: string;
    status?: OrderStatus;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
    orderNumber?: string;
}

// Order Statistics Interface (for dashboard/analytics)
export interface OrderStats {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: Record<OrderStatus, number>;
    recentOrders: OrderSummary[];
}

// Checkout Session Interface (for multi-step checkout)
export interface CheckoutSession {
    id: string;
    userId: string;
    items: Array<{
        productId: string;
        variantId?: string;
        quantity: number;
        unitPrice: number;
    }>;
    shippingAddress?: Partial<ShippingAddress>;
    billingAddress?: Partial<BillingAddress>;
    paymentMethod?: PaymentMethod;
    shippingMethod?: string;
    totalAmount: number;
    expiresAt: string;
    createdAt: string;
}
