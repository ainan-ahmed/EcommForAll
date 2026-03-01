import { z } from "zod";

export const reviewSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be less than 100 characters"),
    comment: z
        .string()
        .min(10, "Comment must be at least 10 characters")
        .max(1000, "Comment must be less than 1000 characters"),
});
