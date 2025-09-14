import {
    Card,
    Group,
    Text,
    Badge,
    Stack,
    Button,
    Divider,
    Grid,
    Image,
    Tooltip,
    ActionIcon,
    Menu,
} from "@mantine/core";
import {
    IconPackage,
    IconTruck,
    IconEye,
    IconDownload,
    IconDots,
    IconX,
    IconRefresh,
} from "@tabler/icons-react";
import { Order, OrderStatus } from "../types";

interface OrderCardProps {
    order: Order;
    onCancel?: (orderId: string) => void;
    onReorder?: (orderId: string) => void;
    onDownloadInvoice?: (orderId: string) => void;
    isLoading?: boolean;
}

const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
        case "PENDING":
            return "yellow";
        case "CONFIRMED":
            return "blue";
        case "PROCESSING":
            return "cyan";
        case "SHIPPED":
            return "indigo";
        case "DELIVERED":
            return "green";
        case "CANCELLED":
            return "red";
        case "REFUNDED":
            return "orange";
        default:
            return "gray";
    }
};

const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
        case "PENDING":
        case "CONFIRMED":
        case "PROCESSING":
            return <IconPackage size={16} />;
        case "SHIPPED":
            return <IconTruck size={16} />;
        case "DELIVERED":
            return <IconPackage size={16} />;
        default:
            return <IconPackage size={16} />;
    }
};

const canCancelOrder = (status: OrderStatus): boolean => {
    return ["PENDING", "CONFIRMED"].includes(status);
};

const canReorder = (status: OrderStatus): boolean => {
    return ["DELIVERED", "CANCELLED", "REFUNDED"].includes(status);
};

export function OrderCard({
    order,
    onCancel,
    onReorder,
    onDownloadInvoice,
    isLoading = false,
}: OrderCardProps) {
    const statusColor = getStatusColor(order.status);
    const statusIcon = getStatusIcon(order.status);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    // Get first few items to display
    const displayItems = order.items.slice(0, 3);
    const remainingItemsCount = order.items.length - displayItems.length;

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
                {/* Header */}
                <Group justify="space-between" align="flex-start">
                    <Stack gap={4}>
                        <Group gap="xs" align="center">
                            <Text fw={600} size="lg">
                                Order #{order.orderNumber}
                            </Text>
                            <Badge
                                color={statusColor}
                                variant="light"
                                leftSection={statusIcon}
                            >
                                {order.status.replace("_", " ")}
                            </Badge>
                        </Group>
                        <Text size="sm" c="dimmed">
                            Placed on {formatDate(order.createdAt)}
                        </Text>
                    </Stack>

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
                                component="a"
                                href={`/orders/${order.id}`}
                                leftSection={<IconEye size={14} />}
                            >
                                View Details
                            </Menu.Item>

                            {onDownloadInvoice && (
                                <Menu.Item
                                    leftSection={<IconDownload size={14} />}
                                    onClick={() => onDownloadInvoice(order.id)}
                                >
                                    Download Invoice
                                </Menu.Item>
                            )}

                            {canReorder(order.status) && onReorder && (
                                <Menu.Item
                                    leftSection={<IconRefresh size={14} />}
                                    onClick={() => onReorder(order.id)}
                                >
                                    Reorder
                                </Menu.Item>
                            )}

                            {canCancelOrder(order.status) && onCancel && (
                                <>
                                    <Menu.Divider />
                                    <Menu.Item
                                        color="red"
                                        leftSection={<IconX size={14} />}
                                        onClick={() => onCancel(order.id)}
                                    >
                                        Cancel Order
                                    </Menu.Item>
                                </>
                            )}
                        </Menu.Dropdown>
                    </Menu>
                </Group>

                {/* Order Items Preview */}
                <Stack gap="xs">
                    <Text size="sm" fw={500} c="dimmed">
                        Items ({order.items.length})
                    </Text>

                    {displayItems.map((item) => (
                        <Group key={item.id} gap="sm" wrap="nowrap">
                            <Image
                                src={item.imageUrl}
                                alt={item.productName}
                                w={40}
                                h={40}
                                radius="sm"
                                fallbackSrc="https://via.placeholder.com/40"
                            />
                            <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                                <Text size="sm" lineClamp={1}>
                                    {item.productName}
                                </Text>
                                {item.variantAttributes &&
                                    Object.keys(item.variantAttributes).length >
                                        0 && (
                                        <Text size="xs" c="dimmed">
                                            {Object.entries(
                                                item.variantAttributes
                                            )
                                                .map(
                                                    ([key, value]) =>
                                                        `${key}: ${value}`
                                                )
                                                .join(", ")}
                                        </Text>
                                    )}
                            </Stack>
                            <Text size="sm" c="dimmed">
                                Qty: {item.quantity}
                            </Text>
                            <Text size="sm" fw={500}>
                                {formatCurrency(item.totalPrice)}
                            </Text>
                        </Group>
                    ))}

                    {remainingItemsCount > 0 && (
                        <Text size="xs" c="dimmed" ta="center">
                            +{remainingItemsCount} more item
                            {remainingItemsCount > 1 ? "s" : ""}
                        </Text>
                    )}
                </Stack>

                <Divider />

                {/* Order Summary */}
                <Grid>
                    <Grid.Col span={6}>
                        <Stack gap={4}>
                            <Text size="sm" c="dimmed">
                                Delivery Address
                            </Text>
                            <Text size="sm">
                                {order.shippingAddress.firstName}{" "}
                                {order.shippingAddress.lastName}
                            </Text>
                            <Text size="xs" c="dimmed" lineClamp={2}>
                                {order.shippingAddress.addressLine1}
                                {order.shippingAddress.addressLine2 &&
                                    `, ${order.shippingAddress.addressLine2}`}
                                <br />
                                {order.shippingAddress.city},{" "}
                                {/* state removed */}
                                {order.shippingAddress.postalCode}
                            </Text>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <Stack gap={4} align="flex-end">
                            <Text size="sm" c="dimmed">
                                Total Amount
                            </Text>
                            <Text size="xl" fw={700}>
                                {formatCurrency(order.totalAmount)}
                            </Text>
                            {order.shippingDetails?.estimatedDelivery && (
                                <Tooltip label="Estimated delivery date">
                                    <Text size="xs" c="dimmed">
                                        Est. delivery:{" "}
                                        {formatDate(
                                            order.shippingDetails
                                                .estimatedDelivery
                                        )}
                                    </Text>
                                </Tooltip>
                            )}
                        </Stack>
                    </Grid.Col>
                </Grid>

                {/* Action Buttons */}
                <Group justify="flex-end" gap="sm">
                    <Button
                        component="a"
                        href={`/orders/${order.id}`}
                        variant="outline"
                        size="sm"
                        leftSection={<IconEye size={16} />}
                    >
                        View Details
                    </Button>

                    {order.shippingDetails?.trackingNumber && (
                        <Button
                            component="a"
                            href={`/orders/${order.id}/track`}
                            variant="filled"
                            size="sm"
                            leftSection={<IconTruck size={16} />}
                        >
                            Track Order
                        </Button>
                    )}
                </Group>
            </Stack>
        </Card>
    );
}
