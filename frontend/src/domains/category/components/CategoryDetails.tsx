import { useCategoryAndProductsByCategorySlug } from "../hooks/useCategoryAndProductsByCategorySlug";
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
} from "@mantine/core";
import { IconPackage, IconChevronRight, IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import { ProductCard } from "../../product/components/ProductCard";
import { Link } from "@tanstack/react-router";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";

interface CategoryDetailsProps {
    slug: string;
}

export function CategoryDetails({ slug }: CategoryDetailsProps) {
    const [page, setPage] = useState(0);
    const pageSize = 8;
    const { user, isAuthenticated } = useStore(authStore);
    // Use the combined hook instead of separate hooks
    const { categoryData, productsData, pagination, isLoading, isError } =
        useCategoryAndProductsByCategorySlug({
            slug,
            page,
            size: pageSize,
        });

    if (isLoading || !categoryData || !productsData) {
        return (
            <Container size="lg" py="xl">
                <Skeleton height={50} width="70%" mb="xl" />
                <Skeleton height={300} radius="md" mb="xl" />
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

    if (isError) {
        return (
            <Container size="lg" py="xl">
                <Title order={2} c="red" mb="md">
                    Error Loading Category
                </Title>
                <Text size="lg">
                    We couldn't load the category details. Please try again
                    later.
                </Text>
                <Button
                    mt="xl"
                    variant="outline"
                    component="a"
                    href="/categories"
                >
                    Return to Categories
                </Button>
            </Container>
        );
    }

    const totalProducts = pagination.totalElements;
    const totalPages = pagination.totalPages;
    return (
        <Container size="lg">
            <Stack gap="md">
                {/* Header */}
                <Group wrap="nowrap" align="flex-start" justify="space-between">
                    <Stack gap="xs">
                        <Title order={1}>{categoryData.name}</Title>
                        {totalProducts > 0 && (
                            <Group>
                                <Badge
                                    size="lg"
                                    color="blue"
                                    variant="light"
                                    leftSection={<IconPackage size={14} />}
                                >
                                    {totalProducts} Products
                                </Badge>
                            </Group>
                        )}
                    </Stack>

                    <Group gap="sm">
                        {user?.role === "ADMIN" && (
                            <Button
                                variant="filled"
                                color="green"
                                radius="md"
                                leftSection={<IconEdit size={16} />}
                                component={Link}
                                to={`/categories/${categoryData.slug}/edit`}
                            >
                                Edit Category
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            rightSection={<IconChevronRight size={16} />}
                            component="a"
                            href="/categories"
                        >
                            All Categories
                        </Button>
                    </Group>
                </Group>

                {/* Hero Image */}
                {categoryData.imageUrl && (
                    <Image
                        src={categoryData.imageUrl}
                        height={300}
                        radius="md"
                        alt={categoryData.name}
                        fallbackSrc="https://placehold.co/1200x300?text=Category+Image"
                    />
                )}

                {/* Description */}
                {categoryData.description && (
                    <Text size="lg" c="dimmed">
                        {categoryData.description}
                    </Text>
                )}

                {/* Products Heading */}
                <Title order={2}>Products in {categoryData.name}</Title>

                {/* Products Grid with real data */}
                <Grid>
                    {productsData.length > 0 ? (
                        productsData.map((product) => (
                            <Grid.Col
                                key={product.id}
                                span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                            >
                                <ProductCard
                                    product={product}
                                    showAddToCart={false}
                                />
                            </Grid.Col>
                        ))
                    ) : (
                        <Grid.Col span={12}>
                            <Text c="dimmed" ta="center" py="xl">
                                No products in this category yet.
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
                            // changing the page value, will trigger a fetch call to the backend
                            // because react query will trigger a fetch for the page value chaning in the queryKey
                            onChange={(value) => setPage(value - 1)}
                        />
                    </Group>
                )}
            </Stack>
        </Container>
    );
}
