import { Container, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";
import { BrandForm } from "./BrandForm";
import { useCreateBrand } from "../hooks/useCreateBrand";
import { uploadBrandImage } from "../api/brandApi";
import { Brand } from "../types";

export function BrandCreate() {
    const { user, isAuthenticated } = useStore(authStore);
    const navigate = useNavigate();
    const createBrandMutation = useCreateBrand();

    // Check if user is authenticated and has proper role
    const canCreateBrand = isAuthenticated && (user?.role === "ADMIN" || user?.role === "SELLER");

    const handleSubmit = async (
        formData: Omit<Brand, "id" | "createdAt" | "updatedAt" | "imageUrl" | "productCount"> & {
            image?: File;
        }
    ) => {
        console.log("Brand data to create:", formData);
        console.log("Image file to upload:", formData.image);
        if (!formData) return;

        try {
            // Step 1: Extract image file and create brand without it
            const { image, ...brandData } = formData;

            // Create brand first (without image)
            const createdBrand = await createBrandMutation.mutateAsync(brandData);

            // Step 2: If there's an image, upload it using the NEW brand ID
            if (image) {
                try {
                    await uploadBrandImage(image, createdBrand.id!);
                    notifications.show({
                        title: "Brand Created",
                        message: "The brand has been successfully created with logo",
                        color: "green",
                    });
                } catch (imageError) {
                    console.error("Image upload failed:", imageError);
                    notifications.show({
                        title: "Brand Created",
                        message:
                            "Brand created successfully, but logo upload failed. You can add a logo later by editing the brand.",
                        color: "yellow",
                    });
                }
            } else {
                // No image case
                notifications.show({
                    title: "Brand Created",
                    message: "The brand has been successfully created",
                    color: "green",
                });
            }

            navigate({ to: `/brands/${createdBrand.id}` });
        } catch (error: any) {
            notifications.show({
                title: "Error",
                message: error.message || "Failed to create brand",
                color: "red",
            });
        }
    };

    // Show unauthorized message if user doesn't have permission
    if (!canCreateBrand) {
        notifications.show({
            title: "Unauthorized",
            message: "You don't have permission to create brands",
            color: "red",
        });
        return <Navigate to="/brands" />;
    }

    return (
        <Container size="md" py="xl">
            <Title order={2} mb="xl">
                Create New Brand
            </Title>
            <BrandForm
                onSubmit={handleSubmit}
                isLoading={createBrandMutation.isPending}
                onCancel={() => navigate({ to: "/brands" })}
            />
        </Container>
    );
}
