import { Card, Image, Text, Group, Badge } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { Category } from "../types";

interface CategoryCardProps {
    category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Card
            component={Link}
            to={`/categories/${category.slug}`}
            shadow="sm"
            padding="md"
            radius="md"
            withBorder
        >
            <Card.Section>
                <Image
                    src={category.imageUrl || "https://placehold.co/600x400?text=Category"}
                    height={160}
                    alt={category.name}
                />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{category.name}</Text>
                <Badge color="blue" variant="dark">
                    {category.productCount} products
                </Badge>
            </Group>

            <Text size="sm" c="dimmed" lineClamp={2}>
                {category.description || `Browse our collection of ${category.name}`}
            </Text>
        </Card>
    );
}
