// src/domains/cart/components/CartItemCard.tsx
import {
    Card,
    Grid,
    Image,
    Text,
    Group,
    NumberInput,
    Stack,
    ActionIcon,
    Badge,
} from "@mantine/core";
import { IconTrash, IconMinus, IconPlus } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { CartItem } from "../types";

interface CartItemCardProps {
    item: CartItem;
    onQuantityChange: (itemId: string, newQuantity: number) => void;
    onRemove: (itemId: string) => void;
    isUpdating?: boolean;
    isRemoving?: boolean;
}

export function CartItemCard({
    item,
    onQuantityChange,
    onRemove,
    isUpdating = false,
    isRemoving = false,
}: CartItemCardProps) {
    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1) {
            onQuantityChange(item.id, newQuantity);
        }
    };
    // console.log("CartItemCard", item);
    const handleRemove = () => {
        onRemove(item.id);
    };

    return (
        <Card withBorder mb="md">
            <Grid align="center">
                <Grid.Col span={{ base: 12, sm: 3 }}>
                    <Image
                        src={
                            item.imageUrl?.imageUrl ||
                            "https://via.placeholder.com/120x120?text=No+Image"
                        }
                        height={120}
                        fit="cover"
                        radius="sm"
                        alt={item.productName}
                        fallbackSrc="https://via.placeholder.com/120x120?text=No+Image"
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Stack gap="xs">
                        <Text
                            fw={500}
                            size="lg"
                            component={Link}
                            to={`/products/${item.productId}`}
                            style={{ textDecoration: "none" }}
                            c="blue"
                        >
                            {item.productName}
                        </Text>

                        {/* Variant Attributes */}
                        <Stack gap="xs">
                            {item.variantId &&
                                item.variantAttributes &&
                                Object.keys(item.variantAttributes).length > 0 && (
                                    <Group gap="xs" wrap="wrap">
                                        {Object.entries(item.variantAttributes).map(
                                            ([attributeName, attributeValue]) => (
                                                <Badge
                                                    key={attributeName}
                                                    variant="light"
                                                    color="blue"
                                                    size="sm"
                                                >
                                                    {attributeName}: {attributeValue}
                                                </Badge>
                                            )
                                        )}
                                    </Group>
                                )}
                            {item.sku && (
                                <Group gap="xs">
                                    <Text size="sm" c="dimmed">
                                        SKU:
                                    </Text>
                                    <Badge variant="filled" size="sm" color="purple">
                                        {item.sku}
                                    </Badge>
                                </Group>
                            )}
                        </Stack>

                        {item.description && (
                            <Text size="sm" c="dimmed" lineClamp={2}>
                                {item.description}
                            </Text>
                        )}

                        <Group gap="xs">
                            <Text fw={700} size="lg" c="blue">
                                ${item.unitPrice.toFixed(2)}
                            </Text>
                            {item.quantity > 1 && (
                                <Text size="sm" c="dimmed">
                                    each
                                </Text>
                            )}
                        </Group>

                        {!item.inStock && (
                            <Badge color="red" variant="filled" size="sm">
                                Out of Stock
                            </Badge>
                        )}
                    </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 3 }}>
                    <Stack gap="md" align="center">
                        {/* Quantity Controls */}
                        <Group gap="xs">
                            <ActionIcon
                                variant="outline"
                                onClick={() => handleQuantityChange(item.quantity - 1)}
                                disabled={item.quantity <= 1 || isUpdating || !item.inStock}
                                loading={isUpdating}
                            >
                                <IconMinus size={16} />
                            </ActionIcon>

                            <NumberInput
                                value={item.quantity}
                                onChange={(value) => handleQuantityChange(Number(value))}
                                min={1}
                                max={item.inStock ? 99 : item.quantity}
                                w={80}
                                disabled={isUpdating || !item.inStock}
                                styles={{
                                    input: {
                                        textAlign: "center",
                                    },
                                }}
                            />

                            <ActionIcon
                                variant="outline"
                                onClick={() => handleQuantityChange(item.quantity + 1)}
                                disabled={!item.inStock || isUpdating || item.quantity >= 99}
                                loading={isUpdating}
                            >
                                <IconPlus size={16} />
                            </ActionIcon>
                        </Group>

                        {/* Item Total */}
                        <Stack gap={4} align="center">
                            <Text size="sm" c="dimmed">
                                Item Total
                            </Text>
                            <Text fw={700} size="lg">
                                ${item.totalPrice.toFixed(2)}
                            </Text>
                        </Stack>

                        {/* Remove Button */}
                        <ActionIcon
                            color="red"
                            variant="outline"
                            onClick={handleRemove}
                            loading={isRemoving}
                            disabled={isUpdating}
                            size="lg"
                        >
                            <IconTrash size={18} />
                        </ActionIcon>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Card>
    );
}
