import { Product, ProductVariant } from "../product/types";

export interface ProductDescriptionRequest {
    productName: string;
    category?: string;
    brand?: string;
    existingDescription?: string;
    attributes?: Record<string, string>;
    targetAudience?: string;
    tone?: "professional" | "casual" | "technical" | "marketing";
    maxLength?: number;
    hasVariants?: boolean;
    variants?: ProductVariant[];
    prompt?: string;
}
export interface ProductDescriptionResponse {
    generatedDescription: string;
    originalDescription: string;
    wordCount: number;
    tone: string;
    generatedAt: string;
    success: boolean;
    errorMessage?: string;
}

export interface ChatMessage {
    id?: string;
    content: string;
    sender: "user" | "assistant" | "system";
    timestamp: string;
    status?: "sending" | "sent" | "failed" | "delivered"; // Add status
    isLastMessage?: boolean; // Track if this is the last message
}

export interface ChatRequest {
    message: string;
    conversationId?: string;
    timestamp?: string;
}

// Update to match your backend ChatResponseDto
export interface ChatResponse {
    conversationId: string;
    message: string;
    intent?: string;
    timestamp: string;
    requiresAction?: boolean;
    actionType?: string;
    success: boolean;
    error?: string;
    sessionId?: string; // Add sessionId to match backend
}

// Update to match your backend ChatHistoryResponseDto
export interface ChatHistory {
    conversationId: string;
    messages: ChatMessage[];
}

export interface similarProductsResponse {
    success: boolean;
    message: string;
    sourceProductId: string;
    sourceProductName: string;
    similarProducts: Product[];
    totalFound: number;
}
