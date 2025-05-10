import { useState, useCallback } from "react";
import { Product, ProductImage, ProductVariant } from "../types";
import {
    uploadProductImage,
    deleteProductImage as deleteImageApi,
    updateProductImage,
    updateProductImagesOrder,
} from "../api/productImageApi";
import { notifications } from "@mantine/notifications";

export function useProductFormState(initialData?: Product) {
    const [isUploading, setIsUploading] = useState<boolean>(false);
    // State for managing variants and images
    const [variants, setVariants] = useState<ProductVariant[]>(
        initialData?.variants || []
    );
    const [productImages, setProductImages] = useState<ProductImage[]>(
        initialData?.images || []
    );

    // State for variant image modal
    const [variantImageModal, setVariantImageModal] = useState({
        open: false,
        variantId: "",
        variantName: "",
    });

    // Handle image uploads for product
    const handleProductImageUpload = useCallback(
        async (files: File[]) => {
            if (!initialData?.id) {
                // If no product ID yet (new product being created), use local URLs
                const newImages = files.map((file, index) => ({
                    id: `temp-${Date.now()}-${index}`,
                    productId: "",
                    imageUrl: URL.createObjectURL(file),
                    altText: file.name,
                    sortOrder: productImages.length + index + 1,
                    // Store the file for later upload when the product is saved
                    file: file,
                }));

                setProductImages([...productImages, ...newImages]);
                return;
            }

            setIsUploading(true);

            try {
                // Upload each file and collect results
                const uploadPromises = files.map((file) =>
                    uploadProductImage(initialData.id!, file)
                );

                const results = await Promise.allSettled(uploadPromises);

                // Process results
                const successfulUploads: ProductImage[] = [];
                results.forEach((result, index) => {
                    if (result.status === "fulfilled") {
                        successfulUploads.push(result.value);
                    } else {
                        notifications.show({
                            title: "Upload Failed",
                            message: `Failed to upload ${files[index].name}: ${result.reason}`,
                            color: "red",
                        });
                    }
                });

                if (successfulUploads.length > 0) {
                    setProductImages([...productImages, ...successfulUploads]);
                    notifications.show({
                        title: "Upload Successful",
                        message: `Successfully uploaded ${successfulUploads.length} image(s)`,
                        color: "green",
                    });
                }
            } catch (error) {
                console.error("Image upload error:", error);
                notifications.show({
                    title: "Upload Error",
                    message: "An error occurred while uploading images",
                    color: "red",
                });
            } finally {
                setIsUploading(false);
            }
        },
        [productImages, initialData?.id]
    );

    // Handle product image reordering
    const handleProductImageDragEnd = useCallback(
        async (result: any) => {
            if (!result.destination) return;

            const items = Array.from(productImages);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            // Update sort order
            const updatedItems = items.map((item, index) => ({
                ...item,
                sortOrder: index + 1,
            }));

            setProductImages(updatedItems);
            console.log("Updated product images:", updatedItems);
            // If this is an existing product with an ID, persist the order to backend
            if (initialData?.id) {
                try {
                    // Only send IDs that are not temporary (don't start with 'temp-')
                    const imageIds = updatedItems
                        .filter((img) => !img.id.startsWith("temp-"))
                        .map((img) => img.id);

                    if (imageIds.length > 0) {
                        await updateProductImagesOrder(
                            initialData.id,
                            imageIds
                        );
                    }
                } catch (error) {
                    console.error("Failed to update image order:", error);
                    notifications.show({
                        title: "Error",
                        message: "Failed to save the new image order",
                        color: "red",
                    });
                }
            }
        },
        [productImages, initialData?.id]
    );

    // Delete product image
    const deleteProductImage = useCallback(
        async (imageId: string) => {
            // For local images (temporary IDs), just remove from state
            if (imageId.startsWith("temp-")) {
                setProductImages(
                    productImages
                        .filter((img) => img.id !== imageId)
                        .map((img, index) => ({ ...img, sortOrder: index + 1 }))
                );
                return;
            }

            // For server images, call the API
            if (initialData?.id) {
                try {
                    await deleteImageApi(initialData.id, imageId);

                    setProductImages(
                        productImages
                            .filter((img) => img.id !== imageId)
                            .map((img, index) => ({
                                ...img,
                                sortOrder: index + 1,
                            }))
                    );

                    notifications.show({
                        title: "Success",
                        message: "Image deleted successfully",
                        color: "green",
                    });
                } catch (error) {
                    console.error("Failed to delete image:", error);
                    notifications.show({
                        title: "Error",
                        message: "Failed to delete the image",
                        color: "red",
                    });
                }
            }
        },
        [productImages, initialData?.id]
    );

    // Update product image alt text
    const updateProductImageAltText = useCallback(
        async (imageId: string, altText: string) => {
            // For local images (temporary IDs), just update state
            if (imageId.startsWith("temp-")) {
                setProductImages(
                    productImages.map((img) =>
                        img.id === imageId ? { ...img, altText } : img
                    )
                );
                return;
            }

            // For server images, call the API
            if (initialData?.id) {
                try {
                    const updatedImage = await updateProductImage(
                        initialData.id,
                        imageId,
                        { altText }
                    );

                    setProductImages(
                        productImages.map((img) =>
                            img.id === imageId ? { ...updatedImage } : img
                        )
                    );
                } catch (error) {
                    console.error("Failed to update image alt text:", error);
                    notifications.show({
                        title: "Error",
                        message: "Failed to update the image alt text",
                        color: "red",
                    });
                }
            }
        },
        [productImages, initialData?.id]
    );

    // Handle image uploads for variants
    const handleVariantImageUpload = useCallback(
        (files: File[], variantId: string) => {
            // In a real implementation, you would upload to your server/S3
            const newImages = files.map((file, index) => ({
                id: `temp-${Date.now()}-${index}`,
                variantId: variantId,
                imageUrl: URL.createObjectURL(file),
                altText: file.name,
                sortOrder:
                    (variants.find((v) => v.id === variantId)?.images?.length ||
                        0) +
                    index +
                    1,
            }));

            setVariants(
                variants.map((v) =>
                    v.id === variantId
                        ? { ...v, images: [...(v.images || []), ...newImages] }
                        : v
                )
            );

            setVariantImageModal({
                open: false,
                variantId: "",
                variantName: "",
            });
        },
        [variants]
    );

    // Delete variant image
    const deleteVariantImage = useCallback(
        (variantId: string, imageId: string) => {
            setVariants(
                variants.map((variant) =>
                    variant.id === variantId
                        ? {
                              ...variant,
                              images: (variant.images || [])
                                  .filter((img) => img.id !== imageId)
                                  .map((img, index) => ({
                                      ...img,
                                      sortOrder: index + 1,
                                  })),
                          }
                        : variant
                )
            );
        },
        [variants]
    );

    // Add new variant
    const addNewVariant = useCallback(() => {
        const newVariant: ProductVariant = {
            id: `temp-${Date.now()}`,
            productId: initialData?.id || "",
            attributeValues: {},
            sku: `${initialData?.sku || "NEW"}-VAR`,
            price: initialData?.minPrice || 0,
            stock: 0,
            images: [],
        };

        setVariants([...variants, newVariant]);
    }, [variants, initialData?.id, initialData?.sku, initialData?.minPrice]);

    // Delete variant
    const deleteVariant = useCallback(
        (variantId: string) => {
            setVariants(variants.filter((v) => v.id !== variantId));
        },
        [variants]
    );

    // Update variant field
    const updateVariantField = useCallback(
        (variantId: string, field: keyof ProductVariant, value: any) => {
            setVariants(
                variants.map((v) =>
                    v.id === variantId ? { ...v, [field]: value } : v
                )
            );
        },
        [variants]
    );

    // Update variant attribute
    const updateVariantAttribute = useCallback(
        (variantId: string, key: string, value: string) => {
            setVariants(
                variants.map((v) =>
                    v.id === variantId
                        ? {
                              ...v,
                              attributeValues: {
                                  ...v.attributeValues,
                                  [key]: value,
                              },
                          }
                        : v
                )
            );
        },
        [variants]
    );

    // Add attribute key to variant
    const addAttributeToVariant = useCallback(
        (variantId: string, key: string) => {
            setVariants(
                variants.map((v) =>
                    v.id === variantId
                        ? {
                              ...v,
                              attributeValues: {
                                  ...v.attributeValues,
                                  [key]: "",
                              },
                          }
                        : v
                )
            );
        },
        [variants]
    );

    // Remove attribute key from variant
    const removeAttributeFromVariant = useCallback(
        (variantId: string, key: string) => {
            setVariants(
                variants.map((v) => {
                    if (v.id === variantId) {
                        const newAttributes = { ...v.attributeValues };
                        delete newAttributes[key];
                        return { ...v, attributeValues: newAttributes };
                    }
                    return v;
                })
            );
        },
        [variants]
    );

    return {
        variants,
        setVariants,
        productImages,
        setProductImages,
        variantImageModal,
        setVariantImageModal,
        isUploading,
        handleProductImageUpload,
        handleProductImageDragEnd,
        deleteProductImage,
        updateProductImageAltText,
        handleVariantImageUpload,
        addNewVariant,
        deleteVariant,
        updateVariantField,
        updateVariantAttribute,
        addAttributeToVariant,
        removeAttributeFromVariant,
        deleteVariantImage,
    };
}
