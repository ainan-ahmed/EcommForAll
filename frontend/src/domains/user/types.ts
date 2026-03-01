import { WishlistProductSummary } from "../product/types";

export interface Wishlist {
    id: string;
    name: string;
    userId: string;
    products: WishlistProductSummary[];
    createdAt: string;
    updatedAt: string;
}
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    createdAt: string | null;
    updatedAt: string | null;
    role: "ADMIN" | "SELLER" | "CUSTOMER" | string; // Add other roles if needed
}
