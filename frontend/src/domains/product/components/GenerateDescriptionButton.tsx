// src/domains/product/components/GenerateDescriptionButton.tsx
import { useState } from "react";
import {
    Button,
    Modal,
    TextInput,
    Textarea,
    Select,
    NumberInput,
    Group,
    Stack,
    Text,
    LoadingOverlay,
    Alert,
} from "@mantine/core";
import { IconBrain, IconRobot, IconWand } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useProductDescriptionGenAI } from "../../AI/hooks/useProductDescriptionGenAI";
import { ProductDescriptionRequest } from "../../AI/types";

interface GenerateDescriptionButtonProps {
    productName: string;
    existingDescription: string;
    category?: string;
    brand?: string;
    productId?: string;
    onDescriptionGenerated: (description: string) => void;
}

export function GenerateDescriptionButton({
    productName,
    existingDescription,
    category,
    brand,
    productId,
    onDescriptionGenerated,
}: GenerateDescriptionButtonProps) {
    const [opened, setOpened] = useState(false);
    const [tone, setTone] = useState<string>("professional");
    const [maxLength, setMaxLength] = useState<number>(150);
    const [targetAudience, setTargetAudience] = useState<string>("");

    const { mutate, isPending, error } = useProductDescriptionGenAI({
        onSuccess: (data) => {
            if (data.generatedDescription) {
                // Apply the description directly
                onDescriptionGenerated(data.generatedDescription);

                // Close the modal
                setOpened(false);

                // Show success notification
                notifications.show({
                    title: "Description Generated",
                    message: "AI has created a description for your product",
                    color: "green",
                });
            } else {
                notifications.show({
                    title: "Generation Failed",
                    message: "Could not generate description",
                    color: "red",
                });
            }
        },
        onError: (err) => {
            notifications.show({
                title: "Generation Failed",
                message: err.message,
                color: "red",
            });
        },
    });

    const handleGenerate = () => {
        // Validate product name before generating description
        if (!productName || productName.trim() === "") {
            notifications.show({
                title: "Missing Information",
                message:
                    "Please enter a product name before generating a description",
                color: "yellow",
            });
            return;
        }

        const request: ProductDescriptionRequest = {
            productName: productName.trim(),
            existingDescription: existingDescription || "",
            tone: tone as "professional" | "casual" | "technical" | "marketing",
            maxLength: maxLength,
            targetAudience: targetAudience || undefined,
            category,
            brand,
        };

        mutate({ request, productId });
    };

    // Disable button if product name is empty
    const isProductNameEmpty = !productName || productName.trim() === "";

    return (
        <>
            <Button
                variant="light"
                leftSection={<IconWand size={16} />}
                onClick={() => {
                    if (isProductNameEmpty) {
                        notifications.show({
                            title: "Product Name Required",
                            message: "Please enter a product name first",
                            color: "yellow",
                        });
                    } else {
                        setOpened(true);
                    }
                }}
                size="sm"
                title={
                    isProductNameEmpty
                        ? "Enter a product name first"
                        : "Generate AI description"
                }
            >
                Generate with AI
            </Button>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={
                    <Group>
                        <IconRobot size={20} />
                        <Text fw={600}>AI Product Description Generator</Text>
                    </Group>
                }
                size="lg"
            >
                <LoadingOverlay visible={isPending} />

                <Stack>
                    {error && (
                        <Alert color="red" title="Error">
                            {error.message}
                        </Alert>
                    )}

                    <TextInput
                        label="Product Name"
                        value={productName}
                        readOnly
                        error={
                            isProductNameEmpty
                                ? "Product name is required"
                                : null
                        }
                    />

                    <Group grow>
                        <Select
                            label="Tone"
                            value={tone}
                            onChange={(value) =>
                                setTone(value || "professional")
                            }
                            data={[
                                {
                                    value: "professional",
                                    label: "Professional",
                                },
                                { value: "casual", label: "Casual" },
                                { value: "technical", label: "Technical" },
                                { value: "marketing", label: "Marketing" },
                            ]}
                        />

                        <NumberInput
                            label="Maximum Length (words)"
                            value={maxLength}
                            onChange={(value) => setMaxLength(Number(value))}
                            min={50}
                            max={500}
                        />
                    </Group>

                    <TextInput
                        label="Target Audience (optional)"
                        placeholder="e.g., Fitness enthusiasts, Gamers, etc."
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                    />

                    <Textarea
                        label="Current Description"
                        placeholder="Current description or leave blank for a fresh one"
                        value={existingDescription}
                        readOnly
                        minRows={3}
                    />

                    <Group justify="center" mt="md">
                        <Button
                            onClick={handleGenerate}
                            leftSection={<IconBrain size={16} />}
                            loading={isPending}
                            disabled={isProductNameEmpty}
                        >
                            Generate Description
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}
