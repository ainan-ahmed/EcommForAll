import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    sendChatMessage,
    getChatHistory,
    clearConversation,
    checkChatbotHealth,
} from "../api/chatbotApi";
import { ChatRequest, ChatResponse } from "../types";
import { authStore } from "../../../stores/authStore";

export function useSendMessage(
    options: {
        onSuccess?: (data: ChatResponse) => void;
        onError?: (error: Error) => void;
    } = {}
) {
    const queryClient = useQueryClient();
    const conversationId = authStore.getState().user?.id;
    return useMutation({
        mutationFn: (request: ChatRequest) => sendChatMessage(request),
        onSuccess: (data) => {
            // Invalidate chat history to refresh
            queryClient.invalidateQueries({
                queryKey: ["chatHistory", conversationId],
            });
            options.onSuccess?.(data);
        },
        onError: (error: Error) => {
            options.onError?.(error);
        },
    });
}

export function useChatHistory(conversationId?: string) {
    return useQuery({
        queryKey: ["chatHistory", conversationId],
        queryFn: () => getChatHistory(conversationId),
        enabled: !!conversationId, // Only run if conversationId exists
        refetchOnMount: false, // Don't refetch on mount if we have data
        refetchOnWindowFocus: false, // Don't refetch on window focus
        gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes

        retry: (failureCount, error) => {
            // Don't retry on authentication errors
            if (error.message.includes("Authentication failed")) {
                return false;
            }
            return failureCount < 3;
        },
    });
}

export function useClearConversation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (conversationId: string) => clearConversation(conversationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
        },
    });
}

export function useChatbotHealth() {
    return useQuery({
        queryKey: ["chatbotHealth"],
        queryFn: checkChatbotHealth,
        refetchInterval: 30000, // Check every 30 seconds
    });
}
