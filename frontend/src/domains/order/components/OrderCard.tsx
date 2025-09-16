import {
    Card,
    Group,
    Text,
    Stack,
    Badge,
    Button,
    Grid,
    Menu,
    ActionIcon,
    Tooltip,
} from "@mantine/core";
import {
    IconEye,
    IconDownload,
    IconRefresh,
    IconX,
    IconDots,
    IconTruck,
} from "@tabler/icons-react";
import { OrderSummary, OrderStatus } from "../types";

interface OrderCardProps {
    order: OrderSummary; // Changed from Order to OrderSummary
    onCancel?: (orderId: string, reason?: string) => void;
    onReorder?: (orderId: string) => void;
    onDownloadInvoice?: (orderId: string) => void;
    isLoading?: boolean;
}

export function OrderCard({
    order,
    onCancel,
    onReorder,
    onDownloadInvoice,
    isLoading = false,
}: OrderCardProps) {
    const statusColor = getStatusColor(order.status);

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

    const canCancel = (status: OrderStatus): boolean => {
        return ["PENDING", "CONFIRMED"].includes(status);
    };

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
                {/* Header */}
                <Group justify="space-between" align="flex-start">
                    <Stack gap="xs">
                        <Group gap="sm">
                            <Text size="lg" fw={600}>
                                Order #{order.id.slice(-8).toUpperCase()}
                            </Text>
                            <Badge color={statusColor} variant="light">
                                {order.status}
                            </Badge>
                        </Group>
                        <Text size="sm" c="dimmed">
                            {formatDate(order.createdAt)}
                        </Text>
                    </Stack>

                    <Menu shadow="md" width={200}>
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
                                leftSection={<IconEye size={14} />}
                                component="a"
                                href={`/orders/${order.id}`}
                            >
                                View Details
                            </Menu.Item>

                            {order.trackingNumber && (
                                <Menu.Item
                                    leftSection={<IconTruck size={14} />}
                                    onClick={() => {
                                        // Handle tracking
                                        console.log(
                                            "Track order:",
                                            order.trackingNumber
                                        );
                                    }}
                                >
                                    Track Package
                                </Menu.Item>
                            )}

                            {onDownloadInvoice && (
                                <Menu.Item
                                    leftSection={<IconDownload size={14} />}
                                    onClick={() => onDownloadInvoice(order.id)}
                                >
                                    Download Invoice
                                </Menu.Item>
                            )}

                            {onReorder && (
                                <>
                                    <Menu.Divider />
                                    <Menu.Item
                                        leftSection={<IconRefresh size={14} />}
                                        onClick={() => onReorder(order.id)}
                                    >
                                        Order Again
                                    </Menu.Item>
                                </>
                            )}

                            {canCancel(order.status) && onCancel && (
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

                {/* Order Summary */}
                <Grid>
                    <Grid.Col span={6}>
                        <Stack gap={4}>
                            <Text size="sm" c="dimmed">
                                Items
                            </Text>
                            <Text size="sm" fw={500}>
                                {order.itemCount} item
                                {order.itemCount !== 1 ? "s" : ""}
                            </Text>
                            {order.trackingNumber && (
                                <>
                                    <Text size="sm" c="dimmed" mt="xs">
                                        Tracking
                                    </Text>
                                    <Text
                                        size="xs"
                                        style={{ fontFamily: "monospace" }}
                                    >
                                        {order.trackingNumber}
                                    </Text>
                                </>
                            )}
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
                            <Text size="xs" c="dimmed">
                                {order.paymentStatus}
                            </Text>
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

                    {onReorder && (
                        <Button
                            variant="light"
                            size="sm"
                            leftSection={<IconRefresh size={16} />}
                            onClick={() => onReorder(order.id)}
                        >
                            Reorder
                        </Button>
                    )}
                </Group>
            </Stack>
        </Card>
    );
}

function getStatusColor(status: OrderStatus): string {
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
}
