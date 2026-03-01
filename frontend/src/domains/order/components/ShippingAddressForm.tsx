import {
    Stack,
    Group,
    TextInput,
    Select,
    Checkbox,
    Button,
    Paper,
    Title,
    Grid,
    Text,
    Divider,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconMapPin, IconCheck } from "@tabler/icons-react";
import { ShippingAddress } from "../types";
import { shippingAddressSchema } from "../schemas/orderSchemas";

interface ShippingAddressFormProps {
    initialData?: Partial<ShippingAddress>;
    onSubmit: (address: ShippingAddress) => void;
    onSkip?: () => void;
    isLoading?: boolean;
    showSkip?: boolean;
    savedAddresses?: ShippingAddress[];
    onSelectSavedAddress?: (address: ShippingAddress) => void;
}

const COUNTRIES = [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "GB", label: "United Kingdom" },
    { value: "AU", label: "Australia" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "IT", label: "Italy" },
    { value: "ES", label: "Spain" },
    { value: "JP", label: "Japan" },
    { value: "IN", label: "India" },
];
export function ShippingAddressForm({
    initialData,
    onSubmit,
    onSkip,
    isLoading = false,
    showSkip = false,
    savedAddresses = [],
    onSelectSavedAddress,
}: ShippingAddressFormProps) {
    const form = useForm({
        initialValues: {
            firstName: initialData?.firstName || "",
            lastName: initialData?.lastName || "",
            company: initialData?.company || "",
            addressLine1: initialData?.addressLine1 || "",
            addressLine2: initialData?.addressLine2 || "",
            city: initialData?.city || "",
            country: initialData?.country || "US",
            phone: initialData?.phone || "",
            isDefault: initialData?.isDefault || false,
        },
        validate: zodResolver(shippingAddressSchema),
    });

    const handleSubmit = (values: any) => {
        onSubmit(values as ShippingAddress);
    };

    const handleSelectSavedAddress = (address: ShippingAddress) => {
        form.setValues({
            firstName: address.firstName,
            lastName: address.lastName,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || "",
            city: address.city,
            country: address.country,
            phone: address.phone || "",
            isDefault: address.isDefault || false,
        });

        if (onSelectSavedAddress) {
            onSelectSavedAddress(address);
        }
    };

    return (
        <Paper p="lg" withBorder>
            <Stack gap="lg">
                <Group justify="space-between" align="center">
                    <Group gap="sm">
                        <IconMapPin size={24} color="blue" />
                        <Title order={3}>Shipping Address</Title>
                    </Group>
                    {showSkip && onSkip && (
                        <Button variant="subtle" onClick={onSkip}>
                            Skip for now
                        </Button>
                    )}
                </Group>

                {/* Saved Addresses */}
                {savedAddresses.length > 0 && (
                    <>
                        <Stack gap="md">
                            <Text size="sm" fw={500} c="dimmed">
                                Choose from saved addresses
                            </Text>
                            {savedAddresses.map((address) => (
                                <Paper
                                    key={address.id}
                                    p="md"
                                    withBorder
                                    style={{
                                        cursor: "pointer",
                                        transition: "border-color 0.2s",
                                    }}
                                    onClick={() => handleSelectSavedAddress(address)}
                                    bg="gray.0"
                                >
                                    <Group justify="space-between">
                                        <Stack gap={2}>
                                            <Text size="sm" fw={500}>
                                                {address.firstName} {address.lastName}
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                {address.addressLine1}
                                                {address.addressLine2 &&
                                                    `, ${address.addressLine2}`}
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                {address.city} {address.postalCode}
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                {address.country}
                                            </Text>
                                        </Stack>
                                        <Button size="xs" variant="light">
                                            Use This Address
                                        </Button>
                                    </Group>
                                </Paper>
                            ))}
                        </Stack>

                        <Divider label="Or enter a new address" labelPosition="center" />
                    </>
                )}

                {/* Address Form */}
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                        {/* Name Fields */}
                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="First Name"
                                    placeholder="Enter first name"
                                    required
                                    {...form.getInputProps("firstName")}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Last Name"
                                    placeholder="Enter last name"
                                    required
                                    {...form.getInputProps("lastName")}
                                />
                            </Grid.Col>
                        </Grid>

                        {/* Company (Optional) */}
                        <TextInput
                            label="Company (Optional)"
                            placeholder="Enter company name"
                            {...form.getInputProps("company")}
                        />

                        {/* Address Lines */}
                        <TextInput
                            label="Address Line 1"
                            placeholder="Street address, P.O. box"
                            required
                            {...form.getInputProps("addressLine1")}
                        />

                        <TextInput
                            label="Address Line 2 (Optional)"
                            placeholder="Apartment, suite, unit, building, floor, etc."
                            {...form.getInputProps("addressLine2")}
                        />

                        {/* City, State, ZIP */}
                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="City"
                                    placeholder="Enter city"
                                    required
                                    {...form.getInputProps("city")}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="ZIP Code"
                                    placeholder="12345"
                                    required
                                    {...form.getInputProps("postalCode")}
                                />
                            </Grid.Col>
                        </Grid>

                        {/* Country */}
                        <Select
                            label="Country"
                            placeholder="Select country"
                            data={COUNTRIES}
                            required
                            {...form.getInputProps("country")}
                        />

                        {/* Phone (Optional) */}
                        <TextInput
                            label="Phone Number (Optional)"
                            placeholder="+1 (555) 123-4567"
                            {...form.getInputProps("phone")}
                        />

                        {/* Save as Default */}
                        <Checkbox
                            label="Set as default shipping address"
                            {...form.getInputProps("isDefault", {
                                type: "checkbox",
                            })}
                        />

                        {/* Submit Button */}
                        <Group justify="flex-end" gap="sm">
                            {onSkip && (
                                <Button variant="outline" onClick={onSkip}>
                                    Skip
                                </Button>
                            )}
                            <Button
                                type="submit"
                                loading={isLoading}
                                leftSection={<IconCheck size={16} />}
                            >
                                Continue to Payment
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Stack>
        </Paper>
    );
}
