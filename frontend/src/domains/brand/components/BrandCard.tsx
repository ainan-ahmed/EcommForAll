import { Card, Image, Text, Badge, Group, Button, Stack } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { Brand } from "../types";
import { IconPackage } from "@tabler/icons-react";

interface BrandCardProps {
    brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            component={Link}
            to={`/brands/${brand.id}`}
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <Card.Section>
                <Image
                    src={brand.imageUrl || "https://placehold.co/300x200?text=No+Image"}
                    height={160}
                    alt={brand.name}
                />
            </Card.Section>

            <Stack gap="xs" mt="md">
                <Text fw={500} size="lg">
                    {brand.name}
                </Text>

                <Text mt="xs" c="dimmed" size="sm" lineClamp={3}>
                    {brand.description || "No description available"}
                </Text>
            </Stack>

            <Group mt="auto" pt="md" justify="space-between" align="center">
                <Badge leftSection={<IconPackage size={14} />} color="blue" variant="light">
                    {brand.productCount} Products
                </Badge>

                <Button variant="light" size="xs" component="span">
                    View Details
                </Button>
            </Group>
        </Card>
    );
}
