import { z } from "zod";

export const brandSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    website: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
    isActive: z.boolean().optional(),
    image: z.instanceof(File).optional(),
});
