import { Paper, Text, Group, Loader, ThemeIcon, Box, Tooltip } from "@mantine/core";
import { IconCheck, IconX, IconClock, IconCheckbox } from "@tabler/icons-react";
import { ChatMessage } from "../types";

interface ChatMessageComponentProps {
    message: ChatMessage;
    isLoading?: boolean;
    showStatusIcon?: boolean;
    onRetry?: (message: ChatMessage) => void; // Add retry callback
}

export function ChatMessageComponent({
    message,
    isLoading = false,
    showStatusIcon = false,
    onRetry,
}: ChatMessageComponentProps) {
    const isUser = message.sender === "user";
    const isAssistant = message.sender === "assistant";
    const isSystem = message.sender === "system";

    const getStatusIcon = () => {
        if (!showStatusIcon || !isUser) return null;

        switch (message.status) {
            case "sending":
                return (
                    <Tooltip label="Sending...">
                        <ThemeIcon size="xs" color="gray" variant="subtle">
                            <IconClock size={12} />
                        </ThemeIcon>
                    </Tooltip>
                );
            case "sent":
                return (
                    <Tooltip label="Message sent">
                        <ThemeIcon size="xs" color="blue" variant="subtle">
                            <IconCheck size={12} />
                        </ThemeIcon>
                    </Tooltip>
                );
            case "delivered":
                return (
                    <Tooltip label="Message delivered">
                        <ThemeIcon size="xs" color="green" variant="subtle">
                            <IconCheckbox size={12} />
                        </ThemeIcon>
                    </Tooltip>
                );
            case "failed":
                return (
                    <Tooltip label="Message failed to send">
                        <ThemeIcon size="xs" color="red" variant="subtle">
                            <IconX size={12} />
                        </ThemeIcon>
                    </Tooltip>
                );
            default:
                return null;
        }
    };

    return (
        <Group
            gap="xs"
            align="flex-start"
            justify={isUser ? "flex-end" : "flex-start"}
            wrap="nowrap"
        >
            {/* Status icon on the left for user messages */}
            {isUser && showStatusIcon && <Box style={{ marginTop: 8 }}>{getStatusIcon()}</Box>}

            <Paper
                p="md"
                bg={isUser ? "blue.0" : isAssistant ? "gray.0" : "yellow.0"}
                style={{
                    maxWidth: "85%",
                    opacity: message.status === "sending" ? 0.7 : 1,
                    border: message.status === "failed" ? "1px solid red" : undefined,
                }}
            >
                <Text size="sm" fw={500} mb={4}>
                    {isUser ? "You" : isAssistant ? "AI Assistant" : "System"}
                </Text>

                <Group gap="xs" align="center">
                    <Text size="sm" style={{ flex: 1 }}>
                        {message.content}
                    </Text>
                    {isLoading && <Loader size="xs" />}
                </Group>

                <Group justify="space-between" mt={4}>
                    <Text size="xs" c="dimmed">
                        {new Date(message.timestamp).toLocaleTimeString()}
                    </Text>

                    {/* Show retry button for failed messages */}
                    {message.status === "failed" && isUser && onRetry && (
                        <Text
                            size="xs"
                            c="red"
                            style={{ cursor: "pointer" }}
                            onClick={() => onRetry(message)}
                        >
                            Retry
                        </Text>
                    )}
                </Group>
            </Paper>
        </Group>
    );
}
