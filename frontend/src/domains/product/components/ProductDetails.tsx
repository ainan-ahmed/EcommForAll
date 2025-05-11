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
} from "@mantine/core";
import {
    IconShoppingCart,
    IconHeart,
    IconTruck,
    IconEdit,
} from "@tabler/icons-react";
import { useState, useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { Carousel } from "@mantine/carousel";
import { authStore } from "../../../stores/authStore";
import { useStore } from "zustand/react";
import { useNavigate } from "@tanstack/react-router";
import { useProduct } from "../hooks/useProduct";
import DOMPurify from "dompurify";

interface ProductDetailsProps {
    id: string; // Accept ID instead of product
}

export function ProductDetails({ id }: ProductDetailsProps) {
    // Fetch product data using hook
    const { data: product, isLoading, isError } = useProduct(id);

    // State for variant selection and quantity
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { user, isAuthenticated } = useStore(authStore);
    const navigate = useNavigate();

    // Move sortedImages calculation and useMemo here, before early returns
    // Sort images by sortOrder before rendering
    const sortedImages = useMemo(() => {
        return product?.images
            ? [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)
            : [];
    }, [product?.images]);

    // Create a combined and sorted image array
    const combinedImages = useMemo(() => {
        if (!selectedVariant || !product) return sortedImages;

        const variantObj = product.variants.find(
            (v) => v.id === selectedVariant
        );
        const variantImages = variantObj?.images || [];

        // Combine variant images (with a flag) and product images
        return [
            ...variantImages.map((img) => ({ ...img, isVariantImage: true })),
            ...sortedImages.filter(
                (img) => !variantImages.some((vImg) => vImg.id === img.id)
            ),
        ];
    }, [selectedVariant, sortedImages, product?.variants]);

    // Check if product exists before accessing its properties
    const isProductOwner =
        isAuthenticated && product && user?.id === product.sellerId;

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

    // Handle adding to cart
    const handleAddToCart = () => {
        // Add to cart logic here
        notifications.show({
            title: "Added to Cart",
            message: `${product.name} (Qty: ${quantity}) added to your cart`,
            color: "green",
        });
    };

    // Get variant options
    const variantOptions =
        product.variants?.map((variant) => ({
            value: variant.id,
            label: Object.entries(variant.attributeValues)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", "),
            disabled: variant.stock <= 0,
        })) || [];

    // Current price based on selected variant or default price
    const currentVariant = selectedVariant
        ? product.variants?.find((v) => v.id === selectedVariant)
        : product.variants?.[0];

    const price = currentVariant?.price || product.minPrice;
    const isInStock = currentVariant ? currentVariant.stock > 0 : true;

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
                                loop
                                align="center"
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
                                    data-disabled={
                                        !isInStock ||
                                        (product.variants &&
                                            product.variants.length > 1 &&
                                            !selectedVariant)
                                    }
                                    onClick={handleAddToCart}
                                    fullWidth
                                    variant="filled"
                                >
                                    Add to Cart
                                </Button>
                            </Tooltip>

                            <Button
                                size="lg"
                                variant="outline"
                                leftSection={<IconHeart size={20} />}
                            >
                                Add to Wishlist
                            </Button>
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
                    <Paper p="md">
                        <Text>Customer reviews would be displayed here.</Text>
                    </Paper>
                </Tabs.Panel>
            </Tabs>

            {/* Related Products */}
            <Title order={2} mt={50}>
                You May Also Like
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mt="md">
                {[1, 2, 3, 4].map((i) => (
                    <Card
                        key={i}
                        shadow="sm"
                        padding="md"
                        radius="md"
                        withBorder
                    >
                        <Card.Section>
                            <Image
                                src={`https://placehold.co/300x200?text=Related+${i}`}
                                height={160}
                                alt={`Related product ${i}`}
                            />
                        </Card.Section>
                        <Text fw={500} mt="md" lineClamp={1}>
                            Related Product {i}
                        </Text>
                        <Text mt="xs" c="dimmed" size="sm" lineClamp={1}>
                            Brief product description
                        </Text>
                        <Group justify="space-between" mt="md">
                            <Text fw={700}>${(19.99 + i).toFixed(2)}</Text>
                            <Button variant="light" size="xs">
                                View
                            </Button>
                        </Group>
                    </Card>
                ))}
            </SimpleGrid>
        </Container>
    );
}
