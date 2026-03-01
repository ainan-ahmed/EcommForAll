import {
    Group,
    Select,
    TextInput,
    Button,
    NumberInput,
    Stack,
    Paper,
    Collapse,
    ActionIcon,
    Text,
    Badge,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch, IconFilter, IconX, IconCalendar } from "@tabler/icons-react";
import { OrderStatus, OrderQueryParams } from "../types";

interface OrderFiltersProps {
    filters: OrderQueryParams;
    onFiltersChange: (filters: OrderQueryParams) => void;
    onClearFilters: () => void;
    isLoading?: boolean;
}

const ORDER_STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "REFUNDED", label: "Refunded" },
];

const SORT_OPTIONS = [
    { value: "createdAt,desc", label: "Newest First" },
    { value: "createdAt,asc", label: "Oldest First" },
    { value: "totalAmount,desc", label: "Highest Amount" },
    { value: "totalAmount,asc", label: "Lowest Amount" },
    { value: "orderNumber,asc", label: "Order Number A-Z" },
    { value: "orderNumber,desc", label: "Order Number Z-A" },
];

export function OrderFilters({
    filters,
    onFiltersChange,
    onClearFilters,
    isLoading = false,
}: OrderFiltersProps) {
    const [advancedFiltersOpened, { toggle: toggleAdvancedFilters }] = useDisclosure(false);

    const form = useForm({
        initialValues: {
            status: filters.status || "",
            orderNumber: filters.orderNumber || "",
            sort: filters.sort || "createdAt,desc",
            dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : null,
            dateTo: filters.dateTo ? new Date(filters.dateTo) : null,
            minAmount: filters.minAmount || "",
            maxAmount: filters.maxAmount || "",
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        const newFilters: OrderQueryParams = {
            ...filters,
            status: values.status ? (values.status as OrderStatus) : undefined,
            orderNumber: values.orderNumber || undefined,
            sort: values.sort || undefined,
            dateFrom: values.dateFrom?.toISOString().split("T")[0] || undefined,
            dateTo: values.dateTo?.toISOString().split("T")[0] || undefined,
            minAmount: values.minAmount ? Number(values.minAmount) : undefined,
            maxAmount: values.maxAmount ? Number(values.maxAmount) : undefined,
            page: 0, // Reset to first page when filters change
        };

        onFiltersChange(newFilters);
    };

    const handleClearFilters = () => {
        form.reset();
        onClearFilters();
    };

    const hasActiveFilters =
        filters.status ||
        filters.orderNumber ||
        filters.dateFrom ||
        filters.dateTo ||
        filters.minAmount ||
        filters.maxAmount;

    return (
        <Paper p="md" withBorder>
            <Stack gap="md">
                {/* Basic Filters */}
                <Group gap="md" align="flex-end">
                    <TextInput
                        label="Search by Order Number"
                        placeholder="Enter order number..."
                        leftSection={<IconSearch size={16} />}
                        style={{ flex: 1 }}
                        {...form.getInputProps("orderNumber")}
                    />

                    <Select
                        label="Status"
                        placeholder="All Statuses"
                        data={ORDER_STATUS_OPTIONS}
                        clearable
                        {...form.getInputProps("status")}
                        style={{ minWidth: 150 }}
                    />

                    <Select
                        label="Sort By"
                        data={SORT_OPTIONS}
                        {...form.getInputProps("sort")}
                        style={{ minWidth: 180 }}
                    />

                    <Group gap="xs">
                        <Button
                            onClick={() => handleSubmit(form.values)}
                            loading={isLoading}
                            leftSection={<IconSearch size={16} />}
                        >
                            Search
                        </Button>

                        <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={toggleAdvancedFilters}
                            title="Advanced Filters"
                        >
                            <IconFilter size={16} />
                        </ActionIcon>

                        {hasActiveFilters && (
                            <ActionIcon
                                variant="light"
                                color="red"
                                onClick={handleClearFilters}
                                title="Clear Filters"
                            >
                                <IconX size={16} />
                            </ActionIcon>
                        )}
                    </Group>
                </Group>

                {/* Advanced Filters */}
                <Collapse in={advancedFiltersOpened}>
                    <Stack gap="md" pt="md">
                        <Group gap="md" align="flex-end">
                            <DateInput
                                label="From Date"
                                placeholder="Select start date"
                                leftSection={<IconCalendar size={16} />}
                                clearable
                                {...form.getInputProps("dateFrom")}
                                style={{ flex: 1 }}
                            />

                            <DateInput
                                label="To Date"
                                placeholder="Select end date"
                                leftSection={<IconCalendar size={16} />}
                                clearable
                                {...form.getInputProps("dateTo")}
                                style={{ flex: 1 }}
                            />
                        </Group>

                        <Group gap="md" align="flex-end">
                            <NumberInput
                                label="Minimum Amount"
                                placeholder="0.00"
                                prefix="$"
                                decimalScale={2}
                                thousandSeparator=","
                                {...form.getInputProps("minAmount")}
                                style={{ flex: 1 }}
                            />

                            <NumberInput
                                label="Maximum Amount"
                                placeholder="0.00"
                                prefix="$"
                                decimalScale={2}
                                thousandSeparator=","
                                {...form.getInputProps("maxAmount")}
                                style={{ flex: 1 }}
                            />
                        </Group>
                    </Stack>
                </Collapse>

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                    <Group gap="xs" wrap="wrap">
                        <Text size="sm" c="dimmed">
                            Active filters:
                        </Text>

                        {filters.status && (
                            <Badge variant="light" color="blue" size="sm">
                                Status: {filters.status}
                            </Badge>
                        )}

                        {filters.orderNumber && (
                            <Badge variant="light" color="green" size="sm">
                                Order: {filters.orderNumber}
                            </Badge>
                        )}

                        {filters.dateFrom && (
                            <Badge variant="light" color="violet" size="sm">
                                From: {new Date(filters.dateFrom).toLocaleDateString()}
                            </Badge>
                        )}

                        {filters.dateTo && (
                            <Badge variant="light" color="violet" size="sm">
                                To: {new Date(filters.dateTo).toLocaleDateString()}
                            </Badge>
                        )}

                        {filters.minAmount && (
                            <Badge variant="light" color="orange" size="sm">
                                Min: ${filters.minAmount}
                            </Badge>
                        )}

                        {filters.maxAmount && (
                            <Badge variant="light" color="orange" size="sm">
                                Max: ${filters.maxAmount}
                            </Badge>
                        )}
                    </Group>
                )}
            </Stack>
        </Paper>
    );
}
