import { Card, Stack, Group, Badge, Button, Text } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import { Wishlist } from "../types";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "@tanstack/react-router";

interface WishlistCardProps {
    wishlist: Wishlist;
}

export function WishlistCard({ wishlist }: WishlistCardProps) {
    const navigate = useNavigate();

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                cursor: "pointer",
            }}
            onClick={(e) => {
                e.preventDefault(); 
                navigate({
                    to: "/wishlists/$wishlistId",
                    params: { wishlistId: wishlist.id },
                });
            }}
        >
            <Stack gap="xs" style={{ flexGrow: 1 }}>
                <Group justify="space-between" align="center">
                    <Text fw={500} size="lg">
                        {wishlist.name}
                    </Text>
                    <IconHeart
                        size={20}
                        style={{
                            color: "var(--mantine-color-red-6)",
                        }}
                    />
                </Group>

                <Group>
                    <Badge color="blue">
                        {wishlist.products?.length || 0} items
                    </Badge>
                    <Text size="xs" c="dimmed">
                        Created{" "}
                        {formatDistanceToNow(new Date(wishlist.createdAt), {
                            addSuffix: true,
                        })}
                    </Text>
                </Group>

                <Text size="sm" c="dimmed">
                    {wishlist.products?.length
                        ? `${wishlist.products?.length} products saved in this list`
                        : "No products in this wishlist yet"}
                </Text>
            </Stack>

            <Button
                variant="light"
                color="blue"
                fullWidth
                mt="md"
                onClick={(e) => {
                    e.preventDefault();
                    navigate({
                        to: "/wishlists/$wishlistId",
                        params: { wishlistId: wishlist.id },
                    });
                }}
            >
                View Wishlist
            </Button>
        </Card>
    );
}
