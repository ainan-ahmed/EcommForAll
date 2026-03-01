import {
    Paper,
    Stack,
    Group,
    Text,
    Divider,
    Badge,
    Button,
    Grid,
    CopyButton,
    ActionIcon,
    Tooltip,
} from "@mantine/core";
import { IconCopy, IconCheck, IconDownload, IconTruck } from "@tabler/icons-react";
import { Order } from "../types";

interface OrderSummaryProps {
    order: Order;
    onDownloadInvoice?: () => void;
    onTrackOrder?: () => void;
    isLoading?: boolean;
    showActions?: boolean;
}

export function OrderSummary({
    order,
    onDownloadInvoice,
    onTrackOrder,
    isLoading = false,
    showActions = true,
}: OrderSummaryProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: order.currency || "USD",
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status: string) => {
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

    return (
        <Paper p="lg" withBorder>
            <Stack gap="lg">
                {/* Header */}
                <Group justify="space-between" align="flex-start">
                    <Stack gap="xs">
                        <Group gap="sm" align="center">
                            <Text size="xl" fw={700}>
                                Order #{order.orderNumber}
                            </Text>
                            <CopyButton value={order.orderNumber}>
                                {({ copied, copy }) => (
                                    <Tooltip label={copied ? "Copied!" : "Copy order number"}>
                                        <ActionIcon
                                            color={copied ? "teal" : "gray"}
                                            variant="subtle"
                                            onClick={copy}
                                        >
                                            {copied ? (
                                                <IconCheck size={16} />
                                            ) : (
                                                <IconCopy size={16} />
                                            )}
                                        </ActionIcon>
                                    </Tooltip>
                                )}
                            </CopyButton>
                        </Group>

                        <Group gap="md">
                            <Badge color={getStatusColor(order.status)} variant="light" size="md">
                                {order.status.replace("_", " ")}
                            </Badge>

                            {order.paymentDetails && (
                                <Badge
                                    color={
                                        order.paymentDetails.paymentStatus === "PAID"
                                            ? "green"
                                            : "yellow"
                                    }
                                    variant="outline"
                                    size="sm"
                                >
                                    Payment: {order.paymentDetails.paymentStatus}
                                </Badge>
                            )}
                        </Group>
                    </Stack>

                    {/* Actions */}
                    {showActions && (
                        <Group gap="sm">
                            {onDownloadInvoice && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    leftSection={<IconDownload size={16} />}
                                    onClick={onDownloadInvoice}
                                    loading={isLoading}
                                >
                                    Invoice
                                </Button>
                            )}

                            {onTrackOrder && order.shippingDetails?.trackingNumber && (
                                <Button
                                    variant="filled"
                                    size="sm"
                                    leftSection={<IconTruck size={16} />}
                                    onClick={onTrackOrder}
                                    loading={isLoading}
                                >
                                    Track
                                </Button>
                            )}
                        </Group>
                    )}
                </Group>

                <Divider />

                {/* Order Details */}
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Stack gap="sm">
                            <Text fw={600} c="dimmed" size="sm">
                                ORDER INFORMATION
                            </Text>

                            <Group justify="space-between">
                                <Text size="sm">Order Date:</Text>
                                <Text size="sm" fw={500}>
                                    {formatDate(order.createdAt)}
                                </Text>
                            </Group>

                            <Group justify="space-between">
                                <Text size="sm">Items:</Text>
                                <Text size="sm" fw={500}>
                                    {order.items.length} item
                                    {order.items.length !== 1 ? "s" : ""}
                                </Text>
                            </Group>

                            {order.paymentDetails && (
                                <Group justify="space-between">
                                    <Text size="sm">Payment Method:</Text>
                                    <Text size="sm" fw={500}>
                                        {order.paymentDetails.paymentMethod.replace("_", " ")}
                                    </Text>
                                </Group>
                            )}

                            {order.shippingDetails?.shippingMethod && (
                                <Group justify="space-between">
                                    <Text size="sm">Shipping Method:</Text>
                                    <Text size="sm" fw={500}>
                                        {order.shippingDetails.shippingMethod}
                                    </Text>
                                </Group>
                            )}
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Stack gap="sm">
                            <Text fw={600} c="dimmed" size="sm">
                                SHIPPING ADDRESS
                            </Text>

                            <Stack gap={2}>
                                <Text size="sm" fw={500}>
                                    {order.shippingAddress.firstName}{" "}
                                    {order.shippingAddress.lastName}
                                </Text>

                                {order.shippingAddress.company && (
                                    <Text size="sm" c="dimmed">
                                        {order.shippingAddress.company}
                                    </Text>
                                )}

                                <Text size="sm">{order.shippingAddress.addressLine1}</Text>

                                {order.shippingAddress.addressLine2 && (
                                    <Text size="sm">{order.shippingAddress.addressLine2}</Text>
                                )}

                                <Text size="sm">
                                    {order.shippingAddress.city}, {/* state removed */}
                                    {order.shippingAddress.postalCode}
                                </Text>

                                <Text size="sm">{order.shippingAddress.country}</Text>

                                {order.shippingAddress.phone && (
                                    <Text size="sm" c="dimmed">
                                        Phone: {order.shippingAddress.phone}
                                    </Text>
                                )}
                            </Stack>
                        </Stack>
                    </Grid.Col>
                </Grid>

                <Divider />

                {/* Order Totals */}
                <Stack gap="xs">
                    <Text fw={600} c="dimmed" size="sm">
                        ORDER SUMMARY
                    </Text>

                    <Group justify="space-between">
                        <Text size="sm">Subtotal:</Text>
                        <Text size="sm">{formatCurrency(order.subtotalAmount)}</Text>
                    </Group>

                    {order.discountAmount && order.discountAmount > 0 && (
                        <Group justify="space-between">
                            <Text size="sm" c="green">
                                Discount:
                            </Text>
                            <Text size="sm" c="green">
                                -{formatCurrency(order.discountAmount)}
                            </Text>
                        </Group>
                    )}

                    <Group justify="space-between">
                        <Text size="sm">Shipping:</Text>
                        <Text size="sm">
                            {order.shippingAmount === 0
                                ? "Free"
                                : formatCurrency(order.shippingAmount)}
                        </Text>
                    </Group>

                    <Group justify="space-between">
                        <Text size="sm">Tax:</Text>
                        <Text size="sm">{formatCurrency(order.taxAmount)}</Text>
                    </Group>

                    <Divider />

                    <Group justify="space-between">
                        <Text size="lg" fw={700}>
                            Total:
                        </Text>
                        <Text size="lg" fw={700}>
                            {formatCurrency(order.totalAmount)}
                        </Text>
                    </Group>
                </Stack>

                {/* Shipping Information */}
                {order.shippingDetails && (
                    <>
                        <Divider />
                        <Stack gap="sm">
                            <Text fw={600} c="dimmed" size="sm">
                                SHIPPING INFORMATION
                            </Text>

                            {order.shippingDetails.trackingNumber && (
                                <Group justify="space-between">
                                    <Text size="sm">Tracking Number:</Text>
                                    <Group gap="xs">
                                        <Text
                                            size="sm"
                                            fw={500}
                                            style={{ fontFamily: "monospace" }}
                                        >
                                            {order.shippingDetails.trackingNumber}
                                        </Text>
                                        <CopyButton value={order.shippingDetails.trackingNumber}>
                                            {({ copied, copy }) => (
                                                <ActionIcon
                                                    size="sm"
                                                    color={copied ? "teal" : "gray"}
                                                    variant="subtle"
                                                    onClick={copy}
                                                >
                                                    {copied ? (
                                                        <IconCheck size={12} />
                                                    ) : (
                                                        <IconCopy size={12} />
                                                    )}
                                                </ActionIcon>
                                            )}
                                        </CopyButton>
                                    </Group>
                                </Group>
                            )}

                            {order.shippingDetails.carrier && (
                                <Group justify="space-between">
                                    <Text size="sm">Carrier:</Text>
                                    <Text size="sm" fw={500}>
                                        {order.shippingDetails.carrier}
                                    </Text>
                                </Group>
                            )}

                            {order.shippingDetails.estimatedDelivery && (
                                <Group justify="space-between">
                                    <Text size="sm">Estimated Delivery:</Text>
                                    <Text size="sm" fw={500}>
                                        {formatDate(order.shippingDetails.estimatedDelivery)}
                                    </Text>
                                </Group>
                            )}
                        </Stack>
                    </>
                )}

                {/* Notes */}
                {order.notes && (
                    <>
                        <Divider />
                        <Stack gap="sm">
                            <Text fw={600} c="dimmed" size="sm">
                                ORDER NOTES
                            </Text>
                            <Paper p="sm" bg="gray.0" radius="sm">
                                <Text size="sm">{order.notes}</Text>
                            </Paper>
                        </Stack>
                    </>
                )}
            </Stack>
        </Paper>
    );
}
