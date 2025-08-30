import {
    Container,
    Grid,
    Image,
    Title,
    Text,
    Stack,
    Group,
    Button,
    Badge,
    Select,
    NumberInput,
    Divider,
    Tabs,
    Paper,
    List,
    Accordion,
    Card,
    SimpleGrid,
    LoadingOverlay,
    Alert,
    Box,
    Tooltip,
    Menu,
} from "@mantine/core";
import {
    IconShoppingCart,
    IconHeart,
    IconTruck,
    IconEdit,
    IconChevronDown,
} from "@tabler/icons-react";
import { useState, useMemo, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { Carousel } from "@mantine/carousel";
import { authStore } from "../../../stores/authStore";
import { useStore } from "zustand/react";
import { useNavigate } from "@tanstack/react-router";
import { useProduct } from "../hooks/useProduct";
import DOMPurify from "dompurify";
import {
    useUserWishlists,
    useIsProductInWishlist,
} from "../../user/hooks/useWishlist";
import { addToWishlist, removeFromWishlist } from "../../user/api/wishlistApi";
import { useQueryClient } from "@tanstack/react-query";
import { Product, WishlistProductSummary } from "../types";
import { useAddToCart } from "../../cart/hooks/useCart";
import { AddToCartRequest } from "../../cart/types";
import { useSimilarProducts } from "../../AI/hooks/useSimilarProducts";
import { ReviewsSection } from "../../review/components/ReviewsSection";

interface ProductDetailsProps {
    id: string; // Accept ID instead of product
}

export function ProductDetails({ id }: ProductDetailsProps) {
    // ✅ ALWAYS call ALL hooks at the top level, before any early returns

    // 1. Fetch product data using hook
    const { data: product, isLoading, isError } = useProduct(id);

    // fetch similar products
    const {
        data: similarProductsResponse,
        isLoading: isSimilarProductsLoading,
        isError: isSimilarProductsError,
    } = useSimilarProducts(id, !!product); // Only fetch similar products after product is loaded

    // 2. State hooks
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeWishlistId, setActiveWishlistId] = useState<string | null>(
        null
    );

    // 3. Store hooks
    const { user, isAuthenticated } = useStore(authStore);

    // 4. Navigation hooks
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 5. Wishlist hooks
    const { data: wishlists = [] } = useUserWishlists();
    const { data: isInFavorites = false, isLoading: isCheckingFavorites } =
        useIsProductInWishlist(activeWishlistId || undefined, id);

    // 6. Cart hooks
    const addToCartMutation = useAddToCart();

    // 7. All useMemo and useEffect hooks
    const sortedImages = useMemo(() => {
        return product?.images
            ? [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)
            : [];
    }, [product?.images]);
    console.log("Sorted Images:", sortedImages);

    const combinedImages = useMemo(() => {
        if (!selectedVariant || !product) return sortedImages;

        const variantObj = product.variants.find(
            (v) => v.id === selectedVariant
        );
        const variantImages = variantObj?.images || [];

        return [
            ...variantImages.map((img) => ({ ...img, isVariantImage: true })),
            ...sortedImages.filter(
                (img) => !variantImages.some((vImg) => vImg.id === img.id)
            ),
        ];
    }, [selectedVariant, sortedImages, product?.variants]);

    // 8. useEffect hooks
    useEffect(() => {
        const wishlistWithProduct = wishlists.find((wishlist) =>
            wishlist.products?.some(
                (product: WishlistProductSummary) => product.id === id
            )
        );

        if (wishlistWithProduct) {
            console.log("Product is in wishlist:", wishlistWithProduct.name);
            setActiveWishlistId(wishlistWithProduct.id);
        }
    }, [wishlists, id]);

    // 9. Computed values that depend on hooks
    const isProductOwner =
        isAuthenticated && product && user?.id === product.sellerId;

    const variantOptions =
        product?.variants?.map((variant) => ({
            value: variant.id,
            label: Object.entries(variant.attributeValues)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", "),
            disabled: variant.stock <= 0,
        })) || [];

    const currentVariant = selectedVariant
        ? product?.variants?.find((v) => v.id === selectedVariant)
        : product?.variants?.[0];

    const price = currentVariant?.price || product?.minPrice || 0;
    const isInStock = currentVariant ? currentVariant.stock > 0 : true;

    // ✅ NOW we can have conditional returns AFTER all hooks are called

    // Handle loading state
    if (isLoading) {
        return (
            <Container size="lg" py="xl">
                <LoadingOverlay visible={true} />
            </Container>
        );
    }

    // Handle error state
    if (isError || !product) {
        return (
            <Container size="lg" py="xl">
                <Alert color="red" title="Error">
                    Failed to load product. Please try again later.
                </Alert>
            </Container>
        );
    }

    // ✅ All event handlers can be defined here (after hooks, before JSX)
    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            notifications.show({
                title: "Please Sign In",
                message: "You need to be logged in to add items to cart",
                color: "blue",
            });
            navigate({ to: "/login", search: { redirect: `/products/${id}` } });
            return;
        }

        if (
            product.variants &&
            product.variants.length > 1 &&
            !selectedVariant
        ) {
            notifications.show({
                title: "Please Select Variant",
                message:
                    "Please select a product variant before adding to cart",
                color: "orange",
            });
            return;
        }

        if (!isInStock) {
            notifications.show({
                title: "Out of Stock",
                message: "This product is currently out of stock",
                color: "red",
            });
            return;
        }

        try {
            const cartItemData: AddToCartRequest = {
                variantId: selectedVariant || product.variants?.[0]?.id,
                productId: product.id,
                quantity: quantity,
            };

            await addToCartMutation.mutateAsync(cartItemData);
        } catch (error) {
            notifications.show({
                title: "Error",
                message: "Failed to add product to cart",
                color: "red",
            });
        }
    };

    const handleAddToWishlist = async (wishlistId: string) => {
        if (!isAuthenticated) {
            notifications.show({
                title: "Please Sign In",
                message:
                    "You need to be logged in to add items to your wishlist",
                color: "blue",
            });
            navigate({ to: "/login", search: { redirect: `/products/${id}` } });
            return;
        }

        try {
            await addToWishlist(wishlistId, id);
            queryClient.invalidateQueries({
                queryKey: ["wishlist", wishlistId],
            });
            queryClient.invalidateQueries({
                queryKey: ["wishlist", wishlistId, "product", id],
            });
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to add product to wishlist";

            notifications.show({
                title: "Error",
                message: errorMessage,
                color: "red",
            });
        }
    };

    const handleRemoveFromWishlist = async (wishlistId: string) => {
        if (!isAuthenticated) {
            notifications.show({
                title: "Please Sign In",
                message:
                    "You need to be logged in to remove items from your wishlist",
                color: "blue",
            });
            navigate({ to: "/login", search: { redirect: `/products/${id}` } });
            return;
        }

        try {
            await removeFromWishlist(wishlistId, id);
            queryClient.invalidateQueries({
                queryKey: ["wishlist", wishlistId],
            });
            queryClient.invalidateQueries({
                queryKey: ["wishlist", wishlistId, "product", id],
            });
        } catch (error) {
            notifications.show({
                title: "Error",
                message: "Failed to remove product from wishlist",
                color: "red",
            });
        }
    };

    function handleViewProduct(id: string): void {
        navigate({ to: `/products/${id}` });
    }

    // ✅ JSX render comes last
    return (
        <Container size="lg" py="xl">
            <Grid gutter="xl">
                {/* Product Images */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                    {combinedImages && combinedImages.length > 0 ? (
                        <>
                            <Carousel
                                withIndicators
                                height={400}
                                slideGap="md"
                                emblaOptions={{
                                    loop: true,
                                    align: "center",
                                }}
                            >
                                {combinedImages.map((image, index) => (
                                    <Carousel.Slide key={image.id || index}>
                                        <Box pos="relative">
                                            <Image
                                                src={image.imageUrl}
                                                height={400}
                                                fit="contain"
                                                alt={
                                                    image.altText ||
                                                    product.name
                                                }
                                                style={
                                                    image.isVariantImage
                                                        ? {
                                                              border: "2px solid skyblue",
                                                          }
                                                        : {}
                                                }
                                            />
                                            {image.isVariantImage && (
                                                <Badge
                                                    top={10}
                                                    right={10}
                                                    variant="filled"
                                                    color="blue"
                                                >
                                                    Variant Image
                                                </Badge>
                                            )}
                                        </Box>
                                    </Carousel.Slide>
                                ))}
                            </Carousel>

                            {/* <Group mt="md" gap="xs">
                                {sortedImages.map((image, index) => (
                                    <Image
                                        key={image.id || index}
                                        src={image.imageUrl}
                                        height={80}
                                        width={80}
                                        fit="cover"
                                        radius="md"
                                        alt={
                                            image.altText ||
                                            `${product.name} thumbnail ${index + 1}`
                                        }
                                    />
                                ))}
                            </Group> */}
                        </>
                    ) : (
                        <Image
                            src="https://placehold.co/600x400?text=No+Image+Available"
                            height={400}
                            alt={product.name}
                        />
                    )}
                </Grid.Col>

                {/* Product Info */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack>
                        <Group justify="space-between" align="flex-start">
                            <Title>{product.name}</Title>

                            {/* Edit button - only shown to product owner or admin */}
                            {(isProductOwner || user?.role === "ADMIN") && (
                                <Button
                                    leftSection={<IconEdit size={20} />}
                                    color="yellow"
                                    variant="outline"
                                    onClick={() => {
                                        navigate({
                                            to: "/products/$productId/edit",
                                            params: { productId: product.id },
                                        });
                                    }}
                                >
                                    Edit Product
                                </Button>
                            )}
                        </Group>

                        <Group>
                            <Badge
                                color={isInStock ? "green" : "red"}
                                size="lg"
                            >
                                {isInStock ? "In Stock" : "Out of Stock"}
                            </Badge>

                            {selectedVariant && currentVariant && (
                                <Badge
                                    color={
                                        currentVariant.stock <= 5
                                            ? "orange"
                                            : "blue"
                                    }
                                    size="lg"
                                >
                                    {currentVariant.stock <= 5
                                        ? `Only ${currentVariant.stock} left`
                                        : `${currentVariant.stock} in stock`}
                                </Badge>
                            )}

                            <Badge color="blue" size="lg">
                                SKU: {currentVariant?.sku || product.sku}
                            </Badge>
                        </Group>

                        <Title order={2} c="blue" mt="md">
                            ${price.toFixed(2)}
                        </Title>

                        <Divider my="md" />

                        {/* Variant Selection */}
                        {product.variants && product.variants.length > 1 && (
                            <Select
                                label="Select Option"
                                placeholder="Choose variant"
                                data={variantOptions}
                                value={selectedVariant}
                                onChange={setSelectedVariant}
                                required
                                mt="md"
                            />
                        )}

                        {/* Quantity */}
                        <NumberInput
                            label="Quantity"
                            min={1}
                            max={currentVariant?.stock || 99}
                            value={quantity}
                            onChange={(val) => setQuantity(Number(val))}
                            mt="md"
                        />

                        {/* Add to Cart */}
                        <Group mt="xl">
                            <Tooltip
                                label={
                                    product.variants &&
                                    product.variants.length > 1 &&
                                    !selectedVariant
                                        ? "Please select a variant first"
                                        : !isInStock
                                          ? "This product is out of stock"
                                          : ""
                                }
                                position="top"
                                withArrow
                            >
                                <Button
                                    size="lg"
                                    leftSection={<IconShoppingCart size={20} />}
                                    disabled={
                                        !isInStock ||
                                        (product.variants &&
                                            product.variants.length > 1 &&
                                            !selectedVariant) ||
                                        addToCartMutation.isPending
                                    }
                                    loading={addToCartMutation.isPending}
                                    onClick={handleAddToCart}
                                    fullWidth
                                    variant="filled"
                                >
                                    Add to Cart
                                </Button>
                            </Tooltip>

                            <Menu>
                                <Menu.Target>
                                    {isInFavorites ? (
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            leftSection={
                                                <IconHeart size={20} />
                                            }
                                            rightSection={
                                                <IconChevronDown size={16} />
                                            }
                                        >
                                            In Favorites
                                        </Button>
                                    ) : (
                                        <Button
                                            size="lg"
                                            variant="filled"
                                            leftSection={
                                                <IconHeart size={20} />
                                            }
                                            rightSection={
                                                <IconChevronDown size={16} />
                                            }
                                        >
                                            Add to Wishlist
                                        </Button>
                                    )}
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Label>Save to Wishlist</Menu.Label>
                                    {wishlists.length === 0 ? (
                                        <Menu.Item disabled>
                                            No wishlists found. Create one in
                                            your profile.
                                        </Menu.Item>
                                    ) : (
                                        wishlists.map((wishlist) => {
                                            const isActive =
                                                activeWishlistId ===
                                                    wishlist.id || false;

                                            return (
                                                <Menu.Item
                                                    key={wishlist.id}
                                                    rightSection={
                                                        isActive ? (
                                                            <IconHeart
                                                                size={16}
                                                                color="green"
                                                            />
                                                        ) : (
                                                            <IconHeart
                                                                size={16}
                                                                color="gray"
                                                            />
                                                        )
                                                    }
                                                    onClick={() => {
                                                        isActive
                                                            ? handleRemoveFromWishlist(
                                                                  wishlist.id
                                                              )
                                                            : handleAddToWishlist(
                                                                  wishlist.id
                                                              );
                                                        setActiveWishlistId(
                                                            isActive
                                                                ? null
                                                                : wishlist.id
                                                        );

                                                        notifications.show({
                                                            title: "Success",
                                                            message: `Product ${
                                                                isActive
                                                                    ? "removed from"
                                                                    : "added to"
                                                            } ${wishlist.name}`,
                                                            color: isInFavorites
                                                                ? "blue"
                                                                : "green",
                                                        });
                                                    }}
                                                >
                                                    {wishlist.name}
                                                </Menu.Item>
                                            );
                                        })
                                    )}
                                </Menu.Dropdown>
                            </Menu>
                        </Group>

                        {/* Shipping Info */}
                        <Paper withBorder p="md" radius="md" mt="lg">
                            <Group mb="xs">
                                <IconTruck size={20} />
                                <Text fw={500}>Shipping & Returns</Text>
                            </Group>
                            <List spacing="xs" size="sm">
                                <List.Item>
                                    Free shipping on orders over $50
                                </List.Item>
                                <List.Item>
                                    Standard delivery: 3-5 business days
                                </List.Item>
                                <List.Item>30-day return policy</List.Item>
                            </List>
                        </Paper>
                    </Stack>
                </Grid.Col>
            </Grid>

            {/* Product Details Tabs */}
            <Tabs defaultValue="description" mt="xl">
                <Tabs.List>
                    <Tabs.Tab value="description">Description</Tabs.Tab>
                    <Tabs.Tab value="specifications">Specifications</Tabs.Tab>
                    <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="description" pt="xl">
                    <Paper p="md">
                        <Box
                            className="product-description"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(product.description),
                            }}
                        />
                    </Paper>
                </Tabs.Panel>

                <Tabs.Panel value="specifications" pt="xl">
                    <Paper p="md">
                        <Accordion>
                            <Accordion.Item value="materials">
                                <Accordion.Control>
                                    Materials & Care
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Text size="sm">
                                        Materials information would be displayed
                                        here.
                                    </Text>
                                </Accordion.Panel>
                            </Accordion.Item>

                            <Accordion.Item value="dimensions">
                                <Accordion.Control>
                                    Dimensions
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Text size="sm">
                                        Product dimensions would be displayed
                                        here.
                                    </Text>
                                </Accordion.Panel>
                            </Accordion.Item>

                            <Accordion.Item value="warranty">
                                <Accordion.Control>
                                    Warranty Information
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Text size="sm">
                                        Warranty details would be displayed
                                        here.
                                    </Text>
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </Paper>
                </Tabs.Panel>

                <Tabs.Panel value="reviews" pt="xl">
                    <ReviewsSection productId={id} />
                </Tabs.Panel>
            </Tabs>

            {/* Related Products */}
            <Title order={2} mt={50}>
                You May Also Like
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mt="md">
                {isSimilarProductsLoading && <LoadingOverlay visible={true} />}
                {isSimilarProductsError && (
                    <Text>Error loading similar products</Text>
                )}
                {similarProductsResponse?.similarProducts &&
                    similarProductsResponse.similarProducts.map(
                        (product: Product) => (
                            <Card
                                key={product.id}
                                shadow="sm"
                                padding="md"
                                radius="md"
                                withBorder
                                onClick={() => handleViewProduct(product.id)}
                            >
                                <Card.Section>
                                    <Image
                                        src={product.primaryImage?.imageUrl}
                                        height={160}
                                        alt={product.name}
                                    />
                                </Card.Section>
                                <Text fw={500} mt="md" lineClamp={1}>
                                    {product.name}
                                </Text>
                                <Text
                                    mt="xs"
                                    c="dimmed"
                                    size="sm"
                                    lineClamp={1}
                                >
                                    {product.description}
                                </Text>
                                <Group justify="space-between" mt="md">
                                    <Text fw={700}>
                                        From ${product.minPrice.toFixed(2)}
                                    </Text>
                                    <Button variant="light" size="xs" onClick={() => handleViewProduct(product.id)}>
                                        View
                                    </Button>
                                </Group>
                            </Card>
                        )
                    )}
            </SimpleGrid>
        </Container>
    );
}
