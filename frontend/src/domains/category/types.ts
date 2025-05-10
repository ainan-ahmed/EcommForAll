export interface Category {
    id?: string;
    name: string;
    slug?: string;
    imageUrl?: string | null;
    description?: string;
    productCount?: number;
    parent?: string | null;
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
export interface CategoriesResponse {
    content: Category[];
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
