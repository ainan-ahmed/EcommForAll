import { useMemo } from "react";
import { Button, Group, Text, Stack, Paper, Tabs, Modal, FileButton, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconCheck, IconUpload } from "@tabler/icons-react";
import { Product } from "../types";
import { productSchema } from "../productSchemas";
import { BasicInfoTab } from "./basicInfoTab";
import { BasicImagesTab } from "./basicImagesTab";
import { VariantsTab } from "./variantsTab";
import { useProductFormState } from "../hooks/useProductFormState";
import { Brand } from "../../brand/types";
import { Category } from "../../category/types";

interface ProductFormProps {
    initialData?: Product;
    categories: Category[];
    brands: Brand[];
    onSubmit: (values: Product) => void;
    isLoading: boolean;
    onCancel?: () => void;
}

export function ProductForm({
    initialData,
    categories,
    brands,
    onSubmit,
    isLoading,
    onCancel,
}: ProductFormProps) {
    // Call the hook to get all returned functions and state
    const {
        variants,
        setVariants,
        productImages,
        setProductImages,
        variantImageModal,
        setVariantImageModal,
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
        isUploading,
    } = useProductFormState(initialData);

    // Initialize form with product data
    const form = useForm<Omit<Product, "variants" | "images">>({
        initialValues: {
            id: initialData?.id || "",
            name: initialData?.name || "",
            description: initialData?.description || "",
            sku: initialData?.sku || "",
            isActive: initialData?.isActive ?? true,
            isFeatured: initialData?.isFeatured ?? false,
            minPrice: initialData?.minPrice || 0,
            categoryId: initialData?.categoryId || "",
            brandId: initialData?.brandId || "",
            sellerId: initialData?.sellerId || "",
        },
        validate: zodResolver(productSchema.omit({ variants: true, images: true })),
    });

    // Sort product images by sortOrder
    const sortedProductImages = useMemo(() => {
        return [...productImages].sort((a, b) => a.sortOrder - b.sortOrder);
    }, [productImages]);

    // Handle form submission
    const handleSubmit = form.onSubmit((values) => {
        // Create complete product object with form values, variants, and images
        const productData: Product = {
            ...values,
            variants,
            images: productImages,
        };

        onSubmit(productData);
    });

    return (
        <form onSubmit={handleSubmit}>
            <Paper p="xl" withBorder mb="xl">
                <Stack gap="xl">
                    <Group gap="sm" justify="space-between">
                        <Title order={2}>{initialData ? "Edit Product" : "Add New Product"}</Title>
                        <Group>
                            <Button variant="default" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={isLoading}
                                leftSection={<IconCheck size={18} />}
                            >
                                {initialData ? "Save Changes" : "Create Product"}
                            </Button>
                        </Group>
                    </Group>

                    <Tabs defaultValue="basic">
                        <Tabs.List>
                            <Tabs.Tab value="basic">Basic Information</Tabs.Tab>
                            <Tabs.Tab value="images">Images</Tabs.Tab>
                            <Tabs.Tab value="variants">Variants ({variants.length})</Tabs.Tab>
                        </Tabs.List>

                        {/* Basic Info Tab */}
                        <Tabs.Panel value="basic" pt="xl">
                            <BasicInfoTab form={form} categories={categories} brands={brands} />
                        </Tabs.Panel>

                        {/* Images Tab */}
                        <Tabs.Panel value="images" pt="xl">
                            <BasicImagesTab
                                productImages={sortedProductImages}
                                onUpload={handleProductImageUpload}
                                onDelete={deleteProductImage}
                                onDragEnd={handleProductImageDragEnd}
                                onUpdateAltText={updateProductImageAltText}
                                isUploading={isUploading}
                            />
                        </Tabs.Panel>

                        {/* Variants Tab */}
                        <Tabs.Panel value="variants" pt="xl">
                            <VariantsTab
                                variants={variants}
                                onAdd={addNewVariant}
                                onDelete={deleteVariant}
                                onDuplicate={(variant) => {
                                    const newVariant = {
                                        ...variant,
                                        id: `temp-${Date.now()}`,
                                        sku: `${variant.sku}-COPY`,
                                    };
                                    setVariants([...variants, newVariant]);
                                }}
                                onUpdateField={updateVariantField}
                                onUpdateAttribute={updateVariantAttribute}
                                onAddAttribute={addAttributeToVariant}
                                onRemoveAttribute={removeAttributeFromVariant}
                                onOpenImageModal={(id, name) =>
                                    setVariantImageModal({
                                        open: true,
                                        variantId: id,
                                        variantName: name,
                                    })
                                }
                                onDeleteImage={deleteVariantImage}
                            />
                        </Tabs.Panel>
                    </Tabs>
                </Stack>
            </Paper>

            <Group justify="flex-end">
                <Button variant="default" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" loading={isLoading} leftSection={<IconCheck size={18} />}>
                    {initialData ? "Save Changes" : "Create Product"}
                </Button>
            </Group>

            {/* Variant Image Upload Modal */}
            <Modal
                opened={variantImageModal.open}
                onClose={() =>
                    setVariantImageModal({
                        open: false,
                        variantId: "",
                        variantName: "",
                    })
                }
                title={`Upload Images for ${variantImageModal.variantName}`}
            >
                <Stack gap="md">
                    <FileButton
                        onChange={(files) =>
                            handleVariantImageUpload(files, variantImageModal.variantId)
                        }
                        accept="image/*"
                        multiple
                    >
                        {(props) => (
                            <Button fullWidth leftSection={<IconUpload size={18} />} {...props}>
                                Select Images
                            </Button>
                        )}
                    </FileButton>
                    <Text size="sm" c="dimmed">
                        Supported formats: JPEG, PNG, GIF. Maximum file size: 5MB.
                    </Text>
                </Stack>
            </Modal>
        </form>
    );
}
