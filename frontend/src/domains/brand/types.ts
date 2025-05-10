export interface Brand {
    id?: string;
    name: string;
    description: string;
    imageUrl?: string | null;
    website?: string;
    isActive: boolean;
    createdAt?: string | null;
    updatedAt?: string | null;
    productCount?: number;
}

export interface BrandsResponse {
    content: Brand[];
    pageable: PageInfo;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface PageInfo {
    pageNumber: number;
    pageSize: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
}
