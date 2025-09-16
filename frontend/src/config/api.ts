export const API = {
    BASE_URL: "http://localhost:8080/api",
    TIMEOUT: 30000, // 30 seconds
    ENDPOINTS: {
        CATEGORIES: "/categories",
        PRODUCTS: "/products",
        PRODUCTS_FILTER: "/products/filter",
        BRANDS: "/brands",
        AUTH: {
            LOGIN: "/auth/login",
            REGISTER: "/auth/register",
            LOGOUT: "/auth/logout",
            VALIDATE: "/auth/validate",
            CURRENT_USER: "/auth/user",
            FORGOT_PASSWORD: "/auth/forgot-password",
            RESET_PASSWORD: "/auth/reset-password",
        },
        CHATBOT: {
            CHAT_HISTORY: "/chatbot/chat",
            SEND_MESSAGE: "/chatbot/chat",
            CLEAR_CONVERSATION: "/chatbot/chat",
            HEALTH: "/chatbot/health",
        },
        REVIEW: {
            PRODUCT_REVIEWS: "/review",
            CREATE_REVIEW: "/review/review/create",
            DELETE_REVIEW: "/review/review",
        },
        ORDER: {
            BASE: "/orders",
            BY_ID: "/orders/:id",
            CANCEL: "/orders/:id/cancel",
            STATUS: "/orders/:id/status",
            STATS: "/orders/stats",
            TRACK: "/orders/track/:trackingInfo",
            PAYMENT: "/orders/:id/payment",
            REORDER: "/orders/:id/reorder",
            FROM_CART: "/orders/from-cart",
            SHIPPING_ADDRESS: "/orders/:id/shipping-address",
        },
        CHECKOUT: {
            SESSION: "/checkout/session",
            SESSION_BY_ID: "/checkout/session/:id",
            COMPLETE: "/checkout/session/:id/complete",
        },
    },
};
