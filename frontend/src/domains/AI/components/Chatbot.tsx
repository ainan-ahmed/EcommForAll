// src/domains/AI/components/Chatbot.tsx
import { useMemo, useState } from "react";
import { Paper, ActionIcon, Tooltip, LoadingOverlay, Alert } from "@mantine/core";
import {
    IconAlertCircle,
    IconArrowsMaximize,
    IconArrowsMinimize,
    IconX,
    IconRefresh,
    IconRotateClockwise,
    IconTrash,
} from "@tabler/icons-react";
import {
    MainContainer,
    ChatContainer,
    ConversationHeader,
    MessageList,
    Message,
    MessageInput,
    MessageSeparator,
    Avatar,
    TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./chatbot.css";
import { notifications } from "@mantine/notifications";

import {
    useSendMessage,
    useChatHistory,
    useClearConversation,
    useChatbotHealth,
} from "../hooks/useChatbot";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";
import { ChatMessage } from "../types";

const MAX_DISPLAY_MESSAGES = 200;

interface ChatbotProps {
    conversationId?: string;
    height?: number | string;
    isMaximized?: boolean;
    onToggleMaximize?: () => void;
    onClose?: () => void;
    headerTitle?: string;
    headerSubtitle?: string;
}

export function Chatbot({
    conversationId,
    height = 600,
    isMaximized = false,
    onToggleMaximize,
    onClose,
    headerTitle = "AI Assistant",
    headerSubtitle,
}: ChatbotProps) {
    const { user, isAuthenticated } = useStore(authStore);
    const [currentConversationId, setCurrentConversationId] = useState(
        conversationId || user?.id || ""
    );
    const [pendingMessage, setPendingMessage] = useState<ChatMessage | null>(null);
    const [failedMessage, setFailedMessage] = useState<ChatMessage | null>(null);
    const [lastSentMessageStatus, setLastSentMessageStatus] = useState<
        "sending" | "sent" | "failed"
    >("sent");

    const {
        data: chatHistory,
        isLoading,
        refetch,
    } = useChatHistory(isAuthenticated ? currentConversationId : undefined);
    const { data: isHealthy } = useChatbotHealth();

    const sendMessageMutation = useSendMessage({
        onSuccess: (response) => {
            setPendingMessage(null);
            setFailedMessage(null);
            setLastSentMessageStatus("sent");

            if (response.success) {
                if (response.sessionId && response.sessionId !== currentConversationId) {
                    setCurrentConversationId(response.sessionId);
                }

                setTimeout(() => {
                    refetch();
                }, 100);
            } else {
                notifications.show({
                    title: "Error",
                    message: response.error || "Failed to send message",
                    color: "red",
                });
            }
        },
        onError: (error) => {
            if (pendingMessage) {
                setFailedMessage({ ...pendingMessage, status: "failed" });
            }
            setPendingMessage(null);
            setLastSentMessageStatus("failed");

            notifications.show({
                title: "Error",
                message: error.message,
                color: "red",
            });

            if (error.message.includes("Authentication failed")) {
                authStore.getState().checkAuth();
            }
        },
    });

    const clearConversationMutation = useClearConversation();

    const handleSendMessage = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || sendMessageMutation.isPending) return;

        setLastSentMessageStatus("sending");

        const optimisticMessage: ChatMessage = {
            content: trimmed,
            sender: "user",
            timestamp: new Date().toISOString(),
            status: "sending",
        };

        setPendingMessage(optimisticMessage);

        sendMessageMutation.mutate({
            message: trimmed,
            conversationId: currentConversationId || undefined,
            timestamp: new Date().toISOString(),
        });
    };

    const handleClearConversation = () => {
        if (!currentConversationId) return;

        clearConversationMutation.mutate(currentConversationId, {
            onSuccess: () => {
                notifications.show({
                    title: "Conversation Cleared",
                    message: "Chat history has been cleared",
                    color: "blue",
                });
                refetch();
            },
        });
    };

    const handleRetryMessage = (messageToRetry: ChatMessage) => {
        setFailedMessage(null);
        handleSendMessage(messageToRetry.content);
    };

    if (!isAuthenticated) {
        return (
            <Paper p="md" withBorder style={{ height }}>
                <Alert color="red" title="Authentication Required">
                    Please log in to use the AI assistant.
                </Alert>
            </Paper>
        );
    }

    const messagesWithStatus = useMemo(() => {
        if (!chatHistory?.messages) return [];

        const trimmedHistory = chatHistory.messages.slice(-MAX_DISPLAY_MESSAGES);

        const messages = [...trimmedHistory];

        if (pendingMessage && pendingMessage.status === "sending") {
            messages.push(pendingMessage);
        }

        if (failedMessage) {
            messages.push(failedMessage);
        }

        return messages.map((msg, index) => {
            const isLastUserMessage = index === messages.length - 1 && msg.sender === "user";
            const status = msg.status || (isLastUserMessage ? lastSentMessageStatus : "sent");
            return { ...msg, status };
        });
    }, [chatHistory?.messages, failedMessage, pendingMessage, lastSentMessageStatus]);

    const formatTime = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            return "";
        }
    };

    const statusLabel = headerSubtitle ?? (isHealthy ? "Online" : "Offline");

    const renderRefreshButton = () => (
        <Tooltip label="Refresh chat" withArrow position="bottom">
            <ActionIcon
                variant="subtle"
                color="blue"
                size="md"
                onClick={() => refetch()}
                aria-label="Refresh chat"
            >
                <IconRefresh size={18} />
            </ActionIcon>
        </Tooltip>
    );

    const renderClearButton = () => (
        <Tooltip label="Clear conversation" withArrow position="bottom">
            <ActionIcon
                variant="subtle"
                color="red"
                size="md"
                onClick={handleClearConversation}
                aria-label="Clear conversation"
                loading={clearConversationMutation.isPending}
            >
                <IconTrash size={18} />
            </ActionIcon>
        </Tooltip>
    );

    return (
        <Paper
            style={{
                height,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "var(--mantine-color-body)",
            }}
        >
            <LoadingOverlay visible={isLoading && !chatHistory} />

            {!isHealthy && (
                <Alert color="yellow" icon={<IconAlertCircle size={16} />}>
                    AI Assistant is currently offline. Messages may not be processed.
                </Alert>
            )}

            <MainContainer style={{ flex: 1, backgroundColor: "transparent" }}>
                <ChatContainer style={{ backgroundColor: "transparent" }}>
                    <ConversationHeader style={{ backgroundColor: "transparent" }}>
                        <Avatar name="AI" />
                        <ConversationHeader.Content userName={headerTitle} info={statusLabel} />
                        <ConversationHeader.Actions>
                            {onClose && (
                                <Tooltip label="Close chat" withArrow position="bottom">
                                    <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        size="md"
                                        onClick={onClose}
                                        aria-label="Close chat"
                                    >
                                        <IconX size={18} />
                                    </ActionIcon>
                                </Tooltip>
                            )}

                            {chatHistory?.messages && chatHistory.messages.length > 0 &&
                                renderClearButton()}

                            {onToggleMaximize && (
                                <Tooltip
                                    label={isMaximized ? "Restore size" : "Minimize"}
                                    withArrow
                                    position="bottom"
                                >
                                    <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        size="md"
                                        onClick={onToggleMaximize}
                                        aria-label={isMaximized ? "Restore size" : "Maximize"}
                                    >
                                        {isMaximized ? (
                                            <IconArrowsMinimize size={18} />
                                        ) : (
                                            <IconArrowsMaximize size={18} />
                                        )}
                                    </ActionIcon>
                                </Tooltip>
                            )}

                            {renderRefreshButton()}
                        </ConversationHeader.Actions>
                    </ConversationHeader>

                    <MessageList
                        style={{ backgroundColor: "transparent" }}
                        typingIndicator={
                            sendMessageMutation.isPending && !pendingMessage ? (
                                <TypingIndicator content="AI is thinking" />
                            ) : null
                        }
                    >
                        {messagesWithStatus.length === 0 && !isLoading && (
                            <MessageSeparator content="Start a conversation" />
                        )}

                        {messagesWithStatus.map((msg, index) => (
                            <Message
                                key={`${msg.timestamp}-${index}`}
                                model={{
                                    message: msg.content,
                                    sentTime: formatTime(msg.timestamp),
                                    sender: msg.sender,
                                    direction: msg.sender === "user" ? "outgoing" : "incoming",
                                    position: "single",
                                }}
                            >
                                <Message.Footer
                                    sender={msg.sender === "user" ? "You" : "AI Assistant"}
                                    sentTime={formatTime(msg.timestamp)}
                                />
                                {msg.status === "failed" && (
                                    <Message.CustomContent>
                                        <div
                                            style={{
                                                color: "var(--mantine-color-red-6)",
                                                fontSize: "0.8rem",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6,
                                            }}
                                        >
                                            <span>Failed to send</span>
                                            <IconRotateClockwise
                                                size={14}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleRetryMessage(msg)}
                                            />
                                        </div>
                                    </Message.CustomContent>
                                )}
                            </Message>
                        ))}
                    </MessageList>

                    <MessageInput
                        placeholder="Type message here..."
                        onSend={(_, textContent) => handleSendMessage(textContent)}
                        disabled={!isHealthy || sendMessageMutation.isPending}
                        attachButton={false}
                    />
                </ChatContainer>
            </MainContainer>
        </Paper>
    );
}
