import {
    Table,
    Badge,
    Group,
    Text,
    ActionIcon,
    Stack,
    Paper,
    Title,
    TextInput,
    Select,
    Button,
    Menu,
    Pagination,
    Alert,
    Loader,
    Center,
    Avatar,
    Tooltip,
    ScrollArea,
} from "@mantine/core";
import {
    IconSearch,
    IconFilter,
    IconEye,
    IconDots,
    IconRefresh,
    IconDownload,
    IconX,
    IconCheck,
    IconTruck,
    IconPackage,
    IconCreditCard,
} from "@tabler/icons-react";
import { useState } from "react";
import { Order, OrderStatus } from "../types";

interface AdminOrderListProps {
    orders: Order[];
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onOrderView: (orderId: string) => void;
    onStatusUpdate: (orderId: string, status: OrderStatus) => void;
    onRefund: (orderId: string) => void;
    isLoading?: boolean;
    error?: string;
}

interface OrderFilters {
    search: string;
    status: string;
    dateRange: string;
}

export function AdminOrderList({
    orders,
    totalPages,
    currentPage,
    onPageChange,
    onOrderView,
    onStatusUpdate,
    onRefund,
    isLoading = false,
    error,
}: AdminOrderListProps) {
    const [filters, setFilters] = useState<OrderFilters>({
        search: "",
        status: "",
        dateRange: "",
    });

    const statusColors: Record<OrderStatus, string> = {
        PENDING: "yellow",
        CONFIRMED: "blue",
        PROCESSING: "cyan",
        SHIPPED: "violet",
        DELIVERED: "green",
        CANCELLED: "red",
        REFUNDED: "gray",
    };

    const statusIcons: Record<OrderStatus, any> = {
        PENDING: IconCreditCard,
        CONFIRMED: IconCheck,
        PROCESSING: IconPackage,
        SHIPPED: IconTruck,
        DELIVERED: IconCheck,
        CANCELLED: IconX,
        REFUNDED: IconRefresh,
    };

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        onStatusUpdate(orderId, newStatus);
    };

    const clearFilters = () => {
        setFilters({ search: "", status: "", dateRange: "" });
    };

    if (error) {
        return (
            <Alert color="red" title="Error loading orders">
                {error}
            </Alert>
        );
    }

    return (
        <Stack gap="lg">
            <Group justify="space-between">
                <Title order={2}>Order Management</Title>
                <Button leftSection={<IconDownload size={16} />}>Export Orders</Button>
            </Group>

            {/* Filters */}
            <Paper p="md" withBorder>
                <Stack gap="md">
                    <Group>
                        <TextInput
                            placeholder="Search by order ID, customer name, or email"
                            leftSection={<IconSearch size={16} />}
                            value={filters.search}
                            onChange={(event) =>
                                setFilters({
                                    ...filters,
                                    search: event.currentTarget.value,
                                })
                            }
                            style={{ flex: 1 }}
                        />
                        <Select
                            placeholder="Filter by status"
                            value={filters.status}
                            onChange={(value) => setFilters({ ...filters, status: value || "" })}
                            data={[
                                { value: "", label: "All statuses" },
                                { value: "PENDING", label: "Pending" },
                                { value: "CONFIRMED", label: "Confirmed" },
                                { value: "PROCESSING", label: "Processing" },
                                { value: "SHIPPED", label: "Shipped" },
                                { value: "DELIVERED", label: "Delivered" },
                                { value: "CANCELLED", label: "Cancelled" },
                                { value: "REFUNDED", label: "Refunded" },
                            ]}
                            w={200}
                        />
                        <Select
                            placeholder="Date range"
                            value={filters.dateRange}
                            onChange={(value) =>
                                setFilters({
                                    ...filters,
                                    dateRange: value || "",
                                })
                            }
                            data={[
                                { value: "", label: "All time" },
                                { value: "today", label: "Today" },
                                { value: "week", label: "This week" },
                                { value: "month", label: "This month" },
                                { value: "quarter", label: "This quarter" },
                            ]}
                            w={150}
                        />
                        <Button
                            variant="light"
                            leftSection={<IconFilter size={16} />}
                            onClick={clearFilters}
                        >
                            Clear
                        </Button>
                    </Group>
                </Stack>
            </Paper>

            {/* Orders Table */}
            <Paper withBorder>
                <ScrollArea>
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Order ID</Table.Th>
                                <Table.Th>Customer</Table.Th>
                                <Table.Th>Date</Table.Th>
                                <Table.Th>Items</Table.Th>
                                <Table.Th>Total</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {isLoading ? (
                                <Table.Tr>
                                    <Table.Td colSpan={7}>
                                        <Center py="xl">
                                            <Loader size="sm" />
                                        </Center>
                                    </Table.Td>
                                </Table.Tr>
                            ) : orders.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={7}>
                                        <Center py="xl">
                                            <Text c="dimmed">No orders found</Text>
                                        </Center>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                orders.map((order) => {
                                    const StatusIcon = statusIcons[order.status];
                                    return (
                                        <Table.Tr key={order.id}>
                                            <Table.Td>
                                                <Text fw={500} size="sm">
                                                    #{order.id.slice(-8)}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Group gap="sm">
                                                    <Avatar
                                                        src={undefined}
                                                        alt={
                                                            order.user
                                                                ? `${order.user.firstName} ${order.user.lastName}`
                                                                : "User"
                                                        }
                                                        size={32}
                                                        radius="xl"
                                                    />
                                                    <Stack gap={0}>
                                                        <Text size="sm" fw={500}>
                                                            {order.user
                                                                ? `${order.user.firstName} ${order.user.lastName}`
                                                                : "Unknown User"}
                                                        </Text>
                                                        <Text size="xs" c="dimmed">
                                                            {order.user?.email || "No email"}
                                                        </Text>
                                                    </Stack>
                                                </Group>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm">
                                                    {order.items.length} item
                                                    {order.items.length !== 1 ? "s" : ""}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text fw={500}>
                                                    {new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                    }).format(order.totalAmount)}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge
                                                    color={statusColors[order.status]}
                                                    variant="light"
                                                    leftSection={<StatusIcon size={12} />}
                                                >
                                                    {order.status.charAt(0) +
                                                        order.status.slice(1).toLowerCase()}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                <Group gap="xs">
                                                    <Tooltip label="View details">
                                                        <ActionIcon
                                                            variant="subtle"
                                                            onClick={() => onOrderView(order.id)}
                                                        >
                                                            <IconEye size={16} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Menu shadow="md" width={200}>
                                                        <Menu.Target>
                                                            <ActionIcon variant="subtle">
                                                                <IconDots size={16} />
                                                            </ActionIcon>
                                                        </Menu.Target>
                                                        <Menu.Dropdown>
                                                            <Menu.Label>Update Status</Menu.Label>
                                                            <Menu.Item
                                                                leftSection={
                                                                    <IconCheck size={14} />
                                                                }
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        order.id,
                                                                        "CONFIRMED"
                                                                    )
                                                                }
                                                                disabled={
                                                                    order.status === "CONFIRMED"
                                                                }
                                                            >
                                                                Confirm Order
                                                            </Menu.Item>
                                                            <Menu.Item
                                                                leftSection={
                                                                    <IconPackage size={14} />
                                                                }
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        order.id,
                                                                        "PROCESSING"
                                                                    )
                                                                }
                                                                disabled={
                                                                    order.status === "PROCESSING"
                                                                }
                                                            >
                                                                Mark Processing
                                                            </Menu.Item>
                                                            <Menu.Item
                                                                leftSection={
                                                                    <IconTruck size={14} />
                                                                }
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        order.id,
                                                                        "SHIPPED"
                                                                    )
                                                                }
                                                                disabled={
                                                                    order.status === "SHIPPED"
                                                                }
                                                            >
                                                                Mark Shipped
                                                            </Menu.Item>
                                                            <Menu.Item
                                                                leftSection={
                                                                    <IconCheck size={14} />
                                                                }
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        order.id,
                                                                        "DELIVERED"
                                                                    )
                                                                }
                                                                disabled={
                                                                    order.status === "DELIVERED"
                                                                }
                                                            >
                                                                Mark Delivered
                                                            </Menu.Item>
                                                            <Menu.Divider />
                                                            <Menu.Item
                                                                leftSection={<IconX size={14} />}
                                                                color="red"
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        order.id,
                                                                        "CANCELLED"
                                                                    )
                                                                }
                                                                disabled={
                                                                    order.status === "CANCELLED"
                                                                }
                                                            >
                                                                Cancel Order
                                                            </Menu.Item>
                                                            <Menu.Item
                                                                leftSection={
                                                                    <IconRefresh size={14} />
                                                                }
                                                                color="orange"
                                                                onClick={() => onRefund(order.id)}
                                                                disabled={
                                                                    order.status === "REFUNDED"
                                                                }
                                                            >
                                                                Issue Refund
                                                            </Menu.Item>
                                                        </Menu.Dropdown>
                                                    </Menu>
                                                </Group>
                                            </Table.Td>
                                        </Table.Tr>
                                    );
                                })
                            )}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>

                {totalPages > 1 && (
                    <Group justify="center" p="md">
                        <Pagination
                            total={totalPages}
                            value={currentPage}
                            onChange={onPageChange}
                        />
                    </Group>
                )}
            </Paper>
        </Stack>
    );
}
