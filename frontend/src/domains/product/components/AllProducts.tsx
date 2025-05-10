import { useEffect, useRef, useState } from "react";
import {
    Container,
    Grid,
    Text,
    Badge,
    Group,
    Title,
    Select,
    TextInput,
    RangeSlider,
    Pagination,
    Paper,
    Skeleton,
    Stack,
    Button,
    Drawer,
    useMantineTheme,
    Flex,
    ActionIcon,
} from "@mantine/core";
import {
    useDebouncedValue,
    useDisclosure,
    useMediaQuery,
} from "@mantine/hooks";
import {
    IconSearch,
    IconAdjustments,
    IconX,
    IconChevronRight,
    IconSquarePlus,
} from "@tabler/icons-react";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../../category/hooks/useCategories";
import { ProductCard } from "./ProductCard";
import { Product } from "../types";

export function AllProducts() {
    const searchInputRef = useRef<HTMLInputElement>(null);

    // State for filters and pagination
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(12);
    const [sortBy, setSortBy] = useState("createdAt,desc");
    const [nameSearch, setNameSearch] = useState("");
    const [debouncedNameSearch, setDebouncedNameSearch] = useDebouncedValue(
        nameSearch,
        500
    );

    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [
        filtersDrawerOpened,
        { open: openFiltersDrawer, close: closeFiltersDrawer },
    ] = useDisclosure(false);

    // Media queries for responsive design
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

    // Fetch categories for filter dropdown
    const { data: categoriesData } = useCategories({
        page: 0,
        size: 100,
    });
    const categories = categoriesData?.content || [];

    // Compute query parameters for product API
    const queryParams = {
        page,
        size: pageSize,
        sort: sortBy,
        name: debouncedNameSearch,
        categoryId: selectedCategory || undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
    };

    // Fetch products based on filters and pagination
    const { data, isLoading, isError, error } = useProducts(queryParams);
    const products = data?.content || [];
    const totalPages = data?.totalPages || 0;

    // Reset to first page when filters change
    useEffect(() => {
        setPage(0);
    }, [nameSearch, selectedCategory, priceRange, sortBy]);

    // Sort options
    const sortOptions = [
        { value: "createdAt,desc", label: "Newest" },
        { value: "minPrice,asc", label: "Price: Low to High" },
        { value: "minPrice,desc", label: "Price: High to Low" },
        { value: "name,asc", label: "Name: A to Z" },
        { value: "name,desc", label: "Name: Z to A" },
    ];

    // Filter panel component - shared between sidebar and drawer
    const FilterPanel = () => (
        <Stack gap="md">
            <Title order={4}>Filters</Title>

            <TextInput
                ref={searchInputRef}
                label="Search"
                placeholder="Search products..."
                value={nameSearch}
                onChange={(e) => {
                    setNameSearch(e.target.value);
                    setTimeout(() => {
                        searchInputRef.current?.focus();
                    }, 0);
                }}
                rightSection={
                    nameSearch ? (
                        <ActionIcon onClick={() => setNameSearch("")}>
                            <IconX size={16} />
                        </ActionIcon>
                    ) : (
                        <IconSearch size={16} />
                    )
                }
            />

            <Select
                label="Category"
                placeholder="All Categories"
                data={[
                    { value: "", label: "All Categories" },
                    ...categories.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                    })),
                ]}
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value || "")}
                searchable
                clearable
            />

            <Stack gap="xs">
                <Text size="sm" fw={500}>
                    Price Range
                </Text>
                <RangeSlider
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onChange={setPriceRange}
                    marks={[
                        { value: 0, label: "$0" },
                        { value: 500, label: "$500" },
                        { value: 1000, label: "$1000+" },
                    ]}
                />
                <Group justify="space-between">
                    <Text size="sm">${priceRange[0]}</Text>
                    <Text size="sm">
                        ${priceRange[1] === 1000 ? "1000+" : priceRange[1]}
                    </Text>
                </Group>
            </Stack>

            {isMobile && (
                <Button onClick={closeFiltersDrawer} mt="xl">
                    Apply Filters
                </Button>
            )}
        </Stack>
    );

    // Loading skeletons for products
    const ProductSkeletons = () => (
        <>
            {Array.from({ length: pageSize }).map((_, i) => (
                <Grid.Col key={i} span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                    <Skeleton height={300} radius="md" />
                </Grid.Col>
            ))}
        </>
    );

    // Render product grid with the reusable ProductCard component
    const renderProducts = (items: Product[]) => {
        if (isLoading) return <ProductSkeletons />;

        if (items.length === 0) {
            return (
                <Grid.Col span={12}>
                    <Paper p="xl" withBorder ta="center">
                        <Title order={3} mb="md">
                            No Products Found
                        </Title>
                        <Text>Try adjusting your filters or search query</Text>
                        <Button
                            mt="lg"
                            onClick={() => {
                                setNameSearch("");
                                setSelectedCategory("");
                                setPriceRange([0, 1000]);
                                setSortBy("createdAt,desc");
                            }}
                        >
                            Clear All Filters
                        </Button>
                    </Paper>
                </Grid.Col>
            );
        }

        return items.map((product) => (
            <Grid.Col
                key={product.id}
                span={
                    isMobile
                        ? { base: 6, xs: 6, sm: 6 }
                        : { base: 12, xs: 6, sm: 4, md: 3 }
                }
            >
                <ProductCard product={product} showAddToCart={true} />
            </Grid.Col>
        ));
    };

    // Error state
    if (isError) {
        return (
            <Container size="xl" py="xl">
                <Paper p="xl" withBorder>
                    <Title order={3} c="red">
                        Error Loading Products
                    </Title>
                    <Text mt="md">
                        We couldn't load the products. Please try again later.
                        {error instanceof Error && (
                            <Text size="sm" mt="xs" fs="italic">
                                Error details: {error.message}
                            </Text>
                        )}
                    </Text>
                    <Button mt="lg" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="xl">
                <Title order={2} mb="lg">
                    All Products
                </Title>
                <Button
                    variant="secondary"
                    rightSection={<IconSquarePlus size={16} />}
                    component="a"
                    href="/products/new"
                >
                    Create Product
                </Button>
            </Group>

            {/* Filters and Sort */}
            <Grid mb="xl">
                {/* Mobile filter button */}
                {isMobile && (
                    <Grid.Col span={12}>
                        <Group justify="space-between">
                            <Button
                                leftSection={<IconAdjustments size={16} />}
                                variant="outline"
                                onClick={openFiltersDrawer}
                            >
                                Filters
                            </Button>

                            <Select
                                placeholder="Sort by"
                                data={sortOptions}
                                value={sortBy}
                                onChange={(value) =>
                                    setSortBy(value || "createdAt,desc")
                                }
                                style={{ width: "180px" }}
                            />
                        </Group>
                    </Grid.Col>
                )}

                {/* Desktop layout with sidebar */}
                {!isMobile && (
                    <>
                        <Grid.Col span={3}>
                            <Paper p="md" withBorder>
                                <FilterPanel />
                            </Paper>
                        </Grid.Col>

                        <Grid.Col span={9}>
                            <Group justify="space-between" mb="md">
                                <Text>
                                    {data?.totalElements || 0} Products found
                                </Text>
                                <Select
                                    placeholder="Sort by"
                                    data={sortOptions}
                                    value={sortBy}
                                    onChange={(value) =>
                                        setSortBy(value || "createdAt,desc")
                                    }
                                    style={{ width: "180px" }}
                                />
                            </Group>

                            <Grid>{renderProducts(products)}</Grid>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Flex justify="center" mt="xl">
                                    <Pagination
                                        total={totalPages}
                                        value={page + 1}
                                        onChange={(newPage) =>
                                            setPage(newPage - 1)
                                        }
                                        withEdges
                                    />
                                </Flex>
                            )}
                        </Grid.Col>
                    </>
                )}

                {/* Mobile layout - just products */}
                {isMobile && (
                    <Grid.Col span={12}>
                        <Grid>{renderProducts(products)}</Grid>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Flex justify="center" mt="xl">
                                <Pagination
                                    total={totalPages}
                                    value={page + 1}
                                    onChange={(newPage) => setPage(newPage - 1)}
                                    withEdges
                                    size="sm"
                                />
                            </Flex>
                        )}
                    </Grid.Col>
                )}
            </Grid>

            {/* Mobile filters drawer */}
            <Drawer
                opened={filtersDrawerOpened}
                onClose={closeFiltersDrawer}
                title="Filters"
                padding="md"
                position="right"
                size="80%"
            >
                <FilterPanel />
            </Drawer>
        </Container>
    );
}
