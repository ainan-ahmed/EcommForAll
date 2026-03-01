import { Badge, Button, Card, Group, Stack, Image, Text } from "@mantine/core";
import { IconShoppingCart, IconCheck } from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Product } from "../types";
import { useAddToCart, useCart } from "../../cart/hooks/useCart";
import { authStore } from "../../../stores/authStore";
import { notifications } from "@mantine/notifications";
import { useStore } from "zustand";
import { useMemo } from "react";

interface ProductCardProps {
    product: Product;
    showAddToCart?: boolean;
}

export function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
    const navigate = useNavigate();
    const addToCartMutation = useAddToCart();
    const { isAuthenticated } = useStore(authStore);
    const { data: cart } = useCart();

    const hasVariants = product.hasVariants;

    // Check if product is already in cart
    const isProductInCart = useMemo(() => {
        if (!cart?.items || !isAuthenticated) return false;

        return cart.items.some((item) => item.productId === product.id);
    }, [cart?.items, product.id, isAuthenticated]);

    // Get cart item for this product (if exists)
    const cartItem = useMemo(() => {
        if (!cart?.items || !isAuthenticated) return null;

        return cart.items.find((item) => item.productId === product.id) || null;
    }, [cart?.items, product.id, isAuthenticated]);

    const handleQuickAdd = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to product details
        e.stopPropagation();

        if (!isAuthenticated) {
            navigate({ to: "/login" });
            return;
        }

        // If product is already in cart, navigate to cart page
        if (isProductInCart) {
            navigate({ to: "/cart" });
            return;
        }

        // If product has variants, navigate to product details
        if (hasVariants) {
            navigate({ to: `/products/${product.id}` });
            return;
        }

        // For single variant products, add directly
        try {
            await addToCartMutation.mutateAsync({
                productId: product.id,
                quantity: 1,
            });
        } catch (error) {
            notifications.show({
                title: "Error",
                message: error instanceof Error ? error.message : "Failed to add to cart",
                color: "red",
            });
        }
    };

    // Determine button text and icon based on state
    const getButtonContent = () => {
        if (!isAuthenticated) {
            return {
                text: hasVariants ? "View Options" : "Add to Cart",
                icon: <IconShoppingCart size={16} />,
                variant: "light" as const,
                color: undefined,
            };
        }

        if (isProductInCart && cartItem) {
            return {
                text: `Go to Cart`,
                icon: <IconCheck size={16} />,
                variant: "filled" as const,
                color: "green",
            };
        }

        return {
            text: hasVariants ? "View Options" : "Add to Cart",
            icon: <IconShoppingCart size={16} />,
            variant: "light" as const,
            color: undefined,
        };
    };

    const buttonContent = getButtonContent();

    return (
        <Card
            shadow="sm"
            padding="md"
            radius="md"
            withBorder
            component={Link}
            to={`/products/${product.id}`}
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Card.Section>
                <Image
                    src={
                        product.primaryImage?.imageUrl ||
                        "https://placehold.co/300x200?text=No+Image"
                    }
                    height={160}
                    alt={product.primaryImage?.altText || product.name}
                />
            </Card.Section>
            <Stack justify="space-between" style={{ flexGrow: 1 }}>
                <Text fw={500} mt="md" lineClamp={1}>
                    {product.name}
                </Text>

                <Stack gap="xs">
                    <Group justify="space-between" mt="md">
                        <Text fw={700} size="lg">
                            {product.variants && product.variants.length > 1 && "from "}$
                            {product.minPrice != null ? product.minPrice.toFixed(2) : "N/A"}
                        </Text>
                        <Button variant="light" leftSection={<IconShoppingCart size={16} />}>
                            View
                        </Button>
                    </Group>

                    {product.variants && product.variants.length > 1 && (
                        <Badge mt="xs" size="sm">
                            {product.variants.length} variants
                        </Badge>
                    )}

                    {/* Cart status indicator */}
                    {isAuthenticated && isProductInCart && (
                        <Badge color="green" variant="light" size="sm">
                            ✓ In Cart
                        </Badge>
                    )}
                </Stack>
            </Stack>

            {showAddToCart && (
                <Button
                    variant={buttonContent.variant}
                    color={buttonContent.color}
                    leftSection={buttonContent.icon}
                    onClick={handleQuickAdd}
                    loading={addToCartMutation.isPending}
                    disabled={addToCartMutation.isPending}
                    fullWidth
                    mt="md"
                >
                    {buttonContent.text}
                </Button>
            )}
        </Card>
    );
}
