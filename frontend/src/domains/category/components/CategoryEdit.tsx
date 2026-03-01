import { Container, Title, LoadingOverlay, Alert } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";
import { CategoryForm } from "./CategoryForm";
import { useCategory } from "../hooks/useCategory";
import { useCategories } from "../hooks/useCategories";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { uploadCategoryImage } from "../api/categoryApi";
import { Category } from "../types";

interface CategoryEditProps {
    slug: string;
}

export function CategoryEdit({ slug }: CategoryEditProps) {
    const { user, isAuthenticated } = useStore(authStore);
    const navigate = useNavigate();

    // Fetch current category data
    const {
        data: category,
        isLoading: isCategoryLoading,
        isError: isCategoryError,
    } = useCategory(slug);

    // Fetch all categories for parent selection
    const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories({
        page: 0,
        size: 100, // Fetch a large number to get all categories
    });

    const categories = categoriesData?.content || [];

    // Update category mutation
    const updateCategoryMutation = useUpdateCategory();

    // Check if user is authenticated and is an admin
    const canEditCategory = isAuthenticated && user?.role === "ADMIN";

    const handleSubmit = async (
        formData: Omit<Category, "id" | "productCount" | "slug" | "imageUrl"> & { image?: File }
    ) => {
        if (!formData || !category) return;

        try {
            // Step 1: Extract image file and update category without it
            const { image, ...categoryData } = formData;

            // Update category data
            await updateCategoryMutation.mutateAsync({
                id: category.id!,
                data: categoryData,
            });

            // Step 2: If there's a new image, upload it
            if (image) {
                try {
                    await uploadCategoryImage(category.id!, image);
                    notifications.show({
                        title: "Category Updated",
                        message: "The category has been successfully updated with new image",
                        color: "green",
                    });
                } catch (imageError) {
                    notifications.show({
                        title: "Category Updated",
                        message: "Category updated successfully, but image upload failed.",
                        color: "yellow",
                    });
                }
            } else {
                // No image update
                notifications.show({
                    title: "Category Updated",
                    message: "The category has been successfully updated",
                    color: "green",
                });
            }

            // Navigate back to the category page
            navigate({ to: `/categories/${category.slug}` });
        } catch (error: any) {
            notifications.show({
                title: "Update Failed",
                message: error.message || "Failed to update category",
                color: "red",
            });
        }
    };

    // Show unauthorized message if user doesn't have permission
    if (!canEditCategory) {
        notifications.show({
            title: "Unauthorized",
            message: "You don't have permission to edit categories",
            color: "red",
        });
        return <Navigate to="/categories/$categorySlug" params={{ categorySlug: slug }} />;
    }

    // Show loading while fetching category data
    if (isCategoryLoading || isCategoriesLoading) {
        return (
            <Container size="md" py="xl">
                <LoadingOverlay visible={true} />
            </Container>
        );
    }

    // Show error if category data couldn't be fetched
    if (isCategoryError || !category) {
        return (
            <Container size="md" py="xl">
                <Alert color="red" title="Error">
                    Failed to load category information. Please try again later.
                </Alert>
            </Container>
        );
    }

    return (
        <Container size="md" py="xl">
            <Title order={2} mb="xl">
                Edit Category: {category.name}
            </Title>
            <CategoryForm
                initialData={category}
                onSubmit={handleSubmit}
                isLoading={updateCategoryMutation.isPending}
                onCancel={() => navigate({ to: `/categories/${category.slug}` })}
                categories={categories.filter((c) => c.id !== category.id)}
            />
        </Container>
    );
}
