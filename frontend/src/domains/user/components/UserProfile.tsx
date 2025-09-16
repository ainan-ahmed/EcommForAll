import {
    Container,
    Title,
    Paper,
    Avatar,
    Text,
    Group,
    Tabs,
    Button,
    Stack,
    Divider,
    Badge,
    Alert,
    LoadingOverlay,
    Pagination,
    Center,
} from "@mantine/core";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "@tanstack/react-router";
import {
    IconEdit,
    IconKey,
    IconShoppingBag,
    IconHeart,
    IconSettings,
    IconTrash,
    IconAlertCircle,
} from "@tabler/icons-react";
import { WishlistsPage } from "./WishlistsPage";
import { useUserOrders } from "../../order/hooks/useOrder";
import { OrderCard } from "../../order/components/OrderCard";
import { OrderFilters } from "../../order/components/OrderFilters";
import { OrderStatus } from "../../order/types";

export function UserProfile() {
    const { user } = useStore(authStore);
    const [activeTab, setActiveTab] = useState<string | null>("profile");
    const navigate = useNavigate();

    // Order-related state
    const [orderPage, setOrderPage] = useState(0);
    const [orderStatus, setOrderStatus] = useState<OrderStatus | undefined>(
        undefined
    );
    const [sortBy, setSortBy] = useState<string>("createdAt,desc");

    // Fetch user orders with proper parameters
    const {
        data: ordersResponse,
        isLoading: isOrdersLoading,
        error: ordersError,
        refetch: refetchOrders,
    } = useUserOrders({
        page: orderPage,
        size: 10,
        status: orderStatus,
        sort: sortBy,
    });

    const handleOrderCancel = async (orderId: string, reason?: string) => {
        try {
            // TODO: Implement cancel order mutation when backend API is ready
            console.log("Cancel order:", orderId, reason);
            notifications.show({
                title: "Order Cancelled",
                message: "Your order has been cancelled successfully.",
                color: "orange",
            });
            refetchOrders();
        } catch (error) {
            console.error("Failed to cancel order:", error);
            notifications.show({
                title: "Error",
                message: "Failed to cancel order. Please try again.",
                color: "red",
            });
        }
    };

    const handleReorder = async (orderId: string) => {
        try {
            // TODO: Implement reorder mutation when backend API is ready
            console.log("Reorder:", orderId);
            notifications.show({
                title: "Items Added to Cart",
                message: "Order items have been added to your cart.",
                color: "green",
            });
            // Navigate to cart after reordering
            navigate({ to: "/cart" });
        } catch (error) {
            console.error("Failed to reorder:", error);
            notifications.show({
                title: "Error",
                message: "Failed to reorder. Please try again.",
                color: "red",
            });
        }
    };

    const handleDownloadInvoice = async (orderId: string) => {
        try {
            // TODO: Implement invoice download when backend API is ready
            console.log("Download invoice:", orderId);
            notifications.show({
                title: "Download Started",
                message: "Your invoice is being downloaded.",
                color: "blue",
            });
        } catch (error) {
            console.error("Failed to download invoice:", error);
            notifications.show({
                title: "Error",
                message: "Failed to download invoice. Please try again.",
                color: "red",
            });
        }
    };

    const handleOrderFiltersChange = (filters: {
        status?: OrderStatus;
        sortBy?: string;
    }) => {
        setOrderStatus(filters.status);
        setSortBy(filters.sortBy || "createdAt,desc");
        setOrderPage(0); // Reset to first page when filters change
    };

    // Helper function to safely count orders by status
    const countOrdersByStatus = (
        status: OrderStatus | OrderStatus[]
    ): number => {
        if (!ordersResponse?.content) return 0;

        const statuses = Array.isArray(status) ? status : [status];
        return ordersResponse.content.filter((order) =>
            statuses.includes(order.status as OrderStatus)
        ).length;
    };

    if (!user) {
        return (
            <Container size="xl" py="xl">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Authentication Required"
                    color="red"
                    variant="light"
                >
                    Please log in to view your profile.
                    <Button
                        variant="light"
                        size="sm"
                        mt="sm"
                        onClick={() => navigate({ to: "/login" })}
                    >
                        Go to Login
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container size="xl" py="xl">
            <Paper radius="md" p="xl" withBorder mb="lg">
                <Group wrap="nowrap">
                    <Avatar
                        size={120}
                        radius={120}
                        color="blue"
                        alt={`${user.firstName} ${user.lastName}`}
                    >
                        {user.firstName?.charAt(0)}
                        {user.lastName?.charAt(0)}
                    </Avatar>

                    <div style={{ flex: 1 }}>
                        <Text fz="xl" fw={700} mb={5}>
                            {user.firstName} {user.lastName}
                        </Text>
                        <Text c="dimmed" fz="lg">
                            @{user.username}
                        </Text>
                        <Group mt="md">
                            <Badge color="blue">{user.role}</Badge>
                            <Text size="sm" c="dimmed">
                                Member since{" "}
                                {user.createdAt
                                    ? new Date(
                                          user.createdAt
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </Text>
                        </Group>
                    </div>

                    {activeTab === "profile" && (
                        <Button
                            leftSection={<IconEdit size={16} />}
                            variant="light"
                            onClick={() => navigate({ to: "/profile/edit" })}
                        >
                            Edit Profile
                        </Button>
                    )}
                </Group>
            </Paper>

            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List mb="md">
                    <Tabs.Tab
                        value="profile"
                        leftSection={<IconSettings size={16} />}
                    >
                        Profile Details
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="wishlists"
                        leftSection={<IconHeart size={16} />}
                    >
                        My Wishlists
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="orders"
                        leftSection={<IconShoppingBag size={16} />}
                    >
                        Order History ({ordersResponse?.totalElements || 0})
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="security"
                        leftSection={<IconKey size={16} />}
                    >
                        Security
                    </Tabs.Tab>
                </Tabs.List>

                {/* Profile Details Tab */}
                <Tabs.Panel value="profile">
                    <Paper p="md" withBorder>
                        <Stack>
                            <Group>
                                <Text fw={500} w={120}>
                                    Full Name:
                                </Text>
                                <Text>
                                    {user.firstName} {user.lastName}
                                </Text>
                            </Group>
                            <Divider my="sm" />
                            <Group>
                                <Text fw={500} w={120}>
                                    Username:
                                </Text>
                                <Text>{user.username}</Text>
                            </Group>
                            <Divider my="sm" />
                            <Group>
                                <Text fw={500} w={120}>
                                    Email:
                                </Text>
                                <Text>{user.email}</Text>
                            </Group>
                            <Divider my="sm" />
                            <Group>
                                <Text fw={500} w={120}>
                                    Role:
                                </Text>
                                <Badge color="blue">{user.role}</Badge>
                            </Group>
                        </Stack>
                    </Paper>
                </Tabs.Panel>

                {/* Wishlists Tab */}
                <Tabs.Panel value="wishlists">
                    <WishlistsPage />
                </Tabs.Panel>

                {/* Orders Tab */}
                <Tabs.Panel value="orders">
                    <Stack gap="lg">
                        <Group justify="space-between">
                            <Title order={3}>Order History</Title>
                            <Button
                                variant="light"
                                onClick={() => navigate({ to: "/products" })}
                            >
                                Continue Shopping
                            </Button>
                        </Group>

                        {/* Order Filters */}
                        <OrderFilters
                            filters={{ status: orderStatus, sort: sortBy }}
                            onFiltersChange={handleOrderFiltersChange}
                            onClearFilters={() => {
                                setOrderStatus(undefined);
                                setSortBy("createdAt,desc");
                                setOrderPage(0);
                            }}
                        />

                        {/* Orders Content */}
                        <div style={{ position: "relative" }}>
                            <LoadingOverlay visible={isOrdersLoading} />

                            {ordersError && (
                                <Alert
                                    icon={<IconAlertCircle size={16} />}
                                    title="Error loading orders"
                                    color="red"
                                    variant="light"
                                    mb="md"
                                >
                                    {ordersError instanceof Error
                                        ? ordersError.message
                                        : "Failed to load your orders. Please try again."}
                                    <Button
                                        variant="light"
                                        size="sm"
                                        mt="sm"
                                        onClick={() => refetchOrders()}
                                    >
                                        Retry
                                    </Button>
                                </Alert>
                            )}

                            {!isOrdersLoading && !ordersError && (
                                <>
                                    {ordersResponse?.content &&
                                    ordersResponse.content.length > 0 ? (
                                        <Stack gap="md">
                                            {ordersResponse.content.map(
                                                (order) => (
                                                    <OrderCard
                                                        key={order.id}
                                                        order={order}
                                                        onCancel={
                                                            handleOrderCancel
                                                        }
                                                        onReorder={
                                                            handleReorder
                                                        }
                                                        onDownloadInvoice={
                                                            handleDownloadInvoice
                                                        }
                                                    />
                                                )
                                            )}

                                            {/* Pagination */}
                                            {ordersResponse.totalPages > 1 && (
                                                <Center mt="lg">
                                                    <Pagination
                                                        total={
                                                            ordersResponse.totalPages
                                                        }
                                                        value={orderPage + 1}
                                                        onChange={(page) =>
                                                            setOrderPage(
                                                                page - 1
                                                            )
                                                        }
                                                        size="sm"
                                                    />
                                                </Center>
                                            )}
                                        </Stack>
                                    ) : (
                                        <Paper p="xl" withBorder ta="center">
                                            <Stack align="center" gap="md">
                                                <IconShoppingBag
                                                    size={48}
                                                    color="gray"
                                                />
                                                <div>
                                                    <Text
                                                        size="lg"
                                                        fw={500}
                                                        mb="xs"
                                                    >
                                                        {orderStatus
                                                            ? `No ${orderStatus.toLowerCase()} orders found`
                                                            : "No orders yet"}
                                                    </Text>
                                                    <Text size="sm" c="dimmed">
                                                        {orderStatus
                                                            ? "Try adjusting your filters or check back later."
                                                            : "When you place orders, they'll appear here."}
                                                    </Text>
                                                </div>
                                                <Button
                                                    onClick={() =>
                                                        navigate({
                                                            to: "/products",
                                                        })
                                                    }
                                                    size="md"
                                                >
                                                    Browse Products
                                                </Button>
                                            </Stack>
                                        </Paper>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Order Summary Stats */}
                        {ordersResponse?.content &&
                            ordersResponse.content.length > 0 && (
                                <Paper p="md" withBorder bg="gray.0">
                                    <Group justify="space-around">
                                        <div style={{ textAlign: "center" }}>
                                            <Text size="xl" fw={700} c="blue">
                                                {ordersResponse.totalElements}
                                            </Text>
                                            <Text size="sm" c="dimmed">
                                                Total Orders
                                            </Text>
                                        </div>
                                        <Divider orientation="vertical" />
                                        <div style={{ textAlign: "center" }}>
                                            <Text size="xl" fw={700} c="green">
                                                {countOrdersByStatus(
                                                    "DELIVERED"
                                                )}
                                            </Text>
                                            <Text size="sm" c="dimmed">
                                                Delivered
                                            </Text>
                                        </div>
                                        <Divider orientation="vertical" />
                                        <div style={{ textAlign: "center" }}>
                                            <Text size="xl" fw={700} c="orange">
                                                {countOrdersByStatus([
                                                    "PENDING",
                                                    "CONFIRMED",
                                                    "PROCESSING",
                                                    "SHIPPED",
                                                ])}
                                            </Text>
                                            <Text size="sm" c="dimmed">
                                                Active
                                            </Text>
                                        </div>
                                    </Group>
                                </Paper>
                            )}
                    </Stack>
                </Tabs.Panel>

                {/* Security Tab */}
                <Tabs.Panel value="security">
                    <Title order={3} mb="md">
                        Account Security
                    </Title>
                    <Paper p="md" withBorder>
                        <Stack>
                            <Group justify="space-between">
                                <div>
                                    <Text fw={500}>Password</Text>
                                    <Text size="sm" c="dimmed">
                                        Change your password to protect your
                                        account
                                    </Text>
                                </div>
                                <Button
                                    variant="light"
                                    leftSection={<IconKey size={16} />}
                                    onClick={() => {
                                        notifications.show({
                                            title: "Feature Coming Soon",
                                            message:
                                                "Password change functionality will be available soon.",
                                            color: "blue",
                                        });
                                    }}
                                >
                                    Change Password
                                </Button>
                            </Group>

                            <Divider my="sm" />

                            <Group justify="space-between">
                                <div>
                                    <Text fw={500} c="red">
                                        Delete Account
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        Permanently delete your account and all
                                        associated data
                                    </Text>
                                </div>
                                <Button
                                    variant="outline"
                                    color="red"
                                    leftSection={<IconTrash size={16} />}
                                    onClick={() => {
                                        notifications.show({
                                            title: "Feature Not Available",
                                            message:
                                                "Account deletion is not implemented yet.",
                                            color: "orange",
                                        });
                                    }}
                                >
                                    Delete Account
                                </Button>
                            </Group>
                        </Stack>
                    </Paper>
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
}
