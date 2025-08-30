export interface Review {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    title: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        role: string;
    };
}

export interface ReviewCreateRequest {
    productId: string;
    userId: string;
    title: string;
    rating: number;
    comment: string;
}

export interface ReviewsResponse {
    content: Review[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}
