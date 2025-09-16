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
} from "@mantine/core";
import { useState } from "react";
import {
    IconShoppingCart,
    IconTruck,
    IconCreditCard,
    IconCheck,
} from "@tabler/icons-react";
import { ShippingAddressForm } from "./ShippingAddressForm";
import { PaymentForm } from "./PaymentForm";

import { ShippingAddress, PaymentMethod, OrderItem } from "../types";
import { useCreateOrder, useCreateOrderFromCart } from "../hooks/useOrder";
import { useNavigate } from "@tanstack/react-router";
import { useCart } from "../../cart/hooks/useCart";
import { notifications } from "@mantine/notifications";

interface CheckoutFormProps {
    totalAmount: number;
    isLoading?: boolean;
}

interface CheckoutData {
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
    paymentData: any;
}

export function CheckoutForm({
    totalAmount,
    isLoading = false,
}: CheckoutFormProps) {
    const [active, setActive] = useState(0);
    const [shippingAddress, setShippingAddress] =
        useState<ShippingAddress | null>(null);
    const [paymentData, setPaymentData] = useState<any>(null);
    const createOrderMutation = useCreateOrder();
    const navigate = useNavigate();
    const { data: cart } = useCart();
    const handleShippingSubmit = (address: ShippingAddress) => {
        setShippingAddress(address);
        setActive(1); // Move to payment step
    };

    const handlePaymentSubmit = (payment: any) => {
        setPaymentData(payment);
        setActive(2); // Move to review step
    };

    const handleOrderComplete = async ({
        shippingAddress,
        paymentMethod,
        paymentData,
    }: CheckoutData) => {
        try {
            const order = await createOrderMutation.mutateAsync({
                items:
                    cart?.items.map((item) => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                    })) || [],
                shippingAddress,
                billingAddress: shippingAddress,
                paymentMethod: paymentData?.paymentMethod?.type || "", // Ensure this is a string
                notes: "", // or collect from form
            });
            notifications.show({
                title: "Order Placed",
                message: `Order #${order.orderNumber} has been created successfully!`,
                color: "green",
            });
            navigate({ to: `/orders/${order.id}` });
        } catch (error: any) {
            notifications.show({
                title: "Order Failed",
                message: error?.message || "Failed to place order.",
                color: "red",
            });
        }
    };

    const handleBackToShipping = () => {
        setActive(0);
    };

    const handleBackToPayment = () => {
        setActive(1);
    };
    console.log({ shippingAddress, paymentData });
    return (
        <Container size="md" py="xl">
            <LoadingOverlay visible={isLoading} />

            <Stack gap="xl">
                <Title order={1} ta="center">
                    Checkout
                </Title>

                <Stepper
                    active={active}
                    onStepClick={setActive}
                    allowNextStepsSelect={false}
                >
                    <Stepper.Step
                        label="Shipping"
                        description="Delivery address"
                        icon={<IconTruck size={18} />}
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

                                {/* Shipping Address Summary */}
                                {shippingAddress && (
                                    <Stack gap="sm">
                                        <Group justify="space-between">
                                            <Title order={4}>
                                                Shipping Address
                                            </Title>
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
                                                    {
                                                        shippingAddress.addressLine1
                                                    }
                                                </Text>
                                                {shippingAddress.addressLine2 && (
                                                    <Text size="sm">
                                                        {
                                                            shippingAddress.addressLine2
                                                        }
                                                    </Text>
                                                )}
                                                <Text size="sm">
                                                    {shippingAddress.city},{" "}
                                                    {/* state removed */}
                                                    {shippingAddress.postalCode}
                                                </Text>
                                                <Text size="sm">
                                                    {shippingAddress.country}
                                                </Text>
                                            </Stack>
                                        </Paper>
                                    </Stack>
                                )}

                                {/* Payment Method Summary */}
                                {paymentData && (
                                    <Stack gap="sm">
                                        <Group justify="space-between">
                                            <Title order={4}>
                                                Payment Method
                                            </Title>
                                            <Button
                                                variant="subtle"
                                                size="sm"
                                                onClick={handleBackToPayment}
                                            >
                                                Edit
                                            </Button>
                                        </Group>
                                        <Paper p="md" bg="gray.0">
                                            <Text fw={500}>
                                                {paymentData.paymentMethod.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </Text>
                                            {paymentData.cardNumber && (
                                                <Text size="sm">
                                                    **** **** ****{" "}
                                                    {paymentData.cardNumber.slice(
                                                        -4
                                                    )}
                                                </Text>
                                            )}
                                        </Paper>
                                    </Stack>
                                )}

                                {/* Order Total */}
                                <Group justify="space-between">
                                    <Title order={4}>Total Amount</Title>
                                    <Title order={3}>
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        }).format(totalAmount)}
                                    </Title>
                                </Group>

                                {/* Place Order Button */}
                                <Button
                                    size="lg"
                                    onClick={() =>
                                        shippingAddress && handleOrderComplete({
                                            shippingAddress,
                                            paymentMethod:
                                                paymentData?.paymentMethod,
                                            paymentData,
                                        })
                                    }
                                    loading={isLoading}
                                    leftSection={<IconShoppingCart size={20} />}
                                >
                                    Place Order
                                </Button>
                            </Stack>
                        </Paper>
                    </Stepper.Step>
                </Stepper>
            </Stack>
        </Container>
    );
}
