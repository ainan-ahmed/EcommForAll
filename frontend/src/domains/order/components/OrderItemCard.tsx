import {
    Card,
    Group,
    Image,
    Text,
    Stack,
    Badge,
    Button,
    ActionIcon,
    Menu,
    Tooltip,
} from "@mantine/core";
import {
    IconStar,
    IconDots,
    IconShoppingCart,
    IconExternalLink,
} from "@tabler/icons-react";
import { OrderItem } from "../types";

interface OrderItemCardProps {
    item: OrderItem;
    canReview?: boolean;
    canReorder?: boolean;
    onReview?: (productId: string) => void;
    onReorderItem?: (item: OrderItem) => void;
    onViewProduct?: (productId: string) => void;
    isLoading?: boolean;
}

export function OrderItemCard({
    item,
    canReview = false,
    canReorder = true,
    onReview,
    onReorderItem,
    onViewProduct,
    isLoading = false,
}: OrderItemCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const handleViewProduct = () => {
        if (onViewProduct) {
            onViewProduct(item.productId);
        } else {
            // Navigate to product page
            window.open(`/products/${item.productId}`, "_blank");
        }
    };

    const handleReview = () => {
        if (onReview) {
            onReview(item.productId);
        }
    };

    const handleReorderItem = () => {
        if (onReorderItem) {
            onReorderItem(item);
        }
    };

    return (
        <Card padding="md" withBorder>
            <Group gap="md" align="flex-start" wrap="nowrap">
                {/* Product Image */}
                <Image
                    src={item.imageUrl || item.productImage?.imageUrl}
                    alt={item.productName}
                    w={80}
                    h={80}
                    radius="md"
                    fallbackSrc="https://via.placeholder.com/80"
                />

                {/* Product Details */}
                <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
                    <Group justify="space-between" align="flex-start">
                        <Stack gap={2} style={{ flex: 1 }}>
                            <Text
                                fw={500}
                                size="sm"
                                lineClamp={2}
                                style={{ cursor: "pointer" }}
                                onClick={handleViewProduct}
                                c="blue"
                            >
                                {item.productName}
                            </Text>

                            {item.productDescription && (
                                <Text size="xs" c="dimmed" lineClamp={2}>
                                    {item.productDescription}
                                </Text>
                            )}

                            {/* Variant Attributes */}
                            {item.variantAttributes &&
                                Object.keys(item.variantAttributes).length >
                                    0 && (
                                    <Group gap="xs">
                                        {Object.entries(
                                            item.variantAttributes
                                        ).map(([key, value]) => (
                                            <Badge
                                                key={key}
                                                variant="light"
                                                size="xs"
                                                color="gray"
                                            >
                                                {key}: {value}
                                            </Badge>
                                        ))}
                                    </Group>
                                )}

                            {/* SKU */}
                            <Text size="xs" c="dimmed">
                                SKU: {item.sku}
                            </Text>
                        </Stack>

                        {/* Actions Menu */}
                        <Menu shadow="md" width={180}>
                            <Menu.Target>
                                <ActionIcon
                                    variant="subtle"
                                    color="gray"
                                    loading={isLoading}
                                >
                                    <IconDots size={16} />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item
                                    leftSection={<IconExternalLink size={14} />}
                                    onClick={handleViewProduct}
                                >
                                    View Product
                                </Menu.Item>

                                {canReorder && (
                                    <Menu.Item
                                        leftSection={
                                            <IconShoppingCart size={14} />
                                        }
                                        onClick={handleReorderItem}
                                    >
                                        Add to Cart
                                    </Menu.Item>
                                )}

                                {canReview && (
                                    <>
                                        <Menu.Divider />
                                        <Menu.Item
                                            leftSection={<IconStar size={14} />}
                                            onClick={handleReview}
                                        >
                                            Write Review
                                        </Menu.Item>
                                    </>
                                )}
                            </Menu.Dropdown>
                        </Menu>
                    </Group>

                    {/* Quantity and Price */}
                    <Group justify="space-between" align="center">
                        <Group gap="xs">
                            <Text size="sm" c="dimmed">
                                Qty: {item.quantity}
                            </Text>
                            <Text size="sm" c="dimmed">
                                × {formatCurrency(item.unitPrice)}
                            </Text>
                        </Group>

                        <Text size="lg" fw={600}>
                            {formatCurrency(item.totalPrice)}
                        </Text>
                    </Group>
                </Stack>
            </Group>

            {/* Quick Actions Row */}
            <Group justify="flex-end" gap="xs" mt="sm">
                <Tooltip label="View product details">
                    <Button
                        variant="subtle"
                        size="xs"
                        leftSection={<IconExternalLink size={14} />}
                        onClick={handleViewProduct}
                    >
                        View
                    </Button>
                </Tooltip>

                {canReorder && (
                    <Tooltip label="Add this item to cart">
                        <Button
                            variant="light"
                            size="xs"
                            leftSection={<IconShoppingCart size={14} />}
                            onClick={handleReorderItem}
                        >
                            Reorder
                        </Button>
                    </Tooltip>
                )}

                {canReview && (
                    <Tooltip label="Write a review for this product">
                        <Button
                            variant="light"
                            color="yellow"
                            size="xs"
                            leftSection={<IconStar size={14} />}
                            onClick={handleReview}
                        >
                            Review
                        </Button>
                    </Tooltip>
                )}
            </Group>
        </Card>
    );
}
