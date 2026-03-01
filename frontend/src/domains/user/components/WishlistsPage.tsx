import { Container, Title, Grid, Button, Paper, Group, LoadingOverlay, Alert } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { IconPlus } from "@tabler/icons-react";
import { useUserWishlists } from "../hooks/useWishlist";
import { useDisclosure } from "@mantine/hooks";
import { WishlistCard } from "./wishlistCard";
import { CreateWishlistModal } from "./CreateWishlistModal";

export function WishlistsPage() {
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);

    // Fetch user's wishlists
    const { data: wishlists = [], isLoading, isError } = useUserWishlists();

    const handleWishlistCreated = (wishlistId: string) => {
        navigate({ to: "/wishlists/$wishlistId", params: { wishlistId } });
    };

    // Loading state
    if (isLoading) {
        return (
            <Container size="xl" py="xl">
                <Paper p="xl" withBorder>
                    <LoadingOverlay visible={true} />
                    <div style={{ height: "300px" }}></div>
                </Paper>
            </Container>
        );
    }

    // Error state
    if (isError) {
        return (
            <Container size="xl" py="xl">
                <Alert color="red" title="Error">
                    Failed to load wishlists. Please try again later.
                </Alert>
            </Container>
        );
    }

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="xl">
                <Title order={2}>My Wishlists</Title>
                <Button leftSection={<IconPlus size={16} />} onClick={open}>
                    New Wishlist
                </Button>
            </Group>

            <Grid>
                {wishlists.map((wishlist) => (
                    <Grid.Col key={wishlist.id} span={{ base: 12, sm: 6, md: 4 }}>
                        <WishlistCard wishlist={wishlist} />
                    </Grid.Col>
                ))}
            </Grid>

            {/* Use the new reusable modal component */}
            <CreateWishlistModal
                opened={opened}
                onClose={close}
                onWishlistCreated={handleWishlistCreated}
            />
        </Container>
    );
}
