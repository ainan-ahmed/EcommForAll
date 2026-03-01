import { z } from "zod";

export const userSchema = z
    .object({
        firstName: z.string().min(1, { message: "First Name is required" }),
        lastName: z.string().min(1, { message: "First Name is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters" }),
        confirmPassword: z
            .string()
            .min(6, { message: "Confirm Password must be at least 6 characters" }),
        username: z.string().min(1, { message: "Username is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
});

export const resetPasswordSchema = z
    .object({
        newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
        confirmPassword: z
            .string()
            .min(6, { message: "Confirm Password must be at least 6 characters" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
