// src/domains/cart/components/CartPage.tsx
import {
    Container,
    Title,
    Grid,
    Card,
    Text,
    Group,
    Button,
    Stack,
    Divider,
    Paper,
    LoadingOverlay,
    Alert,
    Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from "../hooks/useCart";
import { CartItemCard } from "./CartItemCard";

export function AllCartDetails() {
    const { isAuthenticated } = useStore(authStore);
    const [clearModalOpened, { open: openClearModal, close: closeClearModal }] =
        useDisclosure(false);

    const { data: cart, isLoading, isError } = useCart();
    const updateCartItemMutation = useUpdateCartItem();
    const removeFromCartMutation = useRemoveFromCart();
    const clearCartMutation = useClearCart();

    if (!isAuthenticated) {
        return (
            <Container size="lg" py="xl">
                <Alert color="blue" title="Sign In Required">
                    Please sign in to view your shopping cart.
                    <Button component={Link} to="/login" mt="md">
                        Sign In
                    </Button>
                </Alert>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Container size="lg" py="xl">
                <Paper p="xl" withBorder>
                    <LoadingOverlay visible={true} />
                    <div style={{ height: "300px" }}></div>
                </Paper>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container size="lg" py="xl">
                <Alert color="red" title="Error">
                    Failed to load your cart. Please try again later.
                </Alert>
            </Container>
        );
    }

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        updateCartItemMutation.mutate({
            itemId,
            request: { quantity: newQuantity },
        });
    };

    const handleRemoveItem = (itemId: string) => {
        removeFromCartMutation.mutate(itemId);
    };

    const handleClearCartClick = () => {
        openClearModal();
    };

    const confirmClearCart = () => {
        clearCartMutation.mutate(undefined, {
            onSuccess: () => {
                closeClearModal();
            },
        });
    };

    if (!cart || cart.items.length === 0) {
        return (
            <Container size="lg" py="xl">
                <Paper p="xl" withBorder ta="center">
                    <Title order={3} mb="md">
                        Your Cart is Empty
                    </Title>
                    <Text mb="xl">Add some products to get started!</Text>
                    <Button component={Link} to="/products">
                        Browse Products
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="lg" py="xl">
            <Group justify="space-between" mb="xl">
                <Title order={2}>Shopping Cart ({cart.totalItems} items)</Title>
                <Button
                    variant="outline"
                    color="red"
                    onClick={handleClearCartClick}
                    disabled={clearCartMutation.isPending}
                >
                    Clear Cart
                </Button>
            </Group>

            <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack>
                        {cart.items.map((item) => (
                            <CartItemCard
                                key={item.id}
                                item={item}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemoveItem}
                                isUpdating={updateCartItemMutation.isPending}
                                isRemoving={removeFromCartMutation.isPending}
                            />
                        ))}
                    </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder p="lg" style={{ position: "sticky", top: "20px" }}>
                        <Title order={4} mb="md">
                            Order Summary
                        </Title>

                        <Stack gap="xs" mb="md">
                            <Group justify="space-between">
                                <Text>Subtotal ({cart.totalItems} items)</Text>
                                <Text>${cart.totalAmount.toFixed(2)}</Text>
                            </Group>

                            <Group justify="space-between">
                                <Text>Shipping</Text>
                                <Text c="green">Free</Text>
                            </Group>

                            <Group justify="space-between">
                                <Text>Tax</Text>
                                <Text>${(cart.totalAmount * 0.08).toFixed(2)}</Text>
                            </Group>
                        </Stack>

                        <Divider mb="md" />

                        <Group justify="space-between" mb="xl">
                            <Text fw={700} size="lg">
                                Total
                            </Text>
                            <Text fw={700} size="lg" c="blue">
                                ${(cart.totalAmount * 1.08).toFixed(2)}
                            </Text>
                        </Group>

                        <Button
                            fullWidth
                            size="lg"
                            mb="md"
                            disabled={cart.items.length === 0}
                            component={Link}
                            to="/orders/checkout"
                        >
                            Proceed to Checkout
                        </Button>

                        <Button variant="outline" fullWidth component={Link} to="/products">
                            Continue Shopping
                        </Button>
                    </Card>
                </Grid.Col>
            </Grid>

            {/* Clear Cart Confirmation Modal */}
            <Modal
                opened={clearModalOpened}
                onClose={closeClearModal}
                title="Clear Shopping Cart"
                centered
            >
                <Text size="sm" mb="lg">
                    Are you sure you want to remove all items from your cart? This action cannot be
                    undone.
                </Text>

                <Group justify="flex-end">
                    <Button variant="outline" onClick={closeClearModal}>
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        onClick={confirmClearCart}
                        loading={clearCartMutation.isPending}
                    >
                        Clear Cart
                    </Button>
                </Group>
            </Modal>
        </Container>
    );
}
