import { z } from "zod";

export const productImageSchema = z.object({
    id: z.string().uuid(),
    productId: z.string().uuid(),
    imageUrl: z.string().url(),
    altText: z.string(),
    sortOrder: z.number().int(),
});

export const variantImageSchema = z.object({
    id: z.string().uuid(),
    variantId: z.string().uuid(),
    imageUrl: z.string().url(),
    altText: z.string(),
    sortOrder: z.number().int(),
});

export const productVariantSchema = z.object({
    id: z.string().uuid(),
    productId: z.string().uuid(),
    attributeValues: z.record(z.string()), // Key-value pairs for attributes
    sku: z.string(),
    price: z.number(),
    stock: z.number().int(),
    images: z.array(variantImageSchema),
});

export const productSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, { message: "Product name is required" }),
    description: z
        .string()
        .min(1, { message: "Product description is required" }),
    sku: z.string(),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
    minPrice: z.number(),
    brandId: z.string().uuid(),
    categoryId: z.string().uuid(),
    sellerId: z.string().uuid(),
    images: z.array(productImageSchema),
    variants: z.array(productVariantSchema),
});
