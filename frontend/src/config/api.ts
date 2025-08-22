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
        },
        CHATBOT: {
            CHAT_HISTORY: "/chatbot/chat",
            SEND_MESSAGE: "/chatbot/chat",
            CLEAR_CONVERSATION: "/chatbot/chat",
            HEALTH: "/chatbot/health",
        },
    },
};
