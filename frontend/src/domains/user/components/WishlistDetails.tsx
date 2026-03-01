import {
    Container,
    Title,
    Grid,
    Text,
    Button,
    Paper,
    Group,
    Card,
    Image,
    Badge,
    Stack,
    LoadingOverlay,
    Alert,
    Breadcrumbs,
    Anchor,
    Modal, // Add this import
} from "@mantine/core";
import { Navigate, useNavigate, Link } from "@tanstack/react-router";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";
import { IconShoppingCart, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useWishlistById, useRemoveFromWishlist, useDeleteWishlist } from "../hooks/useWishlist";
// Remove this import: import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks"; // Add this import

interface WishlistDetailsProps {
    wishlistId: string;
}

export function WishlistDetails({ wishlistId }: WishlistDetailsProps) {
    const { isAuthenticated } = useStore(authStore);
    const navigate = useNavigate();

    // Add state for delete confirmation modal
    const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] =
        useDisclosure(false);

    // Fetch the specific wishlist details using ID from URL
    const {
        data: wishlist,
        isLoading: isLoadingWishlist,
        isError: isWishlistError,
    } = useWishlistById(wishlistId);

    // Remove from wishlist mutation
    const removeFromWishlistMutation = useRemoveFromWishlist(wishlistId);

    // Delete wishlist mutation
    const deleteWishlistMutation = useDeleteWishlist();

    // Handle removing product from wishlist
    const handleRemoveFromWishlist = (productId: string) => {
        if (wishlistId) {
            removeFromWishlistMutation.mutate(productId);
        }
    };

    // Handle adding product to cart
    const handleAddToCart = (product: any) => {
        // You would implement your cart logic here
        notifications.show({
            title: "Added to Cart",
            message: `${product.name} added to your cart`,
            color: "green",
        });
    };

    const confirmDeleteWishlist = () => {
        console.log("Deleting wishlist with ID:", wishlistId);
        deleteWishlistMutation.mutate(wishlistId, {
            onSuccess: () => {
                closeDeleteModal();
                navigate({ to: "/wishlists" });
            },
        });
    };

    // Check if user is authenticated
    if (!isAuthenticated) {
        notifications.show({
            title: "Authentication Required",
            message: "Please log in to access your wishlist",
            color: "red",
        });
        return <Navigate to="/login" search={{ redirect: `/wishlist/${wishlistId}` }} />;
    }

    // Loading state
    if (isLoadingWishlist) {
        return (
            <Container size="xl" py="xl">
                <Paper p="xl" withBorder>
                    <LoadingOverlay visible={true} />
                    <div style={{ height: "300px" }}></div>
                </Paper>
            </Container>
        );
    }

    // No wishlist available
    if (!wishlist) {
        return (
            <Container size="xl" py="xl">
                <Title order={2} mb="xl">
                    Wishlist Not Found
                </Title>
                <Paper p="xl" withBorder ta="center">
                    <Text size="lg" mb="md">
                        This wishlist doesn't exist or you don't have access to it
                    </Text>
                    <Button onClick={() => navigate({ to: "/wishlists" })}>
                        Back to My Wishlists
                    </Button>
                </Paper>
            </Container>
        );
    }

    // Error state
    if (isWishlistError) {
        return (
            <Container size="xl" py="xl">
                <Alert color="red" title="Error">
                    Failed to load wishlist. Please try again later.
                </Alert>
            </Container>
        );
    }

    // Empty wishlist
    if (wishlist.products.length === 0) {
        return (
            <Container size="xl" py="xl">
                <Group justify="space-between" mb="xl">
                    <Breadcrumbs mb="xl">
                        <Anchor component={Link} to="/wishlists">
                            My Wishlists
                        </Anchor>
                        <Text>{wishlist.name}</Text>
                    </Breadcrumbs>
                    <Button
                        variant="outline"
                        color="red"
                        leftSection={<IconTrash size={16} />}
                        onClick={openDeleteModal}
                        loading={deleteWishlistMutation.isPending}
                    >
                        Delete Wishlist
                    </Button>
                </Group>

                <Title order={2} mb="xl">
                    {wishlist.name}
                </Title>

                <Paper p="xl" withBorder ta="center">
                    <Text size="lg" mb="md">
                        This wishlist is empty
                    </Text>
                    <Button onClick={() => navigate({ to: "/products" })}>Browse Products</Button>
                </Paper>

                {/* Add the modal here */}
                <Modal
                    opened={deleteModalOpen}
                    onClose={closeDeleteModal}
                    title="Delete Wishlist"
                    centered
                >
                    <Text size="sm" mb="lg">
                        Are you sure you want to delete the wishlist "{wishlist?.name}"? This action
                        cannot be undone.
                    </Text>

                    <Group justify="flex-end">
                        <Button variant="outline" onClick={closeDeleteModal}>
                            Cancel
                        </Button>
                        <Button
                            color="red"
                            onClick={confirmDeleteWishlist}
                            loading={deleteWishlistMutation.isPending}
                        >
                            Delete
                        </Button>
                    </Group>
                </Modal>
            </Container>
        );
    }

    return (
        <Container size="xl" py="xl">
            <Breadcrumbs mb="xl">
                <Anchor component={Link} to="/wishlists">
                    My Wishlists
                </Anchor>
                <Text>{wishlist.name}</Text>
            </Breadcrumbs>

            <Group justify="space-between" mb="xl">
                <Group>
                    <Title order={2}>{wishlist.name}</Title>
                    <Text c="dimmed" size="sm">
                        {wishlist.products.length}{" "}
                        {wishlist.products.length === 1 ? "item" : "items"}
                    </Text>
                </Group>

                <Button
                    variant="outline"
                    color="red"
                    leftSection={<IconTrash size={16} />}
                    onClick={openDeleteModal}
                    loading={deleteWishlistMutation.isPending}
                >
                    Delete Wishlist
                </Button>
            </Group>

            <Grid>
                {wishlist.products.map((product) => (
                    <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            {/* Product Image */}
                            <Card.Section component={Link} to={`/products/${product.id}`}>
                                <Image
                                    src={
                                        product.primaryImage?.imageUrl ||
                                        "https://placehold.co/300x200?text=No+Image"
                                    }
                                    height={200}
                                    alt={product.name}
                                />
                            </Card.Section>

                            {/* Product Info */}
                            <Stack mt="md" gap="xs">
                                <Text fw={500} component={Link} to={`/products/${product.id}`}>
                                    {product.name}
                                </Text>

                                <Group justify="space-between">
                                    <Badge color="blue" variant="light">
                                        ${product.minPrice.toFixed(2)}
                                    </Badge>
                                    <Badge
                                        color={product.isActive ? "green" : "red"}
                                        variant="light"
                                    >
                                        {product.isActive ? "In Stock" : "Out of Stock"}
                                    </Badge>
                                </Group>

                                <Text size="sm" color="dimmed">
                                    SKU: {product.sku}
                                </Text>

                                <Group grow mt="md">
                                    <Button
                                        variant="light"
                                        color="blue"
                                        leftSection={<IconShoppingCart size={16} />}
                                        onClick={() => handleAddToCart(product)}
                                        disabled={!product.isActive}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant="light"
                                        color="red"
                                        leftSection={<IconTrash size={16} />}
                                        onClick={() => handleRemoveFromWishlist(product.id)}
                                        loading={removeFromWishlistMutation.isPending}
                                    >
                                        Remove
                                    </Button>
                                </Group>
                            </Stack>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>

            {/* Delete confirmation modal */}
            <Modal
                opened={deleteModalOpen}
                onClose={closeDeleteModal}
                title="Delete Wishlist"
                centered
            >
                <Text size="sm" mb="lg">
                    Are you sure you want to delete the wishlist "{wishlist?.name}"? This action
                    cannot be undone.
                </Text>

                <Group justify="flex-end">
                    <Button variant="outline" onClick={closeDeleteModal}>
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        onClick={confirmDeleteWishlist}
                        loading={deleteWishlistMutation.isPending}
                    >
                        Delete
                    </Button>
                </Group>
            </Modal>
        </Container>
    );
}
