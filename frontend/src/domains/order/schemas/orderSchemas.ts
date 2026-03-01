import { z } from "zod";

// Order Status Schema
export const orderStatusSchema = z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
]);

// Payment Status Schema
export const paymentStatusSchema = z.enum([
    "PENDING",
    "PAID",
    "FAILED",
    "REFUNDED",
    "PARTIALLY_REFUNDED",
]);

// Payment Method Schema
export const paymentMethodSchema = z.enum([
    "CREDIT_CARD",
    "DEBIT_CARD",
    "PAYPAL",
    "BANK_TRANSFER",
    "CASH_ON_DELIVERY",
]);

// Shipping Address Schema
export const shippingAddressSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    company: z.string().optional(),
    addressLine1: z.string().min(1, "Address line 1 is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    // state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().optional(),
    isDefault: z.boolean().optional(),
});

// Billing Address Schema (same as shipping)
export const billingAddressSchema = shippingAddressSchema;

// Order Item Schema (for creation)
export const orderItemSchema = z.object({
    productId: z.string().uuid("Invalid product ID"),
    variantId: z.string().uuid("Invalid variant ID").optional(),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

// Create Order Request Schema
export const createOrderSchema = z.object({
    items: z.array(orderItemSchema).min(1, "At least one item is required"),
    shippingAddress: shippingAddressSchema,
    billingAddress: billingAddressSchema,
    paymentMethod: paymentMethodSchema,
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
    shippingMethod: z.string().optional(),
});

// Update Order Schema
export const updateOrderSchema = z.object({
    status: orderStatusSchema.optional(),
    shippingAddress: shippingAddressSchema.partial().optional(),
    billingAddress: billingAddressSchema.partial().optional(),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

// Order Query Parameters Schema
export const orderQuerySchema = z.object({
    page: z.number().int().min(0).optional(),
    size: z.number().int().min(1).max(100).optional(),
    sort: z.string().optional(),
    status: orderStatusSchema.optional(),
    userId: z.string().uuid().optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    minAmount: z.number().min(0).optional(),
    maxAmount: z.number().min(0).optional(),
    orderNumber: z.string().optional(),
});

// Checkout Session Schema
export const checkoutSessionSchema = z.object({
    items: z
        .array(
            z.object({
                productId: z.string().uuid("Invalid product ID"),
                variantId: z.string().uuid("Invalid variant ID").optional(),
                quantity: z.number().int().min(1, "Quantity must be at least 1"),
            })
        )
        .min(1, "At least one item is required"),
    shippingAddress: shippingAddressSchema.partial().optional(),
    billingAddress: billingAddressSchema.partial().optional(),
    paymentMethod: paymentMethodSchema.optional(),
    shippingMethod: z.string().optional(),
});

// Address Validation Schema (for standalone address forms)
export const addressValidationSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    company: z.string().optional(),
    addressLine1: z.string().min(1, "Address line 1 is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    // state: z.string().min(1, "State is required"),
    postalCode: z
        .string()
        .min(1, "Postal code is required")
        .regex(/^[0-9]{5}(-[0-9]{4})?$/, "Please enter a valid postal code"),
    country: z.string().min(1, "Country is required"),
    phone: z
        .string()
        .optional()
        .refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), {
            message: "Please enter a valid phone number",
        }),
    isDefault: z.boolean().optional(),
});

// Order Item Quantity Update Schema
export const updateOrderItemQuantitySchema = z.object({
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

// Order Search Schema
export const orderSearchSchema = z.object({
    query: z.string().min(1, "Search query is required"),
    filters: z
        .object({
            status: orderStatusSchema.optional(),
            dateRange: z
                .object({
                    from: z.string().datetime().optional(),
                    to: z.string().datetime().optional(),
                })
                .optional(),
            amountRange: z
                .object({
                    min: z.number().min(0).optional(),
                    max: z.number().min(0).optional(),
                })
                .optional(),
        })
        .optional(),
});

// Payment Details Schema
export const paymentDetailsSchema = z.object({
    paymentMethod: paymentMethodSchema,
    amount: z.number().min(0, "Amount must be non-negative"),
    currency: z.string().min(1, "Currency is required"),
    transactionId: z.string().optional(),
    paymentGateway: z.string().optional(),
});

// Shipping Details Schema
export const shippingDetailsSchema = z.object({
    carrier: z.string().optional(),
    trackingNumber: z.string().optional(),
    shippingMethod: z.string().min(1, "Shipping method is required"),
    shippingCost: z.number().min(0, "Shipping cost must be non-negative"),
    estimatedDelivery: z.string().datetime().optional(),
    shippingAddress: shippingAddressSchema,
});

// Order Status Update Schema (for admin/seller)
export const orderStatusUpdateSchema = z.object({
    status: orderStatusSchema,
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
    trackingNumber: z.string().optional(),
    estimatedDelivery: z.string().datetime().optional(),
});

// Bulk Order Action Schema
export const bulkOrderActionSchema = z.object({
    orderIds: z.array(z.string().uuid()).min(1, "At least one order ID is required"),
    action: z.enum(["CONFIRM", "CANCEL", "MARK_SHIPPED", "MARK_DELIVERED"]),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

// Order Refund Schema
export const orderRefundSchema = z.object({
    amount: z.number().min(0, "Refund amount must be non-negative"),
    reason: z.string().min(1, "Refund reason is required"),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
    items: z
        .array(
            z.object({
                orderItemId: z.string().uuid("Invalid order item ID"),
                quantity: z.number().int().min(1, "Quantity must be at least 1"),
                amount: z.number().min(0, "Amount must be non-negative"),
            })
        )
        .optional(),
});

// Export type definitions from schemas
export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormValues = z.infer<typeof updateOrderSchema>;
export type AddressFormValues = z.infer<typeof addressValidationSchema>;
export type CheckoutSessionFormValues = z.infer<typeof checkoutSessionSchema>;
export type OrderSearchFormValues = z.infer<typeof orderSearchSchema>;
export type OrderStatusUpdateFormValues = z.infer<typeof orderStatusUpdateSchema>;
export type OrderRefundFormValues = z.infer<typeof orderRefundSchema>;
