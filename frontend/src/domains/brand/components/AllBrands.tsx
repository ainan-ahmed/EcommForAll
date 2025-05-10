import { useEffect, useState } from "react";
import {
    Container,
    Title,
    Grid,
    TextInput,
    Group,
    Button,
    Paper,
    Pagination,
    Flex,
    Select,
    Stack,
    Skeleton,
    Text,
    ActionIcon,
} from "@mantine/core";
import { IconSearch, IconSquarePlus, IconX } from "@tabler/icons-react";
import { useBrands } from "../hooks/useBrands";
import { BrandCard } from "./BrandCard";
import { useDebouncedValue } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";

export function AllBrands() {
    // Pagination and sorting state
    const [page, setPage] = useState(0);
    const [pageSize] = useState(12);
    const [sortBy, setSortBy] = useState("name,asc");
    const [nameSearch, setNameSearch] = useState("");
    const [debouncedNameSearch] = useDebouncedValue(nameSearch, 500);

    // Auth state to check if user can create brands
    const { user, isAuthenticated } = useStore(authStore);
    const canCreateBrand =
        isAuthenticated && (user?.role === "ADMIN" || user?.role === "SELLER");

    // Fetch brands with filters
    const { data, isLoading, isError } = useBrands({
        page,
        size: pageSize,
        sort: sortBy,
        // If your API supports name search, you'd add this parameter
        // name: debouncedNameSearch
    });

    const brands = data?.content || [];
    const totalPages = data?.totalPages || 0;

    // Reset to first page when filters change
    useEffect(() => {
        setPage(0);
    }, [debouncedNameSearch, sortBy]);

    // Sort options
    const sortOptions = [
        { value: "name,asc", label: "Name (A-Z)" },
        { value: "name,desc", label: "Name (Z-A)" },
        { value: "createdAt,desc", label: "Newest" },
        { value: "createdAt,asc", label: "Oldest" },
    ];

    // Loading skeletons
    const BrandSkeletons = () => (
        <>
            {Array.from({ length: pageSize }).map((_, index) => (
                <Grid.Col key={index} span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                    <Skeleton height={320} radius="md" />
                </Grid.Col>
            ))}
        </>
    );

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="xl">
                <Title order={2}>Brands</Title>

                {canCreateBrand && (
                    <Button
                        component={Link}
                        to="/brands/new"
                        leftSection={<IconSquarePlus size={20} />}
                    >
                        Create Brand
                    </Button>
                )}
            </Group>

            <Paper p="md" withBorder mb="xl">
                <Group>
                    <TextInput
                        placeholder="Search brands..."
                        style={{ flex: 1 }}
                        value={nameSearch}
                        onChange={(e) => setNameSearch(e.target.value)}
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
                        placeholder="Sort by"
                        data={sortOptions}
                        value={sortBy}
                        onChange={(value) => setSortBy(value || "name,asc")}
                        style={{ width: "180px" }}
                    />
                </Group>
            </Paper>

            {isError ? (
                <Paper p="xl" withBorder>
                    <Stack align="center">
                        <Text c="red" fw={500} size="lg">
                            Failed to load brands
                        </Text>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </Stack>
                </Paper>
            ) : (
                <Grid>
                    {isLoading ? (
                        <BrandSkeletons />
                    ) : brands.length === 0 ? (
                        <Grid.Col span={12}>
                            <Paper p="xl" withBorder ta="center">
                                <Text size="lg" fw={500}>
                                    No brands found
                                </Text>
                                {nameSearch && (
                                    <Button
                                        mt="md"
                                        onClick={() => setNameSearch("")}
                                    >
                                        Clear Search
                                    </Button>
                                )}
                            </Paper>
                        </Grid.Col>
                    ) : (
                        brands.map((brand) => (
                            <Grid.Col
                                key={brand.id}
                                span={{ base: 12, xs: 6, sm: 4, md: 3 }}
                            >
                                <BrandCard brand={brand} />
                            </Grid.Col>
                        ))
                    )}
                </Grid>
            )}

            {totalPages > 1 && (
                <Flex justify="center" mt="xl">
                    <Pagination
                        total={totalPages}
                        value={page + 1}
                        onChange={(newPage) => setPage(newPage - 1)}
                        withEdges
                    />
                </Flex>
            )}
        </Container>
    );
}
