import {
    Container,
    Stack,
    Group,
    Title,
    Button,
    LoadingOverlay,
    Alert,
    Grid,
    Paper,
    Text,
    Divider,
} from "@mantine/core";
import {
    IconArrowLeft,
    IconAlertCircle,
    IconDownload,
    IconTruck,
    IconX,
    IconRefresh,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useOrder, useCancelOrder, useReorder } from "../hooks/useOrder";
import { OrderSummary } from "./OrderSummary";
import { OrderTimeline } from "./OrderTimeline";
import { OrderItemCard } from "./OrderItemCard";
import { OrderStatus } from "../types";

interface OrderDetailsProps {
    orderId: string;
}

const canCancelOrder = (status: OrderStatus): boolean => {
    return ["PENDING", "CONFIRMED"].includes(status);
};

const canReorder = (status: OrderStatus): boolean => {
    return ["DELIVERED", "CANCELLED", "REFUNDED"].includes(status);
};

export function OrderDetails({ orderId }: OrderDetailsProps) {
    const navigate = useNavigate();
    const [isActionsLoading, setIsActionsLoading] = useState(false);

    const { data: order, isLoading, error, refetch } = useOrder(orderId);

    const cancelOrderMutation = useCancelOrder();
    const reorderMutation = useReorder();

    const handleBackToOrders = () => {
        navigate({ to: "/" }); // Navigate to home since orders route doesn't exist yet
    };

    const handleDownloadInvoice = async () => {
        if (!order) return;

        setIsActionsLoading(true);
        try {
            // TODO: Implement invoice download
            console.log("Download invoice for order:", order.id);
            // In a real implementation, this would trigger a file download
        } catch (error) {
            console.error("Failed to download invoice:", error);
        } finally {
            setIsActionsLoading(false);
        }
    };

    const handleTrackOrder = () => {
        if (!order) return;

        // For now, just log since we don't have tracking routes yet
        console.log("Track order:", order.id);
    };

    const handleCancelOrder = async () => {
        if (!order) return;

        try {
            await cancelOrderMutation.mutateAsync({
                orderId: order.id,
                reason: "Cancelled by customer",
            });
            refetch();
        } catch (error) {
            console.error("Failed to cancel order:", error);
        }
    };

    const handleReorder = async () => {
        if (!order) return;

        try {
            await reorderMutation.mutateAsync(order.id);
        } catch (error) {
            console.error("Failed to reorder:", error);
        }
    };

    const handleReviewProduct = (productId: string) => {
        // For now just log since we need to check the routing structure
        console.log("Review product:", productId);
    };

    const handleReorderItem = (item: any) => {
        // TODO: Add individual item to cart
        console.log("Add to cart:", item);
    };

    const handleViewProduct = (productId: string) => {
        console.log("View product:", productId);
    };

    if (isLoading) {
        return (
            <Container size="lg" py="xl">
                <LoadingOverlay visible />
            </Container>
        );
    }

    if (error || !order) {
        return (
            <Container size="lg" py="xl">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Error loading order"
                    color="red"
                    variant="light"
                >
                    {error?.message ||
                        "Order not found. Please check the order ID and try again."}
                    <Group gap="sm" mt="sm">
                        <Button
                            variant="light"
                            size="sm"
                            onClick={() => refetch()}
                        >
                            Try Again
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBackToOrders}
                            leftSection={<IconArrowLeft size={16} />}
                        >
                            Back to Orders
                        </Button>
                    </Group>
                </Alert>
            </Container>
        );
    }

    const showCancelButton = canCancelOrder(order.status);
    const showReorderButton = canReorder(order.status);
    const showTrackingButton = order.shippingDetails?.trackingNumber;

    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                {/* Header */}
                <Group justify="space-between" align="flex-start">
                    <Group gap="md">
                        <Button
                            variant="subtle"
                            leftSection={<IconArrowLeft size={16} />}
                            onClick={handleBackToOrders}
                        >
                            Back to Orders
                        </Button>
                        <Title order={1}>Order Details</Title>
                    </Group>

                    {/* Action Buttons */}
                    <Group gap="sm">
                        <Button
                            variant="outline"
                            leftSection={<IconDownload size={16} />}
                            onClick={handleDownloadInvoice}
                            loading={isActionsLoading}
                        >
                            Download Invoice
                        </Button>

                        {showTrackingButton && (
                            <Button
                                variant="filled"
                                color="blue"
                                leftSection={<IconTruck size={16} />}
                                onClick={handleTrackOrder}
                            >
                                Track Order
                            </Button>
                        )}

                        {showReorderButton && (
                            <Button
                                variant="light"
                                color="green"
                                leftSection={<IconRefresh size={16} />}
                                onClick={handleReorder}
                                loading={reorderMutation.isPending}
                            >
                                Reorder
                            </Button>
                        )}

                        {showCancelButton && (
                            <Button
                                variant="light"
                                color="red"
                                leftSection={<IconX size={16} />}
                                onClick={handleCancelOrder}
                                loading={cancelOrderMutation.isPending}
                            >
                                Cancel Order
                            </Button>
                        )}
                    </Group>
                </Group>

                {/* Main Content */}
                <Grid>
                    <Grid.Col span={{ base: 12, lg: 8 }}>
                        <Stack gap="lg">
                            {/* Order Items */}
                            <Paper p="lg" withBorder>
                                <Stack gap="md">
                                    <Group justify="space-between">
                                        <Title order={3}>
                                            Items ({order.items.length})
                                        </Title>
                                        <Text size="sm" c="dimmed">
                                            Total:{" "}
                                            {new Intl.NumberFormat("en-EU", {
                                                style: "currency",
                                                currency:
                                                    order.currency || "EUR",
                                            }).format(order.totalAmount)}
                                        </Text>
                                    </Group>

                                    <Divider />

                                    <Stack gap="md">
                                        {order.items.map((item) => (
                                            <OrderItemCard
                                                key={item.id}
                                                item={item}
                                                canReview={
                                                    order.status === "DELIVERED"
                                                }
                                                canReorder={true}
                                                onReview={handleReviewProduct}
                                                onReorderItem={
                                                    handleReorderItem
                                                }
                                                onViewProduct={
                                                    handleViewProduct
                                                }
                                            />
                                        ))}
                                    </Stack>
                                </Stack>
                            </Paper>

                            {/* Order Timeline */}
                            <OrderTimeline order={order} />
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, lg: 4 }}>
                        <Stack gap="lg">
                            {/* Order Summary */}
                            <OrderSummary
                                order={order}
                                onDownloadInvoice={handleDownloadInvoice}
                                onTrackOrder={
                                    showTrackingButton
                                        ? handleTrackOrder
                                        : undefined
                                }
                                isLoading={isActionsLoading}
                                showActions={false} // We have actions in the header
                            />
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Container>
    );
}
