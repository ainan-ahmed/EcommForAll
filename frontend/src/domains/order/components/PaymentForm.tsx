import {
    Stack,
    Group,
    TextInput,
    Button,
    Paper,
    Title,
    Grid,
    Text,
    Radio,
    Divider,
    Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
    IconCreditCard,
    IconCheck,
    IconBrandPaypal,
    IconCash,
    IconBuildingBank,
    IconInfoCircle,
} from "@tabler/icons-react";
import { useState } from "react";
import { PaymentMethod } from "../types";

interface PaymentFormProps {
    onSubmit: (paymentData: PaymentFormData) => void;
    onBack?: () => void;
    isLoading?: boolean;
    totalAmount: number;
    currency?: string;
}

interface PaymentFormData {
    paymentMethod: PaymentMethod;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardHolderName?: string;
    billingZip?: string;
}

const PAYMENT_METHODS = [
    {
        value: "CREDIT_CARD" as PaymentMethod,
        label: "Credit Card",
        icon: <IconCreditCard size={20} />,
        description: "Visa, Mastercard, American Express",
    },
    {
        value: "DEBIT_CARD" as PaymentMethod,
        label: "Debit Card",
        icon: <IconCreditCard size={20} />,
        description: "Pay directly from your bank account",
    },
    {
        value: "PAYPAL" as PaymentMethod,
        label: "PayPal",
        icon: <IconBrandPaypal size={20} />,
        description: "Pay with your PayPal account",
    },
    {
        value: "BANK_TRANSFER" as PaymentMethod,
        label: "Bank Transfer",
        icon: <IconBuildingBank size={20} />,
        description: "Direct bank transfer",
    },
    {
        value: "CASH_ON_DELIVERY" as PaymentMethod,
        label: "Cash on Delivery",
        icon: <IconCash size={20} />,
        description: "Pay when you receive your order",
    },
];

