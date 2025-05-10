import {
    Container,
    Title,
    Text,
    Grid,
    Group,
    Pagination,
    Button,
} from "@mantine/core";
import { useState } from "react";
import { CategoryCard } from "./CategoryCard.tsx";
import { useCategories } from "../hooks/useCategories.ts";
import { IconSquarePlus } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";

export function AllCategories() {
    const [page, setPage] = useState(0);
    const { data, isLoading } = useCategories({ page, size: 12 });
    const { user, isAuthenticated } = useStore(authStore);
    const canCreateCategory = isAuthenticated || user?.role === "ADMIN";

    return (
        <Container size="lg" py="xl">
            <Group justify="space-between" mb="lg">
                <Title order={2}>All Categories</Title>

                {canCreateCategory && (
                    <Button
                        component={Link}
                        to="/categories/new"
                        leftSection={<IconSquarePlus size={20} />}
                    >
                        Create Category
                    </Button>
                )}
            </Group>

            {isLoading ? (
                <Text>Loading categories...</Text>
            ) : data ? (
                <>
                    <Grid>
                        {data?.content.map((category) => (
                            <Grid.Col
                                key={category.id}
                                span={{ base: 12, md: 6, lg: 4 }}
                            >
                                <CategoryCard category={category} />
                            </Grid.Col>
                        ))}
                    </Grid>

                    <Group justify="center" mt="xl">
                        <Pagination
                            total={data.totalPages | 0}
                            value={page + 1}
                            onChange={(newPage) => setPage(newPage - 1)}
                        />
                    </Group>
                </>
            ) : (
                <Text>No categories found</Text>
            )}
        </Container>
    );
}
