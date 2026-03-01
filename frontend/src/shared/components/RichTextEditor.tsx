import React, { useEffect } from "react";
import { RichTextEditor as MantineRTE } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Box, Text } from "@mantine/core";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    description?: string;
    error?: React.ReactNode;
    required?: boolean;
    minHeight?: number | string;
    placeholder?: string;
    disabled?: boolean;
}

export function RichTextEditor({
    value,
    onChange,
    label,
    description,
    error,
    required,
    minHeight = 200,
    placeholder = "Write something...",
    disabled = false,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            Highlight,
        ],
        content: value,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            onChange(editor.isEmpty ? "" : editor.getHTML());
        },
    });

    // Update content when external value changes
    useEffect(() => {
        if (editor && editor.getHTML() !== value) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    return (
        <Box>
            {label && (
                <Text size="sm" fw={500} mb={2}>
                    {label}{" "}
                    {required && <span style={{ color: "var(--mantine-color-red-6)" }}>*</span>}
                </Text>
            )}

            {description && (
                <Text size="xs" c="dimmed" mb={5}>
                    {description}
                </Text>
            )}

            <MantineRTE editor={editor}>
                <MantineRTE.Toolbar sticky stickyOffset={60}>
                    <MantineRTE.ControlsGroup>
                        <MantineRTE.Bold />
                        <MantineRTE.Italic />
                        <MantineRTE.Underline />
                        <MantineRTE.Strikethrough />
                        <MantineRTE.Highlight />
                        <MantineRTE.Code />
                    </MantineRTE.ControlsGroup>

                    <MantineRTE.ControlsGroup>
                        <MantineRTE.H1 />
                        <MantineRTE.H2 />
                        <MantineRTE.H3 />
                        <MantineRTE.H4 />
                    </MantineRTE.ControlsGroup>

                    <MantineRTE.ControlsGroup>
                        <MantineRTE.BulletList />
                        <MantineRTE.OrderedList />
                    </MantineRTE.ControlsGroup>

                    <MantineRTE.ControlsGroup>
                        <MantineRTE.Link />
                        <MantineRTE.Unlink />
                    </MantineRTE.ControlsGroup>
                </MantineRTE.Toolbar>

                <MantineRTE.Content
                    style={{
                        minHeight: minHeight,
                    }}
                />
            </MantineRTE>

            {error && (
                <Text size="xs" c="red" mt={5}>
                    {error}
                </Text>
            )}
        </Box>
    );
}