export function PaymentForm({
    onSubmit,
    onBack,
    isLoading = false,
    totalAmount,
    currency = "USD",
}: PaymentFormProps) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState<PaymentMethod>("CREDIT_CARD");

    const requiresCardDetails =
        selectedPaymentMethod === "CREDIT_CARD" || selectedPaymentMethod === "DEBIT_CARD";

    const form = useForm({
        initialValues: {
            paymentMethod: "CREDIT_CARD" as PaymentMethod,
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            cardHolderName: "",
            billingZip: "",
        },
        validate: {
            cardNumber: (value) => {
                if (requiresCardDetails && !value) return "Card number is required";
                if (value && !/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(value)) {
                    return "Please enter a valid card number";
                }
                return null;
            },
            expiryDate: (value) => {
                if (requiresCardDetails && !value) return "Expiry date is required";
                if (value && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
                    return "Please enter expiry date in MM/YY format";
                }
                return null;
            },
            cvv: (value) => {
                if (requiresCardDetails && !value) return "CVV is required";
                if (value && !/^\d{3,4}$/.test(value)) {
                    return "Please enter a valid CVV";
                }
                return null;
            },
            cardHolderName: (value) => {
                if (requiresCardDetails && !value) return "Card holder name is required";
                return null;
            },
        },
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
        }).format(amount);
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || "";
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(" ");
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        if (v.length >= 2) {
            return v.substring(0, 2) + "/" + v.substring(2, 4);
        }
        return v;
    };

    const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(event.target.value);
        form.setFieldValue("cardNumber", formatted);
    };

    const handleExpiryDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiryDate(event.target.value);
        form.setFieldValue("expiryDate", formatted);
    };

    const handlePaymentMethodChange = (value: string) => {
        const method = value as PaymentMethod;
        setSelectedPaymentMethod(method);
        form.setFieldValue("paymentMethod", method);
    };

    const handleSubmit = (values: typeof form.values) => {
        onSubmit(values);
    };

    return (
        <Paper p="lg" withBorder>
            <Stack gap="lg">
                <Group justify="space-between" align="center">
                    <Group gap="sm">
                        <IconCreditCard size={24} color="blue" />
                        <Title order={3}>Payment Information</Title>
                    </Group>
                    <Text size="lg" fw={600}>
                        Total: {formatCurrency(totalAmount)}
                    </Text>
                </Group>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="lg">
                        {/* Payment Method Selection */}
                        <Stack gap="md">
                            <Text size="sm" fw={500}>
                                Choose Payment Method
                            </Text>

                            <Radio.Group
                                value={selectedPaymentMethod}
                                onChange={handlePaymentMethodChange}
                            >
                                <Stack gap="sm">
                                    {PAYMENT_METHODS.map((method) => (
                                        <Paper
                                            key={method.value}
                                            p="md"
                                            withBorder
                                            style={{
                                                cursor: "pointer",
                                                backgroundColor:
                                                    selectedPaymentMethod === method.value
                                                        ? "var(--mantine-color-blue-0)"
                                                        : "transparent",
                                                borderColor:
                                                    selectedPaymentMethod === method.value
                                                        ? "var(--mantine-color-blue-4)"
                                                        : "var(--mantine-color-gray-3)",
                                            }}
                                            onClick={() => handlePaymentMethodChange(method.value)}
                                        >
                                            <Group gap="md">
                                                <Radio value={method.value} />
                                                {method.icon}
                                                <Stack gap={2} style={{ flex: 1 }}>
                                                    <Text size="sm" fw={500}>
                                                        {method.label}
                                                    </Text>
                                                    <Text size="xs" c="dimmed">
                                                        {method.description}
                                                    </Text>
                                                </Stack>
                                            </Group>
                                        </Paper>
                                    ))}
                                </Stack>
                            </Radio.Group>
                        </Stack>

                        {/* Card Details (for Credit/Debit Card) */}
                        {requiresCardDetails && (
                            <>
                                <Divider />
                                <Stack gap="md">
                                    <Text size="sm" fw={500}>
                                        Card Details
                                    </Text>

                                    <TextInput
                                        label="Card Holder Name"
                                        placeholder="Name as it appears on card"
                                        required
                                        {...form.getInputProps("cardHolderName")}
                                    />

                                    <TextInput
                                        label="Card Number"
                                        placeholder="1234 5678 9012 3456"
                                        required
                                        maxLength={19}
                                        onChange={handleCardNumberChange}
                                        value={form.values.cardNumber}
                                        error={form.errors.cardNumber}
                                    />

                                    <Grid>
                                        <Grid.Col span={6}>
                                            <TextInput
                                                label="Expiry Date"
                                                placeholder="MM/YY"
                                                required
                                                maxLength={5}
                                                onChange={handleExpiryDateChange}
                                                value={form.values.expiryDate}
                                                error={form.errors.expiryDate}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <TextInput
                                                label="CVV"
                                                placeholder="123"
                                                required
                                                maxLength={4}
                                                {...form.getInputProps("cvv")}
                                            />
                                        </Grid.Col>
                                    </Grid>

                                    <TextInput
                                        label="Billing ZIP Code (Optional)"
                                        placeholder="12345"
                                        {...form.getInputProps("billingZip")}
                                    />
                                </Stack>
                            </>
                        )}

                        {/* PayPal Instructions */}
                        {selectedPaymentMethod === "PAYPAL" && (
                            <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
                                You will be redirected to PayPal to complete your payment securely.
                            </Alert>
                        )}

                        {/* Bank Transfer Instructions */}
                        {selectedPaymentMethod === "BANK_TRANSFER" && (
                            <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
                                Bank transfer details will be provided after order confirmation.
                                Your order will be processed once payment is received.
                            </Alert>
                        )}

                        {/* Cash on Delivery Instructions */}
                        {selectedPaymentMethod === "CASH_ON_DELIVERY" && (
                            <Alert
                                icon={<IconInfoCircle size={16} />}
                                color="orange"
                                variant="light"
                            >
                                You will pay in cash when the order is delivered to your address.
                                Additional delivery fees may apply.
                            </Alert>
                        )}

                        {/* Submit Buttons */}
                        <Group justify="space-between">
                            {onBack && (
                                <Button variant="outline" onClick={onBack}>
                                    Back to Shipping
                                </Button>
                            )}
                            <Button
                                type="submit"
                                loading={isLoading}
                                leftSection={<IconCheck size={16} />}
                                style={{ marginLeft: "auto" }}
                            >
                                {selectedPaymentMethod === "PAYPAL"
                                    ? "Continue to PayPal"
                                    : selectedPaymentMethod === "CASH_ON_DELIVERY"
                                      ? "Place Order"
                                      : "Review Order"}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Stack>
        </Paper>
    );
}
