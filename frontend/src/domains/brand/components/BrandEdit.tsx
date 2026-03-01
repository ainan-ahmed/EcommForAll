import { Container, Title, LoadingOverlay, Alert } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";
import { BrandForm } from "./BrandForm";
import { useBrand } from "../hooks/useBrand";
import { useUpdateBrand } from "../hooks/useUpdateBrand";
import { uploadBrandImage } from "../api/brandApi";
import { Brand } from "../types";

interface BrandEditProps {
    id: string;
}

export function BrandEdit({ id }: BrandEditProps) {
    const { user, isAuthenticated } = useStore(authStore);
    const navigate = useNavigate();

    // Fetch current brand data
    const { data: brand, isLoading, isError } = useBrand(id);

    // Update brand mutation
    const updateBrandMutation = useUpdateBrand();

    // Check if user is authenticated and has proper role
    const canEditBrand = isAuthenticated && (user?.role === "ADMIN" || user?.role === "SELLER");

    const handleSubmit = async (
        formData: Omit<Brand, "id" | "createdAt" | "updatedAt" | "imageUrl" | "productCount"> & {
            image?: File;
        }
    ) => {
        if (!formData) return;

        try {
            // Step 1: Extract image file and update brand without it
            const { image, ...brandData } = formData;

            // Update brand data
            await updateBrandMutation.mutateAsync({
                id,
                data: brandData,
            });

            // Step 2: If there's a new image, upload it
            if (image) {
                try {
                    await uploadBrandImage(image, id);
                    notifications.show({
                        title: "Brand Updated",
                        message: "The brand has been successfully updated with new logo",
                        color: "green",
                    });
                } catch (imageError) {
                    console.error("Image upload failed:", imageError);
                    notifications.show({
                        title: "Brand Updated",
                        message: "Brand updated successfully, but logo upload failed.",
                        color: "yellow",
                    });
                }
            } else {
                // No image update
                notifications.show({
                    title: "Brand Updated",
                    message: "The brand has been successfully updated",
                    color: "green",
                });
            }

            navigate({ to: `/brands/${id}` });
        } catch (error: any) {
            notifications.show({
                title: "Update Failed",
                message: error.message || "Failed to update brand",
                color: "red",
            });
        }
    };

    // Show unauthorized message if user doesn't have permission
    if (!canEditBrand) {
        notifications.show({
            title: "Unauthorized",
            message: "You don't have permission to edit brands",
            color: "red",
        });
        return <Navigate to="/brands/$brandId" params={{ brandId: id }} />;
    }

    // Show loading while fetching brand data
    if (isLoading) {
        return (
            <Container size="md" py="xl">
                <LoadingOverlay visible={true} />
            </Container>
        );
    }

    // Show error if brand data couldn't be fetched
    if (isError || !brand) {
        return (
            <Container size="md" py="xl">
                <Alert color="red" title="Error">
                    Failed to load brand information. Please try again later.
                </Alert>
            </Container>
        );
    }

    return (
        <Container size="md" py="xl">
            <Title order={2} mb="xl">
                Edit Brand
            </Title>
            <BrandForm
                initialData={brand}
                onSubmit={handleSubmit}
                isLoading={updateBrandMutation.isPending}
                onCancel={() => navigate({ to: `/brands/${id}` })}
            />
        </Container>
    );
}
