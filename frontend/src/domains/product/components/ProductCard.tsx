import { Badge, Button, Card, Group, Stack, Image, Text } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Product } from "../types";


interface ProductCardProps {
    product: Product ;
    showAddToCart?: boolean;
}
export function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
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
            <Stack justify="space-between">
                <Text fw={500} mt="md" lineClamp={1}>
                    {product.name}
                </Text>
                <Group justify="space-between" mt="md">
                    <Text fw={700} size="lg">
                        {product.variants &&
                            product.variants.length > 1 &&
                            "from "}
                        ${product.minPrice.toFixed(2)}
                    </Text>
                    <Button
                        variant="light"
                        // compact
                        leftSection={<IconShoppingCart size={16} />}
                    >
                        View
                    </Button>
                </Group>

                {product.variants && product.variants.length > 1 && (
                    <Badge mt="xs" size="sm">
                        {product.variants.length} variants
                    </Badge>
                )}
            </Stack>
        </Card>
    );
}