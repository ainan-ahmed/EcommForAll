import { Container, Title, LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";
import { CategoryForm } from "./CategoryForm";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useCategories } from "../hooks/useCategories";
import { uploadCategoryImage } from "../api/categoryApi";
import { Category } from "../types";

export function CategoryCreate() {
    const { user, isAuthenticated } = useStore(authStore);
    const navigate = useNavigate();
    const createCategoryMutation = useCreateCategory();

    // Fetch all categories for parent selection
    const { data: categoriesData, isLoading: isLoadingCategories } =
        useCategories({
            page: 0,
            size: 100, // Fetch a large number to get all categories
        });
    const categories = categoriesData?.content || [];

    // Check if user is authenticated and is an admin
    const canCreateCategory = isAuthenticated && user?.role === "ADMIN";

    const handleSubmit = async (
        formData: Omit<Category, "id" | "productCount" | "slug" | "imageUrl"> & { image?: File } 
    ) => {
        if (!formData) return;

        try {
            // Step 1: Extract image file and create category without it
            const { image, ...categoryData } = formData;
            console.log("Category data to create:", categoryData);
            console.log("Image file to upload:", image);
            // Create category first (without image)
            const createdCategory =
                await createCategoryMutation.mutateAsync(categoryData);

            // Step 2: If there's an image, try to upload it separately
            if (image) {
                try {
                    await uploadCategoryImage(createdCategory.id!, image);

                    // Complete success - category created and image uploaded
                    notifications.show({
                        title: "Category Created",
                        message:
                            "The category has been successfully created with image",
                        color: "green",
                    });
                } catch (imageError) {
                    // Partial success - category created but image upload failed
                    notifications.show({
                        title: "Category Created",
                        message:
                            "Category was created successfully, but there was an error uploading the image. " +
                            imageError +
                            "\nYou can add an image later by editing the category.",

                        color: "yellow",
                    });
                }
            } else {
                // Success - category created (no image provided)
                notifications.show({
                    title: "Category Created",
                    message: "The category has been successfully created",
                    color: "green",
                });
            }

            // Navigate to the new category page regardless of image upload status
            navigate({ to: `/categories/${createdCategory.slug}` });
        } catch (error: any) {
            // Complete failure - category creation failed
            notifications.show({
                title: "Category Creation Failed",
                message: error.message || "Failed to create category",
                color: "red",
            });
        }
    };

    // Show unauthorized message if user doesn't have permission
    if (!canCreateCategory) {
        notifications.show({
            title: "Unauthorized",
            message: "You don't have permission to create categories",
            color: "red",
        });
        return <Navigate to="/categories" />;
    }

    return (
        <Container size="md" py="xl">
            <Title order={2} mb="xl">
                Create New Category
            </Title>

            {isLoadingCategories ? (
                <LoadingOverlay visible={true} />
            ) : (
                <CategoryForm
                    onSubmit={handleSubmit}
                    isLoading={createCategoryMutation.isPending}
                    onCancel={() => navigate({ to: "/categories" })}
                    categories={categories}
                />
            )}
        </Container>
    );
}
