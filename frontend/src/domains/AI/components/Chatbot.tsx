// src/domains/AI/components/Chatbot.tsx
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
    Paper,
    Stack,
    TextInput,
    Button,
    ScrollArea,
    Group,
    Text,
    Avatar,
    ActionIcon,
    Tooltip,
    Badge,
    LoadingOverlay,
    Alert,
    Box,
    Transition,
} from "@mantine/core";
import {
    IconSend,
    IconRobot,
    IconTrash,
    IconRefresh,
    IconArrowDown,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
    useSendMessage,
    useChatHistory,
    useClearConversation,
    useChatbotHealth,
} from "../hooks/useChatbot";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";
import { ChatMessageComponent } from "./ChatMessageComponent";
import { ChatMessage } from "../types";

interface ChatbotProps {
    conversationId?: string;
    height?: number;
}

export function Chatbot({ conversationId, height = 600 }: ChatbotProps) {
    const { user, isAuthenticated } = useStore(authStore);
    const [message, setMessage] = useState("");
    const [currentConversationId, setCurrentConversationId] = useState(
        conversationId || user?.id || ""
    );
    const [isUserScrolled, setIsUserScrolled] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Add state to track pending message
    const [pendingMessage, setPendingMessage] = useState<ChatMessage | null>(
        null
    );
    const [failedMessage, setFailedMessage] = useState<ChatMessage | null>(
        null
    );
    const [lastSentMessageStatus, setLastSentMessageStatus] = useState<
        "sending" | "sent" | "failed"
    >("sent");

    // ScrollArea viewport ref for better control
    const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Only fetch if authenticated
    const {
        data: chatHistory,
        isLoading,
        refetch,
        error: historyError,
    } = useChatHistory(isAuthenticated ? currentConversationId : undefined);

    const { data: isHealthy } = useChatbotHealth();

    // Improved scroll to bottom function using ScrollArea API
    const scrollToBottom = useCallback((smooth = true) => {
        if (scrollAreaViewportRef.current) {
            const scrollHeight = scrollAreaViewportRef.current.scrollHeight;
            const clientHeight = scrollAreaViewportRef.current.clientHeight;

            scrollAreaViewportRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: smooth ? "smooth" : "auto",
            });

            setIsUserScrolled(false);
            setShowScrollButton(false);
        }
    }, []);

    // Handle scroll events to detect user scrolling
    const handleScroll = useCallback(() => {
        if (!scrollAreaViewportRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } =
            scrollAreaViewportRef.current;
        const scrolledFromBottom = scrollHeight - scrollTop - clientHeight;
        const threshold = 100; // pixels from bottom

        const isNearBottom = scrolledFromBottom < threshold;
        setIsUserScrolled(!isNearBottom);
        setShowScrollButton(
            !isNearBottom &&
                chatHistory?.messages !== undefined &&
                chatHistory.messages.length > 3
        );
    }, [chatHistory?.messages]);

    const sendMessageMutation = useSendMessage({
        onSuccess: (response) => {
            console.log("Message sent successfully:", response);

            // Clear both pending and failed messages
            setPendingMessage(null);
            setFailedMessage(null);
            setLastSentMessageStatus("sent");

            if (response.success) {
                if (
                    response.sessionId &&
                    response.sessionId !== currentConversationId
                ) {
                    setCurrentConversationId(response.sessionId);
                }
                setMessage("");

                setTimeout(() => {
                    refetch();
                    setTimeout(() => scrollToBottom(), 200);
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
            console.error("Message send error:", error);

            // Move pending message to failed message
            if (pendingMessage) {
                setFailedMessage({
                    ...pendingMessage,
                    status: "failed",
                });
            }
            setPendingMessage(null);
            setLastSentMessageStatus("failed");

            notifications.show({
                title: "Error",
                message: error.message,
                color: "red",
            });

            // Auto-remove failed message after 10 seconds
            setTimeout(() => {
                setFailedMessage(null);
            }, 10000);

            if (error.message.includes("Authentication failed")) {
                authStore.getState().checkAuth();
            }
        },
    });

    const clearConversationMutation = useClearConversation();

    // Auto-scroll when new messages arrive (only if user is near bottom)
    useEffect(() => {
        if (chatHistory?.messages && !isUserScrolled) {
            // Small delay to ensure DOM has rendered the new message
            const timer = setTimeout(() => scrollToBottom(), 150);
            return () => clearTimeout(timer);
        }
    }, [chatHistory?.messages?.length, isUserScrolled, scrollToBottom]);

    // Initial scroll to bottom when chat loads
    useEffect(() => {
        if (chatHistory?.messages && chatHistory.messages.length > 0) {
            // Immediate scroll without animation for initial load
            setTimeout(() => scrollToBottom(false), 100);
        }
    }, [chatHistory?.messages?.length, scrollToBottom]);

    const handleSendMessage = () => {
        if (!message.trim() || sendMessageMutation.isPending) return;

        // Reset scroll state when sending a new message
        setIsUserScrolled(false);
        setShowScrollButton(false);
        setLastSentMessageStatus("sending");

        // Create pending message for optimistic UI
        const newPendingMessage: ChatMessage = {
            content: message.trim(),
            sender: "user",
            timestamp: new Date().toISOString(),
            status: "sending",
            isLastMessage: true,
        };

        setPendingMessage(newPendingMessage);

        sendMessageMutation.mutate({
            message: message.trim(),
            conversationId: currentConversationId || undefined,
            timestamp: new Date().toISOString(),
        });
    };

    const handleClearConversation = () => {
        if (!currentConversationId) return;

        clearConversationMutation.mutate(currentConversationId, {
            onSuccess: () => {
                setIsUserScrolled(false);
                setShowScrollButton(false);
                notifications.show({
                    title: "Conversation Cleared",
                    message: "Chat history has been cleared",
                    color: "blue",
                });
            },
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Show authentication error if not authenticated
    if (!isAuthenticated) {
        return (
            <Paper p="md" withBorder style={{ height }}>
                <Alert color="red" title="Authentication Required">
                    Please log in to use the AI assistant.
                </Alert>
            </Paper>
        );
    }

    // Update messagesWithStatus to handle both pending and failed messages
    const messagesWithStatus = useMemo(() => {
        if (!chatHistory?.messages) return [];

        const messages = [...chatHistory.messages];

        // Add pending message if sending
        if (pendingMessage && pendingMessage.status === "sending") {
            messages.push(pendingMessage);
        }

        // Add failed message temporarily
        if (failedMessage) {
            messages.push(failedMessage);
        }

        return messages.map((msg, index) => {
            const isLastUserMessage =
                index === messages.length - 1 && msg.sender === "user";
            const isSecondLastUserMessage =
                index === messages.length - 2 &&
                msg.sender === "user" &&
                messages[messages.length - 1]?.sender !== "user";

            return {
                ...msg,
                status:
                    msg.status ||
                    (isLastUserMessage || isSecondLastUserMessage
                        ? lastSentMessageStatus
                        : "sent"),
                isLastMessage: isLastUserMessage,
            };
        });
    }, [
        chatHistory?.messages,
        pendingMessage,
        failedMessage,
        lastSentMessageStatus,
    ]);

    // In your Chatbot component, add retry functionality
    const handleRetryMessage = (failedMessage: ChatMessage) => {
        console.log("Retrying message:", failedMessage.content);

        // Clear the failed message
        setFailedMessage(null);

        // Set the message input to the failed message content
        setMessage(failedMessage.content);

        // Or automatically retry:
        // sendMessageMutation.mutate({
        //     message: failedMessage.content,
        //     conversationId: currentConversationId || undefined,
        //     timestamp: new Date().toISOString(),
        // });
    };

    return (
        <Paper p="md" withBorder style={{ height }}>
            <LoadingOverlay visible={isLoading && !chatHistory} />

            <Stack h="100%" gap="md">
                {/* Header */}
                <Group justify="space-between" pb="xs">
                    <Group>
                        <Avatar color="blue" radius="xl" size="md">
                            <IconRobot size={20} />
                        </Avatar>
                        <Stack gap={2}>
                            <Text size="sm" fw={600}>
                                AI Assistant
                            </Text>
                            <Badge
                                size="xs"
                                color={isHealthy ? "green" : "red"}
                                variant="dot"
                            >
                                {isHealthy ? "Online" : "Offline"}
                            </Badge>
                        </Stack>
                    </Group>

                    <Group gap="xs">
                        <Tooltip label="Refresh chat">
                            <ActionIcon
                                variant="subtle"
                                onClick={() => refetch()}
                                loading={isLoading}
                                size="sm"
                            >
                                <IconRefresh size={16} />
                            </ActionIcon>
                        </Tooltip>

                        {chatHistory?.messages &&
                            chatHistory.messages.length > 0 && (
                                <Tooltip label="Clear conversation">
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        onClick={handleClearConversation}
                                        loading={
                                            clearConversationMutation.isPending
                                        }
                                        size="sm"
                                    >
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                    </Group>
                </Group>

                {/* Health warning */}
                {!isHealthy && (
                    <Alert color="yellow">
                        AI Assistant is currently offline. Messages may not be
                        processed.
                    </Alert>
                )}

                {/* Messages ScrollArea */}
                <Box style={{ position: "relative", flex: 1 }}>
                    <ScrollArea
                        h="100%"
                        scrollbarSize={6}
                        scrollHideDelay={1000}
                        viewportRef={scrollAreaViewportRef}
                        onScrollPositionChange={handleScroll}
                        type="scroll"
                    >
                        <Stack gap="md" pr="xs" pb="sm">
                            {messagesWithStatus.length === 0 ? (
                                <Paper
                                    p="xl"
                                    withBorder
                                    ta="center"
                                    bg="gray.0"
                                    style={{ marginTop: "20%" }}
                                >
                                    <Avatar
                                        color="blue"
                                        size="lg"
                                        mx="auto"
                                        mb="md"
                                    >
                                        <IconRobot size={32} />
                                    </Avatar>
                                    <Text size="lg" fw={500} mb="sm">
                                        Welcome to AI Assistant!
                                    </Text>
                                    <Text c="dimmed" size="sm">
                                        Start a conversation by typing a message
                                        below.
                                    </Text>
                                </Paper>
                            ) : (
                                <>
                                    {messagesWithStatus.map((msg, index) => (
                                        <ChatMessageComponent
                                            key={`${msg.timestamp}-${index}`}
                                            message={msg}
                                            showStatusIcon={
                                                msg.sender === "user"
                                            }
                                            onRetry={
                                                msg.status === "failed"
                                                    ? handleRetryMessage
                                                    : undefined
                                            }
                                        />
                                    ))}

                                    {sendMessageMutation.isPending &&
                                        !pendingMessage && (
                                            <ChatMessageComponent
                                                message={{
                                                    content: "Thinking...",
                                                    sender: "assistant",
                                                    timestamp:
                                                        new Date().toISOString(),
                                                }}
                                                isLoading
                                            />
                                        )}

                                    <div
                                        ref={messagesEndRef}
                                        style={{ height: 1 }}
                                    />
                                </>
                            )}
                        </Stack>
                    </ScrollArea>

                    {/* Scroll to bottom button */}
                    <Transition
                        mounted={showScrollButton}
                        transition="slide-up"
                        duration={200}
                    >
                        {(styles) => (
                            <ActionIcon
                                style={{
                                    ...styles,
                                    position: "absolute",
                                    bottom: 10,
                                    right: 10,
                                    zIndex: 100,
                                }}
                                variant="filled"
                                color="blue"
                                size="lg"
                                onClick={() => scrollToBottom()}
                                radius="xl"
                            >
                                <IconArrowDown size={18} />
                            </ActionIcon>
                        )}
                    </Transition>
                </Box>

                {/* Input */}
                <Group gap="sm" align="flex-end">
                    <TextInput
                        flex={1}
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.currentTarget.value)}
                        onKeyDown={handleKeyPress}
                        disabled={sendMessageMutation.isPending || !isHealthy}
                        maxLength={1000}
                        size="sm"
                    />
                    <ActionIcon
                        size="lg"
                        onClick={handleSendMessage}
                        loading={sendMessageMutation.isPending}
                        disabled={!message.trim() || !isHealthy}
                        variant="filled"
                        color="blue"
                    >
                        <IconSend size={18} />
                    </ActionIcon>
                </Group>
            </Stack>
        </Paper>
    );
}
