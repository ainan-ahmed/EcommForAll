import { useState, useEffect, useRef } from "react";
import { Affix, ActionIcon, Transition, Badge, Paper, Box, Overlay } from "@mantine/core";
import { IconMessageCircle, IconX } from "@tabler/icons-react";
import { Chatbot } from "./Chatbot";
import { useChatbotHealth } from "../hooks/useChatbot";

const DEFAULT_SIZE = {
    width: 360,
    height: 480,
};

const MAXIMIZED_SIZE = {
    width: 860,
    height: 680,
};

export function ChatbotWidget() {
    const [opened, setOpened] = useState(false);
    const [maximized, setMaximized] = useState(false);
    const { data: isHealthy } = useChatbotHealth();
    const widgetRef = useRef<HTMLDivElement>(null);

    const statusText = isHealthy ? "Ready to help" : "Temporarily offline";

    // Lock body scroll when maximized
    useEffect(() => {
        if (maximized) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [maximized]);

    // Prevent scroll chaining in normal (non-maximized) state:
    // attach a non-passive wheel listener so we can call preventDefault()
    // when the scroll would escape the widget container.
    useEffect(() => {
        if (!opened || maximized) return;
        const el = widgetRef.current;
        if (!el) return;

        const handler = (e: WheelEvent) => {
            // Walk up from the event target to find the nearest scrollable
            // element that lives inside the widget.
            let node = e.target as HTMLElement | null;
            let scrollable: HTMLElement | null = null;
            while (node && node !== el) {
                if (node.scrollHeight > node.clientHeight + 1) {
                    scrollable = node;
                    break;
                }
                node = node.parentElement;
            }

            if (!scrollable) {
                // No scrollable ancestor inside the widget → swallow the event
                e.preventDefault();
                return;
            }

            const { scrollTop, scrollHeight, clientHeight } = scrollable;
            const atTop = scrollTop <= 0;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

            if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
                e.preventDefault();
            }
        };

        el.addEventListener("wheel", handler, { passive: false });
        return () => el.removeEventListener("wheel", handler);
    }, [opened, maximized]);

    return (
        <>
            {/* Backdrop when maximized */}
            <Transition mounted={maximized} transition="fade" duration={200}>
                {(overlayStyles) => (
                    <Overlay
                        style={{
                            ...overlayStyles,
                            position: "fixed",
                            inset: 0,
                            zIndex: 1499,
                        }}
                        blur={4}
                        backgroundOpacity={0.45}
                        color="var(--mantine-color-dark-9)"
                        onClick={() => setMaximized(false)}
                    />
                )}
            </Transition>

            <Affix position={{ bottom: 24, right: 24 }} zIndex={maximized ? 1600 : 200}>
                <Box style={{ position: "relative" }}>
                    <Transition
                        mounted={opened}
                        transition="slide-up"
                        duration={300}
                        timingFunction="ease"
                    >
                        {(styles) => (
                            <Paper
                                ref={widgetRef}
                                shadow="xl"
                                radius="lg"
                                withBorder
                                style={{
                                    ...styles,
                                    position: "fixed",
                                    ...(maximized
                                        ? {
                                              top: "50%",
                                              left: "50%",
                                              transform: "translate(-50%, -50%)",
                                              bottom: "unset",
                                              right: "unset",
                                          }
                                        : {
                                              bottom: 88,
                                              right: 24,
                                              top: "auto",
                                              transform: "none",
                                          }),
                                    width: maximized
                                        ? `min(${MAXIMIZED_SIZE.width}px, calc(100vw - 48px))`
                                        : `min(${DEFAULT_SIZE.width}px, calc(100vw - 48px))`,
                                    height: maximized
                                        ? `min(${MAXIMIZED_SIZE.height}px, calc(100vh - 80px))`
                                        : `min(${DEFAULT_SIZE.height}px, calc(100vh - 120px))`,
                                    display: "flex",
                                    flexDirection: "column",
                                    overflow: "hidden",
                                    zIndex: maximized ? 1500 : 1000,
                                    borderWidth: 1,
                                    transition:
                                        "width 250ms ease, height 250ms ease, top 250ms ease, left 250ms ease, transform 250ms ease, bottom 250ms ease, right 250ms ease",
                                }}
                            >
                                <Chatbot
                                    height="100%"
                                    isMaximized={maximized}
                                    onToggleMaximize={() => setMaximized((prev) => !prev)}
                                    onClose={() => {
                                        setOpened(false);
                                        setMaximized(false);
                                    }}
                                    headerTitle="EcommforAll Copilot"
                                    headerSubtitle={statusText}
                                />
                            </Paper>
                        )}
                    </Transition>

                    <ActionIcon
                        size={60}
                        radius="xl"
                        variant="filled"
                        color={opened ? "gray" : "blue"}
                        onClick={() => setOpened((prev) => !prev)}
                        style={{
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                            transition: "all 0.2s ease",
                            transform: opened ? "rotate(90deg)" : "rotate(0deg)",
                            position: "relative",
                        }}
                    >
                        {opened ? <IconX size={32} /> : <IconMessageCircle size={32} />}

                        {!opened && isHealthy && (
                            <Badge
                                size="xs"
                                color="green"
                                variant="filled"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    width: 14,
                                    height: 14,
                                    padding: 0,
                                    border: "2px solid var(--mantine-color-body)",
                                }}
                            />
                        )}
                    </ActionIcon>
                </Box>
            </Affix>
        </>
    );
}
