import { Container, Alert, LoadingOverlay, Paper } from "@mantine/core";
import { useCategories } from "../../category/hooks/useCategories";
import { useBrands } from "../../brand/hooks/useBrands";
import { notifications } from "@mantine/notifications";
import { Product } from "../types";
import { ProductForm } from "./ProductForm";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";
import { useCreateProduct } from "../hooks/useCreateProduct";
import {
    updateProductImagesOrder,
    uploadProductImage,
} from "../api/productImageApi";

export function ProductCreate() {
    const { user, isAuthenticated } = useStore(authStore);
    const navigate = useNavigate();

    // Fetch categories for dropdown
    const { data: categoriesData, isLoading: isLoadingCategories } =
        useCategories({ page: 0, size: 100 });
    const categories = categoriesData?.content || [];

    // Fetch brands for dropdown
    const { data: brandsData, isLoading: isLoadingBrands } = useBrands({
        page: 0,
        size: 100,
    });
    const brands = brandsData?.content || [];

    // Mutation hook for creating product
    const createProductMutation = useCreateProduct();

    const handleSubmit = async (productData: Product) => {
        console.log("Product data to create:", productData);
        try {
            // Set seller ID to current user
            productData.sellerId = user?.id || "";

            // Step 1: Create basic product first (without handling temp images)
            const createdProduct = await createProductMutation.mutateAsync({
                ...productData,
                variants: productData.variants.map((variant) => ({
                    ...variant,
                    // Remove temporary images from variants when sending to API
                    images: variant.images.filter(
                        (img) => !img.id.startsWith("temp-")
                    ),
                })),
                // Remove temporary images when sending to API
                images: productData.images.filter(
                    (img) => !img.id.startsWith("temp-")
                ),
            });

            // Track which steps succeeded and which failed
            let imagesSuccess = true;
            let variantsSuccess = true;
            let errors = [];

            // Step 2: Handle image uploads separately
            try {
                // Step 2a: Upload any new images
                const tempImages = productData.images.filter(
                    (img) => img.id.startsWith("temp-") && img.file
                );

                if (tempImages.length > 0) {
                    for (const img of tempImages) {
                        if (img.file) {
                            await uploadProductImage(
                                createdProduct.id,
                                img.file
                            );
                        }
                    }
                }

                const permanentImages = productData.images.filter(
                    (img) => !img.id.startsWith("temp-")
                );

                if (permanentImages.length > 0) {
                    const imageIds = permanentImages.map((img) => img.id);
                    await updateProductImagesOrder(createdProduct.id, imageIds);
                }
            } catch (error: any) {
                imagesSuccess = false;
                errors.push(`Images: ${error.message}`);
            }

            // Determine overall success message
            if (variantsSuccess && imagesSuccess) {
                notifications.show({
                    title: "Product Created",
                    message: "Your product has been created successfully",
                    color: "green",
                });
                navigate({ to: `/products/${createdProduct.id}` });
            } else {
                // Partial success
                notifications.show({
                    title: "Product Created with Issues",
                    message: `Product was created but there were problems with: ${errors.join(", ")}`,
                    color: "yellow",
                });
                navigate({ to: `/products/${createdProduct.id}` });
            }
        } catch (error: any) {
            // Complete failure
            notifications.show({
                title: "Creation Failed",
                message: error.message || "Failed to create product",
                color: "red",
            });
        }
    };

    // Check if user is authenticated
    if (!isAuthenticated) {
        notifications.show({
            title: "Unauthorized",
            message: "You need to log in to create products",
            color: "red",
        });
        return <Navigate to="/login" search={{ redirect: "/products/new" }} />;
    }

    // Check if user role is seller or admin
    if (user?.role !== "SELLER" && user?.role !== "ADMIN") {
        notifications.show({
            title: "Unauthorized",
            message: "Only sellers can create products",
            color: "red",
        });
        return <Navigate to="/products" />;
    }

    // Show loading while fetching categories and brands
    if (isLoadingCategories || isLoadingBrands) {
        return (
            <Container size="xl" py="xl">
                <Paper p="xl" withBorder>
                    <LoadingOverlay visible={true} />
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="xl" py="xl">
            <ProductForm
                categories={categories}
                brands={brands}
                onSubmit={handleSubmit}
                isLoading={createProductMutation.isPending}
                onCancel={() => navigate({ to: "/products" })}
            />
        </Container>
    );
}
