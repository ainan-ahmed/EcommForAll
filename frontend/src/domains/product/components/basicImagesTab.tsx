import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
    Stack,
    Group,
    FileButton,
    Button,
    Card,
    Badge,
    ActionIcon,
    TextInput,
    Paper,
    Text,
    Image,
    LoadingOverlay,
} from "@mantine/core";
import { IconUpload, IconTrash, IconPhoto } from "@tabler/icons-react";
import { ProductImage } from "../types";
import { useState } from "react";

interface ImagesTabProps {
    productImages: ProductImage[];
    onUpload: (files: File[]) => void;
    onDelete: (imageId: string) => void;
    onDragEnd: (result: any) => void;
    onUpdateAltText: (imageId: string, text: string) => void;
    isUploading?: boolean;
}

export function BasicImagesTab({
    productImages,
    onUpload,
    onDelete,
    onDragEnd,
    onUpdateAltText,
    isUploading = false,
}: ImagesTabProps) {
    const [deletingImageIds, setDeletingImageIds] = useState<Set<string>>(
        new Set()
    );

    const handleDelete = async (imageId: string) => {
        setDeletingImageIds((prev) => new Set(prev).add(imageId));
        await onDelete(imageId);
        setDeletingImageIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(imageId);
            return newSet;
        });
    };

    return (
        <Stack gap="xl" pos="relative">
            <LoadingOverlay visible={isUploading} />

            <Group justify="space-between">
                <Text size="lg" fw={500}>
                    Product Images
                </Text>
                <FileButton
                    onChange={onUpload}
                    accept="image/*"
                    multiple
                    disabled={isUploading}
                >
                    {(props) => (
                        <Button
                            leftSection={<IconUpload size={18} />}
                            {...props}
                            loading={isUploading}
                        >
                            Upload Images
                        </Button>
                    )}
                </FileButton>
            </Group>

            <Text c="dimmed" size="sm">
                Drag and drop to reorder images. The first image will be the
                main product image.
            </Text>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="product-images" direction="horizontal">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "1rem",
                            }}
                        >
                            {productImages.map((image, index) => (
                                <Draggable
                                    key={image.id}
                                    draggableId={image.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Card
                                                withBorder
                                                p="xs"
                                                style={{
                                                    width: "150px",
                                                    opacity:
                                                        deletingImageIds.has(
                                                            image.id
                                                        )
                                                            ? 0.5
                                                            : 1,
                                                }}
                                                pos="relative"
                                            >
                                                <LoadingOverlay
                                                    visible={deletingImageIds.has(
                                                        image.id
                                                    )}
                                                />
                                                <Card.Section>
                                                    <Image
                                                        src={image.imageUrl}
                                                        height={120}
                                                        alt={image.altText}
                                                    />
                                                </Card.Section>
                                                <Group
                                                    justify="space-between"
                                                    mt="xs"
                                                >
                                                    <Badge size="sm">
                                                        {index + 1}
                                                    </Badge>
                                                    <ActionIcon
                                                        color="red"
                                                        variant="subtle"
                                                        onClick={() =>
                                                            handleDelete(
                                                                image.id
                                                            )
                                                        }
                                                        disabled={deletingImageIds.has(
                                                            image.id
                                                        )}
                                                    >
                                                        <IconTrash size={16} />
                                                    </ActionIcon>
                                                </Group>
                                                <TextInput
                                                    size="xs"
                                                    mt="xs"
                                                    placeholder="Alt text"
                                                    value={image.altText || ""}
                                                    onChange={(e) => {
                                                        onUpdateAltText(
                                                            image.id,
                                                            e.target.value
                                                        );
                                                    }}
                                                    disabled={deletingImageIds.has(
                                                        image.id
                                                    )}
                                                />
                                            </Card>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {productImages.length === 0 && (
                <Paper
                    withBorder
                    p="xl"
                    style={{
                        textAlign: "center",
                        backgroundColor: "#f9f9f9",
                    }}
                >
                    <IconPhoto size={48} stroke={1.5} color="#adb5bd" />
                    <Text c="dimmed" mt="md">
                        No product images yet
                    </Text>
                    <FileButton
                        onChange={onUpload}
                        accept="image/*"
                        multiple
                        disabled={isUploading}
                    >
                        {(props) => (
                            <Button
                                variant="outline"
                                leftSection={<IconUpload size={18} />}
                                mt="md"
                                {...props}
                                loading={isUploading}
                            >
                                Upload Images
                            </Button>
                        )}
                    </FileButton>
                </Paper>
            )}
        </Stack>
    );
}
