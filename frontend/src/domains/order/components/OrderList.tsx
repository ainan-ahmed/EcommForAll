import {
    Container,
    Title,
    Stack,
    LoadingOverlay,
    Alert,
    Pagination,
    Group,
    Text,
    Center,
    Button,
} from "@mantine/core";
import { useState } from "react";
import { IconAlertCircle, IconShoppingCart } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useUserOrders, useCancelOrder, useReorder } from "../hooks/useOrder";
import { OrderQueryParams } from "../types";
import { OrderCard } from "./OrderCard";
import { OrderFilters } from "./OrderFilters";

interface OrderListProps {
    title?: string;
    showFilters?: boolean;
    initialFilters?: OrderQueryParams;
}

export function OrderList({
    title = "My Orders",
    showFilters = true,
    initialFilters = {},
}: OrderListProps) {
    const [filters, setFilters] = useState<OrderQueryParams>({
        page: 0,
        size: 10,
        sort: "createdAt,desc",
        ...initialFilters,
    });

    const {
        data: ordersResponse,
        isLoading,
        error,
        refetch,
    } = useUserOrders(filters);

    const cancelOrderMutation = useCancelOrder();
    const reorderMutation = useReorder();

    const handleFiltersChange = (newFilters: OrderQueryParams) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({
            page: 0,
            size: 10,
            sort: "createdAt,desc",
        });
    };

    const handlePageChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page: page - 1 })); // Mantine uses 1-based pagination
    };

    const handleCancelOrder = async (orderId: string) => {
        try {
            await cancelOrderMutation.mutateAsync({
                orderId,
                reason: "Cancelled by customer",
            });
            refetch();
        } catch (error) {
            console.error("Failed to cancel order:", error);
        }
    };

    const handleReorder = async (orderId: string) => {
        try {
            await reorderMutation.mutateAsync(orderId);
        } catch (error) {
            console.error("Failed to reorder:", error);
        }
    };

    const handleDownloadInvoice = (orderId: string) => {
        // TODO: Implement invoice download
        console.log("Download invoice for order:", orderId);
    };

    if (error) {
        return (
            <Container size="lg" py="xl">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Error loading orders"
                    color="red"
                    variant="light"
                >
                    {error.message ||
                        "Failed to load orders. Please try again."}
                    <Button
                        variant="light"
                        size="sm"
                        mt="sm"
                        onClick={() => refetch()}
                    >
                        Try Again
                    </Button>
                </Alert>
            </Container>
        );
    }

    const orders = ordersResponse?.content || [];
    const totalPages = ordersResponse?.totalPages || 0;
    const currentPage = (ordersResponse?.number || 0) + 1; // Convert to 1-based
    const totalElements = ordersResponse?.totalElements || 0;

    return (
        <Container size="lg" py="xl">
            <LoadingOverlay visible={isLoading} />

            <Stack gap="xl">
                {/* Header */}
                <Group justify="space-between" align="center">
                    <Title order={1}>{title}</Title>
                    {totalElements > 0 && (
                        <Text size="sm" c="dimmed">
                            {totalElements} order
                            {totalElements !== 1 ? "s" : ""} found
                        </Text>
                    )}
                </Group>

                {/* Filters */}
                {showFilters && (
                    <OrderFilters
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        onClearFilters={handleClearFilters}
                        isLoading={isLoading}
                    />
                )}

                {/* Orders List */}
                {orders.length === 0 ? (
                    <Center py="xl">
                        <Stack gap="md" align="center">
                            <IconShoppingCart size={64} color="gray" />
                            <Stack gap="xs" align="center">
                                <Text size="lg" fw={500} c="dimmed">
                                    No orders found
                                </Text>
                                <Text size="sm" c="dimmed" ta="center">
                                    {Object.keys(filters).length > 3
                                        ? "Try adjusting your filters or clearing them to see more orders."
                                        : "You haven't placed any orders yet. Start shopping to see your orders here!"}
                                </Text>
                            </Stack>
                            {Object.keys(filters).length <= 3 && (
                                <Button
                                    component={Link}
                                    to="/products"
                                    leftSection={<IconShoppingCart size={16} />}
                                >
                                    Start Shopping
                                </Button>
                            )}
                            {Object.keys(filters).length > 3 && (
                                <Button
                                    variant="outline"
                                    onClick={handleClearFilters}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </Stack>
                    </Center>
                ) : (
                    <Stack gap="md">
                        {orders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onCancel={handleCancelOrder}
                                onReorder={handleReorder}
                                onDownloadInvoice={handleDownloadInvoice}
                                isLoading={
                                    cancelOrderMutation.isPending ||
                                    reorderMutation.isPending
                                }
                            />
                        ))}
                    </Stack>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <Group justify="center">
                        <Pagination
                            total={totalPages}
                            value={currentPage}
                            onChange={handlePageChange}
                            size="md"
                            withEdges
                            disabled={isLoading}
                        />
                    </Group>
                )}
            </Stack>
        </Container>
    );
}
