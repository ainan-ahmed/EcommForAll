import { API } from "../../../config/api";
import { ChatRequest, ChatResponse, ChatHistory } from "../types";

export async function sendChatMessage(
    request: ChatRequest
): Promise<ChatResponse> {
    const token = await getAuthToken();
    console.log("request:", request);
    
    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.CHATBOT.SEND_MESSAGE}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(request),
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Failed to send message: ${response.status}`
        );
    }

    return response.json();
}

export async function getChatHistory(
    conversationId?: string
): Promise<ChatHistory> {
    const token = await getAuthToken();

    const url = new URL(`${API.BASE_URL}${API.ENDPOINTS.CHATBOT.CHAT_HISTORY}`);
    if (conversationId) {
        url.searchParams.append("conversationId", conversationId);
    }

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message ||
                `Failed to get chat history: ${response.status}`
        );
    }

    return response.json();
}

export async function clearConversation(conversationId: string): Promise<void> {
    const token = await getAuthToken();

    const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.CHATBOT.CLEAR_CONVERSATION}/${conversationId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to clear conversation: ${response.status}`);
    }
}

export async function checkChatbotHealth(): Promise<boolean> {
    try {
        const token = await getAuthToken();
        const response = await fetch(
            `${API.BASE_URL}${API.ENDPOINTS.CHATBOT.HEALTH}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.ok;
    } catch {
        return false;
    }
}

async function getAuthToken(): Promise<string> {
    const token = localStorage.getItem("authToken");
    if (!token) {
        throw new Error("Authentication required");
    }
    return token;
}
