export const API = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000, // 30 seconds
  ENDPOINTS: {
    CATEGORIES: '/categories',
    PRODUCTS: '/products',
    PRODUCTS_FILTER: '/products/filter',
    BRANDS: '/brands',
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout'
    }
  }
};