import { useState } from "react";
import {
    Container,
    Title,
    Text,
    Image,
    Group,
    Badge,
    Skeleton,
    Stack,
    Grid,
    Button,
    Pagination,
    Anchor,
    Paper,
} from "@mantine/core";
import {
    IconPackage,
    IconChevronRight,
    IconWorld,
    IconCalendar,
    IconEdit,
} from "@tabler/icons-react";
import { ProductCard } from "../../product/components/ProductCard";
import { useBrand } from "../hooks/useBrand";
import { useProductsByBrandId } from "../../product/hooks/useProductsByBrandId";
import { formatDate } from "../utils";
import { useStore } from "zustand/react";
import { authStore } from "../../../stores/authStore";
import { Link } from "@tanstack/react-router";

interface BrandDetailsProps {
    id: string;
}

export function BrandDetails({ id }: BrandDetailsProps) {
    const [page, setPage] = useState(0);
    const pageSize = 8;
    const { user, isAuthenticated } = useStore(authStore);
    // Fetch brand details
    const {
        data: brand,
        isLoading: isBrandLoading,
        isError: isBrandError,
    } = useBrand(id);

    // Fetch products by brand ID
    const {
        data: productsData,
        isLoading: isProductsLoading,
        isError: isProductsError,
    } = useProductsByBrandId({
        brandId: id,
        page,
        size: pageSize,
        enabled: !!id,
    });

    const products = productsData?.content || [];
    const totalElements = productsData?.totalElements || 0;
    const totalPages = productsData?.totalPages || 0;

    const isLoading = isBrandLoading || isProductsLoading;
    const isError = isBrandError || isProductsError;

    // Loading state
    if (isLoading || !brand) {
        return (
            <Container size="lg" py="xl">
                <Skeleton height={50} width="70%" mb="xl" />
                <Skeleton height={200} radius="md" mb="xl" />
                <Skeleton height={24} width="90%" mb="md" />
                <Skeleton height={24} width="80%" mb="md" />
                <Skeleton height={24} width="60%" />

                <Grid mt={40}>
                    {Array(4)
                        .fill(0)
                        .map((_, i) => (
                            <Grid.Col
                                key={i}
                                span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                            >
                                <Skeleton height={180} radius="md" mb="sm" />
                                <Skeleton height={20} width="80%" mb="sm" />
                                <Skeleton height={15} width="50%" />
                            </Grid.Col>
                        ))}
                </Grid>
            </Container>
        );
    }

    // Error state
    if (isError) {
        return (
            <Container size="lg" py="xl">
                <Title order={2} c="red" mb="md">
                    Error Loading Brand
                </Title>
                <Text size="lg">
                    We couldn't load the brand details. Please try again later.
                </Text>
                <Button mt="xl" variant="outline" component="a" href="/brands">
                    Return to Brands
                </Button>
            </Container>
        );
    }

    return (
        <Container size="lg">
            <Stack gap="md">
                {/* Header */}
                <Group wrap="nowrap" align="flex-start" justify="space-between">
                    <Stack gap="xs">
                        <Title order={1}>{brand.name}</Title>
                        <Group>
                            {brand.isActive ? (
                                <Badge size="lg" color="green">
                                    Active
                                </Badge>
                            ) : (
                                <Badge size="lg" color="gray">
                                    Inactive
                                </Badge>
                            )}

                            {totalElements > 0 && (
                                <Badge
                                    size="lg"
                                    color="blue"
                                    variant="light"
                                    leftSection={<IconPackage size={14} />}
                                >
                                    {totalElements} Products
                                </Badge>
                            )}

                            <Badge
                                size="lg"
                                color="grape"
                                variant="light"
                                leftSection={<IconCalendar size={14} />}
                            >
                                Since{" "}
                                {brand.createdAt
                                    ? formatDate(brand.createdAt)
                                    : "N/A"}
                            </Badge>
                        </Group>
                    </Stack>

                    <Group gap="sm">
                        {user?.role === "ADMIN" && (
                            <Button
                                variant="filled"
                                color="green"
                                leftSection={<IconEdit size={16} />}
                                component={Link}
                                to={`/brands/${brand.id}/edit`}
                            >
                                Edit Brand
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            rightSection={<IconChevronRight size={16} />}
                            component="a"
                            href="/brands"
                        >
                            All Brands
                        </Button>
                    </Group>
                </Group>

                {/* Logo */}
                {brand.imageUrl && (
                    <Image
                        src={brand.imageUrl}
                        height={200}
                        radius="md"
                        alt={brand.name}
                        fallbackSrc="https://placehold.co/1200x300?text=Brand+Logo"
                    />
                )}

                {/* Description & Website */}
                <Paper p="md" withBorder>
                    <Stack>
                        {brand.description && (
                            <Text size="lg">{brand.description}</Text>
                        )}

                        {brand.website && (
                            <Group>
                                <IconWorld size={20} />
                                <Anchor
                                    href={brand.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {brand.website}
                                </Anchor>
                            </Group>
                        )}
                    </Stack>
                </Paper>

                {/* Products Heading */}
                <Title order={2} mt="lg">
                    Products by {brand.name}
                </Title>

                {/* Products Grid */}
                <Grid>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <Grid.Col
                                key={product.id}
                                span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                            >
                                <ProductCard
                                    product={product}
                                    showAddToCart={true}
                                />
                            </Grid.Col>
                        ))
                    ) : (
                        <Grid.Col span={12}>
                            <Text c="dimmed" ta="center" py="xl">
                                No products from this brand yet.
                            </Text>
                        </Grid.Col>
                    )}
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Group justify="center" mt="xl">
                        <Pagination
                            total={totalPages}
                            value={page + 1}
                            onChange={(value) => setPage(value - 1)}
                        />
                    </Group>
                )}
            </Stack>
        </Container>
    );
}
