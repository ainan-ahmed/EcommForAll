import { useCategory } from "../../category/hooks/useCategory";
import { useProductsByCategoryId } from "../../product/hooks/useProductsByCategoryId";

interface useCategoryAndProductsByCategorySlugParams {
    slug: string;
    page?: number;
    size?: number;
    sort?: string;
}

export function useCategoryAndProductsByCategorySlug({
    slug,
    page = 0,
    size = 10,
    sort = "",
}: useCategoryAndProductsByCategorySlugParams) {
    // Get category using your existing hook
    const categoryQuery = useCategory(slug);

    // Get products using the category ID from the category query
    const productsQuery = useProductsByCategoryId({
        categoryId: categoryQuery.data?.id || "",
        page,
        size,
        sort,
        enabled: !!categoryQuery.data?.id,
    });
    // console.log(categoryQuery.data, productsQuery.data);
    return {
        // Category data from your existing hook
        categoryData: categoryQuery.data,
        isCategoryLoading: categoryQuery.isLoading,
        isCategoryError: categoryQuery.isError,

        // Products data
        productsData: productsQuery.data?.content || [],
        pagination: {
            totalElements: productsQuery.data?.totalElements || 0,
            totalPages: productsQuery.data?.totalPages || 0,
            currentPage: productsQuery.data?.number || page,
            pageSize: productsQuery.data?.size || size,
            isLastPage: productsQuery.data?.last || false,
            isFirstPage: productsQuery.data?.first || true,
        },
        isProductsLoading: productsQuery.isLoading,
        isProductsError: productsQuery.isError,

        // Combined states
        isLoading: categoryQuery.isLoading || productsQuery.isLoading,
        isError: categoryQuery.isError || productsQuery.isError,

        // Raw response
        data: productsQuery.data,
    };
}
