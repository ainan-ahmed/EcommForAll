import { useState } from "react";
import { Affix, ActionIcon, Modal, Transition, Badge } from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";
import { Chatbot } from "./Chatbot";
import { useChatbotHealth } from "../hooks/useChatbot";

export function ChatbotWidget() {
    const [opened, setOpened] = useState(false);
    const { data: isHealthy } = useChatbotHealth();

    return (
        <>
            <Affix position={{ bottom: 80, right: 20 }} zIndex={100}>
                <Transition transition="slide-up" mounted={!opened}>
                    {(transitionStyles) => (
                        <div style={transitionStyles}>
                            <ActionIcon
                                size={60} // Make it larger for better visibility
                                radius="xl"
                                variant="filled"
                                color="blue"
                                onClick={() => setOpened(true)}
                                style={{
                                    position: "relative",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // Add shadow
                                }}
                            >
                                <IconMessageCircle size={32} />
                                {isHealthy && (
                                    <Badge
                                        size="xs"
                                        color="green"
                                        variant="filled"
                                        style={{
                                            position: "absolute",
                                            top: -2,
                                            right: -2,
                                            width: 12,
                                            height: 12,
                                            padding: 0,
                                        }}
                                    />
                                )}
                            </ActionIcon>
                        </div>
                    )}
                </Transition>
            </Affix>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="AI Assistant"
                size="lg"
                styles={{
                    body: { padding: 0 },
                    header: { marginBottom: 0 },
                }}
                zIndex={200} // Ensure modal appears above everything
            >
                <Chatbot height={500} />
            </Modal>
        </>
    );
}
