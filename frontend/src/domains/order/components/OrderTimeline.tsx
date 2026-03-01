import { Timeline, Text, Group, Badge, Stack, Paper, ThemeIcon } from "@mantine/core";
import {
    IconPackage,
    IconCheck,
    IconTruck,
    IconMapPin,
    IconX,
    IconCash,
    IconClock,
} from "@tabler/icons-react";
import { Order, OrderStatus } from "../types";

interface OrderTimelineProps {
    order: Order;
    showEstimatedDates?: boolean;
}

interface TimelineItem {
    status: OrderStatus;
    title: string;
    description: string;
    date?: string;
    isCompleted: boolean;
    isActive: boolean;
    icon: React.ReactNode;
    color: string;
}

const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
        case "PENDING":
            return {
                title: "Order Placed",
                description: "Your order has been received and is being processed",
                icon: <IconClock size={16} />,
                color: "yellow",
            };
        case "CONFIRMED":
            return {
                title: "Order Confirmed",
                description: "Your order has been confirmed and payment verified",
                icon: <IconCheck size={16} />,
                color: "blue",
            };
        case "PROCESSING":
            return {
                title: "Processing",
                description: "Your order is being prepared for shipment",
                icon: <IconPackage size={16} />,
                color: "cyan",
            };
        case "SHIPPED":
            return {
                title: "Shipped",
                description: "Your order has been shipped and is on its way",
                icon: <IconTruck size={16} />,
                color: "indigo",
            };
        case "DELIVERED":
            return {
                title: "Delivered",
                description: "Your order has been successfully delivered",
                icon: <IconMapPin size={16} />,
                color: "green",
            };
        case "CANCELLED":
            return {
                title: "Cancelled",
                description: "Your order has been cancelled",
                icon: <IconX size={16} />,
                color: "red",
            };
        case "REFUNDED":
            return {
                title: "Refunded",
                description: "Your order has been refunded",
                icon: <IconCash size={16} />,
                color: "orange",
            };
        default:
            return {
                title: "Unknown",
                description: "Unknown status",
                icon: <IconClock size={16} />,
                color: "gray",
            };
    }
};

const getStatusOrder = (status: OrderStatus): number => {
    const order = {
        PENDING: 1,
        CONFIRMED: 2,
        PROCESSING: 3,
        SHIPPED: 4,
        DELIVERED: 5,
        CANCELLED: 99,
        REFUNDED: 99,
    };
    return order[status] || 0;
};

export function OrderTimeline({ order, showEstimatedDates = true }: OrderTimelineProps) {
    const currentStatusOrder = getStatusOrder(order.status);
    const isCancelled = order.status === "CANCELLED";
    const isRefunded = order.status === "REFUNDED";

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Define all possible statuses in order
    const normalFlow: OrderStatus[] = [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
    ];

    // Create timeline items
    const timelineItems: TimelineItem[] = normalFlow.map((status) => {
        const statusInfo = getStatusInfo(status);
        const statusOrderNum = getStatusOrder(status);

        let date: string | undefined;
        let isCompleted: boolean;
        let isActive: boolean;

        if (isCancelled || isRefunded) {
            // For cancelled/refunded orders, only show completed states before cancellation
            isCompleted = statusOrderNum < currentStatusOrder;
            isActive = false;
        } else {
            isCompleted = statusOrderNum <= currentStatusOrder;
            isActive = statusOrderNum === currentStatusOrder;
        }

        // Set actual dates based on order status
        if (status === "PENDING" && order.createdAt) {
            date = order.createdAt;
        } else if (status === "SHIPPED" && order.shippingDetails?.estimatedDelivery) {
            // For shipped status, show actual ship date if available, otherwise estimated
            date = order.shippingDetails.estimatedDelivery;
        } else if (status === "DELIVERED" && order.shippingDetails?.actualDelivery) {
            date = order.shippingDetails.actualDelivery;
        }

        return {
            status,
            title: statusInfo.title,
            description: statusInfo.description,
            date,
            isCompleted,
            isActive,
            icon: statusInfo.icon,
            color: isCompleted ? statusInfo.color : "gray",
        };
    });

    // Add cancelled/refunded status to timeline if applicable
    if (isCancelled || isRefunded) {
        const statusInfo = getStatusInfo(order.status);
        timelineItems.push({
            status: order.status,
            title: statusInfo.title,
            description: statusInfo.description,
            date: order.updatedAt,
            isCompleted: true,
            isActive: true,
            icon: statusInfo.icon,
            color: statusInfo.color,
        });
    }

    return (
        <Paper p="md" withBorder>
            <Stack gap="md">
                <Group justify="space-between">
                    <Text fw={600} size="lg">
                        Order Timeline
                    </Text>
                    <Badge color={getStatusInfo(order.status).color} variant="light" size="lg">
                        {order.status.replace("_", " ")}
                    </Badge>
                </Group>

                <Timeline active={timelineItems.findIndex((item) => item.isActive)} bulletSize={24}>
                    {timelineItems.map((item) => (
                        <Timeline.Item
                            key={item.status}
                            title={item.title}
                            bullet={
                                <ThemeIcon
                                    size={24}
                                    radius="xl"
                                    color={item.color}
                                    variant={item.isCompleted ? "filled" : "outline"}
                                >
                                    {item.icon}
                                </ThemeIcon>
                            }
                        >
                            <Stack gap="xs">
                                <Text size="sm" c="dimmed">
                                    {item.description}
                                </Text>

                                {item.date && (
                                    <Text size="xs" c="dimmed">
                                        {formatDate(item.date)}
                                    </Text>
                                )}

                                {/* Show tracking information for shipped status */}
                                {item.status === "SHIPPED" &&
                                    order.shippingDetails?.trackingNumber && (
                                        <Group gap="xs">
                                            <Text size="xs" fw={500}>
                                                Tracking:
                                            </Text>
                                            <Text
                                                size="xs"
                                                c="blue"
                                                style={{
                                                    fontFamily: "monospace",
                                                }}
                                            >
                                                {order.shippingDetails.trackingNumber}
                                            </Text>
                                        </Group>
                                    )}

                                {/* Show carrier information */}
                                {item.status === "SHIPPED" && order.shippingDetails?.carrier && (
                                    <Group gap="xs">
                                        <Text size="xs" fw={500}>
                                            Carrier:
                                        </Text>
                                        <Text size="xs">{order.shippingDetails.carrier}</Text>
                                    </Group>
                                )}
                            </Stack>
                        </Timeline.Item>
                    ))}
                </Timeline>

                {/* Estimated delivery information */}
                {showEstimatedDates &&
                    !isCancelled &&
                    !isRefunded &&
                    order.status !== "DELIVERED" &&
                    order.shippingDetails?.estimatedDelivery && (
                        <Paper p="sm" bg="blue.0" radius="sm">
                            <Group gap="xs">
                                <IconTruck size={16} color="var(--mantine-color-blue-6)" />
                                <Text size="sm" fw={500}>
                                    Estimated Delivery:
                                </Text>
                                <Text size="sm">
                                    {formatDate(order.shippingDetails.estimatedDelivery)}
                                </Text>
                            </Group>
                        </Paper>
                    )}
            </Stack>
        </Paper>
    );
}
