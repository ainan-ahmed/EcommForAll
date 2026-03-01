import {
    Container,
    Stepper,
    Stack,
    Button,
    Group,
    Title,
    Paper,
    LoadingOverlay,
    Text,
    Alert,
} from "@mantine/core";
import { useState } from "react";
import {
    IconShoppingCart,
    IconTruck,
    IconCreditCard,
    IconCheck,
    IconAlertCircle,
} from "@tabler/icons-react";
import { ShippingAddressForm } from "./ShippingAddressForm";
import { PaymentForm } from "./PaymentForm";
import { ShippingAddress, PaymentMethod } from "../types";
import { useCreateOrder } from "../hooks/useOrder";
import { useNavigate } from "@tanstack/react-router";
import { useCart } from "../../cart/hooks/useCart";
import { notifications } from "@mantine/notifications";

interface CheckoutFormProps {
    isLoading?: boolean;
}

interface PaymentData {
    paymentMethod: PaymentMethod;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardholderName?: string;
}

export function CheckoutForm({ isLoading = false }: CheckoutFormProps) {
    const [active, setActive] = useState(0);
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const createOrderMutation = useCreateOrder();
    const navigate = useNavigate();
    const { data: cart } = useCart();

    // Calculate totals
    const subtotal = cart?.totalAmount || 0;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const totalAmount = subtotal + tax + shipping;

    const validateCurrentStep = (): boolean => {
        const errors: string[] = [];

        switch (active) {
            case 0:
                if (!shippingAddress) {
                    errors.push("Please complete shipping address");
                }
                break;
            case 1:
                if (!paymentData) {
                    errors.push("Please select a payment method");
                }
                break;
            case 2:
                if (!shippingAddress) {
                    errors.push("Shipping address is required");
                }
                if (!paymentData) {
                    errors.push("Payment method is required");
                }
                if (!cart || cart.items.length === 0) {
                    errors.push("Your cart is empty");
                }
                break;
        }

        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleShippingSubmit = (address: ShippingAddress) => {
        setShippingAddress(address);
        setValidationErrors([]);
        setActive(1); // Move to payment step
    };

    const handlePaymentSubmit = (payment: PaymentData) => {
        setPaymentData(payment);
        setValidationErrors([]);
        setActive(2); // Move to review step
    };

    const handleStepClick = (stepIndex: number) => {
        // Only allow going to previous steps or if current step is valid
        if (stepIndex < active) {
            setActive(stepIndex);
            setValidationErrors([]);
        } else if (stepIndex === active + 1 && validateCurrentStep()) {
            setActive(stepIndex);
        }
    };

    const handleOrderComplete = async () => {
        if (!validateCurrentStep() || !shippingAddress || !paymentData) {
            return;
        }

        try {
            const orderRequest = {
                shippingAddress, // Pass as object
                billingAddress: shippingAddress, // Pass as object
                paymentMethod: paymentData.paymentMethod,
                notes: "",
                fromCart: true,
                items:
                    cart?.items.map((item) => ({
                        productId: item.productId,
                        variantId: item.variantId || undefined,
                        quantity: item.quantity,
                    })) || [],
            };

            const order = await createOrderMutation.mutateAsync(orderRequest);

            notifications.show({
                title: "Order Placed Successfully",
                message: `Order #${order.id} has been created successfully!`,
                color: "green",
                autoClose: 5000,
            });

            navigate({ to: `/orders/${order.id}` });
        } catch (error: any) {
            console.error("Order creation failed:", error);

            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to place order. Please try again.";

            notifications.show({
                title: "Order Failed",
                message: errorMessage,
                color: "red",
                autoClose: 7000,
            });

            setValidationErrors([errorMessage]);
        }
    };

    const handleBackToShipping = () => {
        setActive(0);
        setValidationErrors([]);
    };

    const handleBackToPayment = () => {
        setActive(1);
        setValidationErrors([]);
    };

    const formatPaymentMethod = (method: PaymentMethod): string => {
        if (!method) return "Unknown";

        const formatted = method.replace(/_/g, " ");
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    };

    const isSubmitDisabled =
        !shippingAddress || !paymentData || !cart?.items?.length || createOrderMutation.isPending;

    return (
        <Container size="md" py="xl">
            <LoadingOverlay visible={isLoading || createOrderMutation.isPending} />

            <Stack gap="xl">
                <Title order={1} ta="center">
                    Checkout
                </Title>

                {validationErrors.length > 0 && (
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Please fix the following issues:"
                        color="red"
                        variant="light"
                    >
                        <Stack gap="xs">
                            {validationErrors.map((error, index) => (
                                <Text key={index} size="sm">
                                    • {error}
                                </Text>
                            ))}
                        </Stack>
                    </Alert>
                )}

                <Stepper active={active} onStepClick={handleStepClick} allowNextStepsSelect={false}>
                    <Stepper.Step
                        label="Shipping"
                        description="Delivery address"
                        icon={<IconTruck size={18} />}
                        completedIcon={<IconCheck size={18} />}
                    >
                        <ShippingAddressForm
                            initialData={shippingAddress || undefined}
                            onSubmit={handleShippingSubmit}
                            isLoading={isLoading}
                        />
                    </Stepper.Step>

                    <Stepper.Step
                        label="Payment"
                        description="Payment method"
                        icon={<IconCreditCard size={18} />}
                        completedIcon={<IconCheck size={18} />}
                    >
                        <PaymentForm
                            totalAmount={totalAmount}
                            onSubmit={handlePaymentSubmit}
                            onBack={handleBackToShipping}
                            isLoading={isLoading}
                        />
                    </Stepper.Step>

                    <Stepper.Step
                        label="Review"
                        description="Confirm order"
                        icon={<IconCheck size={18} />}
                    >
                        <Paper p="lg" withBorder>
                            <Stack gap="lg">
                                <Title order={3}>Order Review</Title>

                                {/* Cart Summary */}
                                {cart && (
                                    <Stack gap="sm">
                                        <Title order={4}>Order Summary</Title>
                                        <Paper p="md" bg="gray.0">
                                            <Stack gap="xs">
                                                <Group justify="space-between">
                                                    <Text size="sm">
                                                        Items ({cart.totalItems || 0})
                                                    </Text>
                                                    <Text size="sm">
                                                        {subtotal.toLocaleString("en-EU", {
                                                            style: "currency",
                                                            currency: "EUR",
                                                        })}
                                                    </Text>
                                                </Group>
                                                <Group justify="space-between">
                                                    <Text size="sm">Tax (8%)</Text>
                                                    <Text size="sm">
                                                        {tax.toLocaleString("en-EU", {
                                                            style: "currency",
                                                            currency: "EUR",
                                                        })}
                                                    </Text>
                                                </Group>
                                                <Group justify="space-between">
                                                    <Text size="sm">Shipping</Text>
                                                    <Text size="sm">
                                                        {shipping === 0
                                                            ? "Free"
                                                            : shipping.toLocaleString("en-EU", {
                                                                  style: "currency",
                                                                  currency: "EUR",
                                                              })}
                                                    </Text>
                                                </Group>
                                            </Stack>
                                        </Paper>
                                    </Stack>
                                )}

                                {/* Shipping Address Summary */}
                                {shippingAddress && (
                                    <Stack gap="sm">
                                        <Group justify="space-between">
                                            <Title order={4}>Shipping Address</Title>
                                            <Button
                                                variant="subtle"
                                                size="sm"
                                                onClick={handleBackToShipping}
                                            >
                                                Edit
                                            </Button>
                                        </Group>
                                        <Paper p="md" bg="gray.0">
                                            <Stack gap={2}>
                                                <Text fw={500}>
                                                    {shippingAddress.firstName}{" "}
                                                    {shippingAddress.lastName}
                                                </Text>
                                                <Text size="sm">
                                                    {shippingAddress.addressLine1}
                                                </Text>
                                                {shippingAddress.addressLine2 && (
                                                    <Text size="sm">
                                                        {shippingAddress.addressLine2}
                                                    </Text>
                                                )}
                                                <Text size="sm">
                                                    {shippingAddress.city},{" "}
                                                    {shippingAddress.postalCode}
                                                </Text>
                                                <Text size="sm">{shippingAddress.country}</Text>
                                                {shippingAddress.phone && (
                                                    <Text size="sm">
                                                        Phone: {shippingAddress.phone}
                                                    </Text>
                                                )}
                                            </Stack>
                                        </Paper>
                                    </Stack>
                                )}

                                {/* Payment Method Summary */}
                                {paymentData && (
                                    <Stack gap="sm">
                                        <Group justify="space-between">
                                            <Title order={4}>Payment Method</Title>
                                            <Button
                                                variant="subtle"
                                                size="sm"
                                                onClick={handleBackToPayment}
                                            >
                                                Edit
                                            </Button>
                                        </Group>
                                        <Paper p="md" bg="gray.0">
                                            <Stack gap={2}>
                                                <Text fw={500}>
                                                    {formatPaymentMethod(paymentData.paymentMethod)}
                                                </Text>
                                                {paymentData.cardNumber && (
                                                    <Text size="sm">
                                                        **** **** ****{" "}
                                                        {paymentData.cardNumber.slice(-4)}
                                                    </Text>
                                                )}
                                                {paymentData.cardholderName && (
                                                    <Text size="sm">
                                                        Cardholder: {paymentData.cardholderName}
                                                    </Text>
                                                )}
                                            </Stack>
                                        </Paper>
                                    </Stack>
                                )}

                                {/* Order Total */}
                                <Paper p="md" bg="blue.0" withBorder>
                                    <Group justify="space-between">
                                        <Title order={4}>Total Amount</Title>
                                        <Title order={3} c="blue">
                                            {totalAmount.toLocaleString("en-EU", {
                                                style: "currency",
                                                currency: "EUR",
                                            })}
                                        </Title>
                                    </Group>
                                </Paper>

                                {/* Place Order Button */}
                                <Button
                                    size="lg"
                                    onClick={handleOrderComplete}
                                    loading={createOrderMutation.isPending}
                                    disabled={isSubmitDisabled}
                                    leftSection={<IconShoppingCart size={20} />}
                                    fullWidth
                                >
                                    {createOrderMutation.isPending
                                        ? "Processing..."
                                        : "Place Order"}
                                </Button>
                            </Stack>
                        </Paper>
                    </Stepper.Step>
                </Stepper>
            </Stack>
        </Container>
    );
}
