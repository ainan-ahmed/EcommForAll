import {
    Stack,
    Button,
    Text,
    Paper,
    Accordion,
    Grid,
    TextInput,
    NumberInput,
    Group,
    Divider,
    Badge,
    ActionIcon,
    SimpleGrid,
    Image,
    Box,
} from "@mantine/core";
import {
    IconPlus,
    IconTrash,
    IconCopy,
    IconKey,
    IconPhoto,
} from "@tabler/icons-react";
import { ProductVariant } from "../types";

interface VariantsTabProps {
    variants: ProductVariant[];
    onAdd: () => void;
    onDelete: (variantId: string) => void;
    onDuplicate: (variant: ProductVariant) => void;
    onUpdateField: (
        variantId: string,
        field: keyof ProductVariant,
        value: any
    ) => void;
    onUpdateAttribute: (variantId: string, key: string, value: string) => void;
    onAddAttribute: (variantId: string, key: string) => void;
    onRemoveAttribute: (variantId: string, key: string) => void;
    onOpenImageModal: (variantId: string, variantName: string) => void;
    onDeleteImage: (variantId: string, imageId: string) => void;
}

export function VariantsTab({
    variants,
    onAdd,
    onDelete,
    onDuplicate,
    onUpdateField,
    onUpdateAttribute,
    onAddAttribute,
    onRemoveAttribute,
    onOpenImageModal,
    onDeleteImage,
}: VariantsTabProps) {
    return (
        <Stack gap="xl">
            <Group justify="space-between">
                <Text size="lg" fw={500}>
                    Product Variants
                </Text>
                <Button leftSection={<IconPlus size={18} />} onClick={onAdd}>
                    Add Variant
                </Button>
            </Group>

            {variants.length === 0 ? (
                <Paper
                    withBorder
                    p="xl"
                    style={{
                        textAlign: "center",
                        backgroundColor: "#f9f9f9",
                    }}
                >
                    <Text c="dimmed" mb="md">
                        This product has no variants yet
                    </Text>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        onClick={onAdd}
                    >
                        Add First Variant
                    </Button>
                </Paper>
            ) : (
                <Accordion multiple>
                    {variants.map((variant, variantIndex) => (
                        <Accordion.Item key={variant.id} value={variant.id}>
                            <Accordion.Control>
                                <Group justify="space-between">
                                    <div>
                                        <Text fw={500}>
                                            {Object.entries(
                                                variant.attributeValues
                                            )
                                                .map(
                                                    ([key, value]) =>
                                                        `${key}: ${value}`
                                                )
                                                .join(", ") ||
                                                `Variant ${variantIndex + 1}`}
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            SKU: {variant.sku}
                                        </Text>
                                    </div>
                                    <Badge>${variant.price.toFixed(2)}</Badge>
                                </Group>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Grid>
                                    {/* Basic Information */}
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label="SKU"
                                            value={variant.sku}
                                            onChange={(e) =>
                                                onUpdateField(
                                                    variant.id,
                                                    "sku",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <NumberInput
                                            label="Price"
                                            value={variant.price}
                                            onChange={(val) =>
                                                onUpdateField(
                                                    variant.id,
                                                    "price",
                                                    val
                                                )
                                            }
                                            decimalScale={2}
                                            fixedDecimalScale
                                            allowNegative={false}
                                            min={0}
                                            required
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <NumberInput
                                            label="Stock"
                                            value={variant.stock}
                                            onChange={(val) =>
                                                onUpdateField(
                                                    variant.id,
                                                    "stock",
                                                    val
                                                )
                                            }
                                            allowNegative={false}
                                            min={0}
                                            required
                                        />
                                    </Grid.Col>

                                    {/* Attributes */}
                                    <Grid.Col span={12}>
                                        <Divider
                                            label="Attributes"
                                            labelPosition="center"
                                            my="md"
                                        />

                                        {Object.entries(
                                            variant.attributeValues
                                        ).map(([key, value]) => (
                                            <Group
                                                key={key}
                                                mb="sm"
                                                align="flex-end"
                                            >
                                                <TextInput
                                                    label="Attribute Name"
                                                    value={key}
                                                    readOnly
                                                    style={{ flex: 1 }}
                                                />
                                                <TextInput
                                                    label="Value"
                                                    value={value}
                                                    onChange={(e) =>
                                                        onUpdateAttribute(
                                                            variant.id,
                                                            key,
                                                            e.target.value
                                                        )
                                                    }
                                                    style={{ flex: 2 }}
                                                />
                                                <ActionIcon
                                                    color="red"
                                                    onClick={() =>
                                                        onRemoveAttribute(
                                                            variant.id,
                                                            key
                                                        )
                                                    }
                                                >
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Group>
                                        ))}

                                        <Group mt="md">
                                            <TextInput
                                                placeholder="New attribute name"
                                                id={`new-attr-${variant.id}`}
                                                style={{ maxWidth: "200px" }}
                                            />
                                            <Button
                                                variant="light"
                                                leftSection={
                                                    <IconKey size={16} />
                                                }
                                                onClick={() => {
                                                    const input =
                                                        document.getElementById(
                                                            `new-attr-${variant.id}`
                                                        ) as HTMLInputElement;
                                                    if (input && input.value) {
                                                        onAddAttribute(
                                                            variant.id,
                                                            input.value
                                                        );
                                                        input.value = "";
                                                    }
                                                }}
                                                size="sm"
                                            >
                                                Add Attribute
                                            </Button>
                                        </Group>
                                    </Grid.Col>

                                    {/* Variant Images */}
                                    <Grid.Col span={12}>
                                        <Divider
                                            label="Variant Images"
                                            labelPosition="center"
                                            my="md"
                                        />

                                        {variant.images &&
                                        variant.images.length > 0 ? (
                                            <SimpleGrid
                                                cols={{ base: 2, sm: 3, md: 4 }}
                                                spacing="xs"
                                            >
                                                {variant.images.map((image) => (
                                                    <Box
                                                        key={image.id}
                                                        pos="relative"
                                                    >
                                                        <Image
                                                            src={image.imageUrl}
                                                            height={100}
                                                            alt={
                                                                image.altText ||
                                                                "Variant image"
                                                            }
                                                        />
                                                        <ActionIcon
                                                            color="red"
                                                            variant="filled"
                                                            radius="xl"
                                                            size="sm"
                                                            style={{
                                                                position:
                                                                    "absolute",
                                                                top: 5,
                                                                right: 5,
                                                            }}
                                                            onClick={() =>
                                                                onDeleteImage(
                                                                    variant.id,
                                                                    image.id
                                                                )
                                                            }
                                                        >
                                                            <IconTrash
                                                                size={12}
                                                            />
                                                        </ActionIcon>
                                                    </Box>
                                                ))}
                                            </SimpleGrid>
                                        ) : (
                                            <Text
                                                c="dimmed"
                                                ta="center"
                                                size="sm"
                                                mb="md"
                                            >
                                                No variant-specific images
                                            </Text>
                                        )}

                                        <Button
                                            leftSection={
                                                <IconPhoto size={16} />
                                            }
                                            mt="md"
                                            variant="light"
                                            onClick={() =>
                                                onOpenImageModal(
                                                    variant.id,
                                                    Object.entries(
                                                        variant.attributeValues
                                                    )
                                                        .map(
                                                            ([key, value]) =>
                                                                `${key}: ${value}`
                                                        )
                                                        .join(", ") ||
                                                        `Variant ${variantIndex + 1}`
                                                )
                                            }
                                        >
                                            Manage Images
                                        </Button>
                                    </Grid.Col>

                                    {/* Actions */}
                                    <Grid.Col span={12}>
                                        <Divider my="md" />
                                        <Group justify="flex-end">
                                            <Button
                                                color="red"
                                                variant="outline"
                                                leftSection={
                                                    <IconTrash size={18} />
                                                }
                                                onClick={() =>
                                                    onDelete(variant.id)
                                                }
                                            >
                                                Delete Variant
                                            </Button>
                                            <Button
                                                variant="outline"
                                                leftSection={
                                                    <IconCopy size={18} />
                                                }
                                                onClick={() =>
                                                    onDuplicate(variant)
                                                }
                                            >
                                                Duplicate Variant
                                            </Button>
                                        </Group>
                                    </Grid.Col>
                                </Grid>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))}
                </Accordion>
            )}
        </Stack>
    );
}
