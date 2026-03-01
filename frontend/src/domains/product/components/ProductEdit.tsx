import { Container, Alert, LoadingOverlay, Paper } from "@mantine/core";
import { useProduct } from "../hooks/useProduct";
import { useCategories } from "../../category/hooks/useCategories";
import { useBrands } from "../../brand/hooks/useBrands";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { notifications } from "@mantine/notifications";
import { Product } from "../types";
import { ProductForm } from "./ProductForm";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { useStore } from "zustand/react";
import { authStore } from "../../../stores/authStore";
import {
    updateProductImagesOrder,
    uploadProductImage,
    uploadVariantImage,
} from "../api/productImageApi";
import { updateProductVariants } from "../api/productApi";

interface ProductEditProps {
    id: string; // Accept ID instead of product
}

export function ProductEdit({ id }: ProductEditProps) {
    const { user, isAuthenticated } = useStore(authStore);
    const navigate = useNavigate();

    // Fetch product using hook
    const { data: product, isLoading: isLoadingProduct, isError } = useProduct(id);

    // Fetch categories for dropdown
    const { data: categoriesData } = useCategories({ page: 0, size: 100 });
    const categories = categoriesData?.content || [];

    // Fetch brands for dropdown
    const { data: brandsData } = useBrands({ page: 0, size: 100 });
    const brands = brandsData?.content || [];

    // Mutation hook for updating product
    const updateProductMutation = useUpdateProduct();

    // Modified handleSubmit function with step-by-step processing
    const handleSubmit = async (productData: Product) => {
        try {
            // Step 1: Extract only basic product information (no variants or images)
            const basicProductData = {
                id: productData.id,
                name: productData.name,
                description: productData.description,
                sku: productData.sku,
                isActive: productData.isActive,
                isFeatured: productData.isFeatured,
                minPrice: productData.minPrice,
                brandId: productData.brandId,
                categoryId: productData.categoryId,
                sellerId: productData.sellerId,
            };

            // Update basic product info first
            await updateProductMutation.mutateAsync({
                ...basicProductData,
                variants: [], // Empty arrays to remove them from request
                images: [],
            });

            // Track which steps succeeded and which failed
            let variantsSuccess = true;
            let variantImagesSuccess = true;
            let imagesSuccess = true;
            let errors = [];

            // Step 2: Handle variants update in try-catch to isolate errors
            try {
                if (productData.variants && productData.variants.length > 0) {
                    // Remove images array entirely from variants using destructuring
                    const basicVariantsData = productData.variants.map(
                        ({ images, ...variant }) => variant
                    );

                    console.log("Basic variants data:", basicVariantsData);
                    await updateProductVariants(productData.id, basicVariantsData);

                    // The rest of your variant image upload code remains the same
                    try {
                        // Step 2b: Upload any temporary variant images
                        for (const variant of productData.variants) {
                            // Find temporary images with files
                            const tempVariantImages = variant.images?.filter(
                                (img) => img.id.startsWith("temp-") && img.file
                            );

                            // Upload each temporary image
                            for (const img of tempVariantImages!) {
                                if (img.file) {
                                    try {
                                        await uploadVariantImage(
                                            productData.id,
                                            variant.id,
                                            img.file
                                        );
                                    } catch (imageError: any) {
                                        errors.push(`Variant Image Upload: ${imageError.message}`);
                                        // Continue with other images
                                    }
                                }
                            }
                        }
                    } catch (error: any) {
                        variantImagesSuccess = false;
                        errors.push(`Variant Images: ${error.message}`);
                    }
                }
            } catch (error: any) {
                variantsSuccess = false;
                errors.push(`Variants: ${error.message}`);
            }

            // Step 3: Handle product images separately
            try {
                // Step 3a: Upload any new images
                const tempImages = productData.images.filter((img) => img.id.startsWith("temp-"));
                if (tempImages.length > 0) {
                    for (const img of tempImages) {
                        if (img.file) {
                            await uploadProductImage(productData.id, img.file);
                        }
                    }
                }

                // Step 3b: Update image order
                const permanentImages = productData.images.filter(
                    (img) => !img.id.startsWith("temp-")
                );
                if (permanentImages.length > 0) {
                    const imageIds = permanentImages.map((img) => img.id);
                    await updateProductImagesOrder(productData.id, imageIds);
                }
            } catch (error: any) {
                imagesSuccess = false;
                errors.push(`Images: ${error.message}`);
            }

            // Determine overall success message
            if (variantsSuccess && imagesSuccess && variantImagesSuccess) {
                notifications.show({
                    title: "Product Updated",
                    message: "The product has been successfully updated",
                    color: "green",
                });
                navigate({ to: `/products/${productData.id}`, replace: true });
            } else {
                // Partial success
                notifications.show({
                    title: "Partial Update",
                    message: `Basic product info updated, but there were errors with: ${errors.join(", ")}`,
                    color: "yellow",
                });
            }
        } catch (error: any) {
            // Complete failure (even basic info failed)
            notifications.show({
                title: "Update Failed",
                message: error.message || "Failed to update product basic information",
                color: "red",
            });
        }
    };
    const handleCancel = () => {
        navigate({ to: "/products/$productId", params: { productId: id } });
    };
    if (!isAuthenticated) {
        notifications.show({
            title: "Unauthorized",
            message: "You need to log in to edit products",
            color: "red",
        });
        return <Navigate to="/login" search={{ redirect: `/products/${id}/edit` }} />;
    }

    // Show loading while fetching product
    if (isLoadingProduct) {
        return (
            <Container size="xl" py="xl">
                <Paper p="xl" withBorder>
                    <LoadingOverlay visible={true} />
                </Paper>
            </Container>
        );
    }

    // Handle error or missing product
    if (isError || !product) {
        return (
            <Container size="xl" py="xl">
                <Alert color="red" title="Error">
                    Failed to load product. Please try again later.
                </Alert>
            </Container>
        );
    }

    // Check if user has permission
    if (user?.id !== product.sellerId && user?.role !== "ADMIN") {
        notifications.show({
            title: "Unauthorized",
            message: "You are not authorized to edit this product",
            color: "red",
        });

        return <Navigate to="/products/$productId" params={{ productId: id }} replace />;
    }

    return (
        <Container size="xl" py="xl">
            <ProductForm
                initialData={product}
                categories={categories}
                brands={brands}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={updateProductMutation.isPending}
            />
        </Container>
    );
}
