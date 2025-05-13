import {
    Container,
    Title,
    Grid,
    Button,
    Paper,
    Group,
    LoadingOverlay,
    Alert,
    Modal,
    TextInput,
} from "@mantine/core";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";
import { IconPlus } from "@tabler/icons-react";
import { useUserWishlists, useCreateWishlist } from "../hooks/useWishlist";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { WishlistCard } from "./wishlistCard";
import { notifications } from "@mantine/notifications";

export function WishlistsPage() {
    const { isAuthenticated } = useStore(authStore);
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);

    // Form setup for new wishlist
    const form = useForm({
        initialValues: {
            name: "",
        },
        validate: {
            name: (value) => (!value ? "Wishlist name is required" : null),
        },
    });

    // Fetch user's wishlists
    const { data: wishlists = [], isLoading, isError } = useUserWishlists();
    console.log("Wishlists:", wishlists);
    // Create wishlist mutation
    const createWishlistMutation = useCreateWishlist();

    // Handle creating new wishlist
    const handleCreateWishlist = form.onSubmit(async (values) => {
        try {
            const newWishlist = await createWishlistMutation.mutateAsync(
                values.name
            );
            form.reset();
            close();
            navigate({ to: "/wishlists/$wishlistId", params: { wishlistId: newWishlist.id } });
        } catch (error: any) {
            notifications.show({
                title: "Error",
                message: error?.message || "Failed to create wishlist. Please try again.",
                color: "red",
            });
        }
    });

    // Check if user is authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" search={{ redirect: "/wishlists" }} />;
    }

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
                    <Grid.Col
                        key={wishlist.id}
                        span={{ base: 12, sm: 6, md: 4 }}
                    >
                        <WishlistCard wishlist={wishlist} />
                    </Grid.Col>
                ))}
            </Grid>

            {/* Create Wishlist Modal */}
            <Modal
                opened={opened}
                onClose={close}
                title="Create New Wishlist"
                centered
            >
                <form onSubmit={handleCreateWishlist}>
                    <TextInput
                        label="Wishlist Name"
                        placeholder="Enter a name for your wishlist"
                        required
                        {...form.getInputProps("name")}
                        data-autofocus
                        mb="md"
                    />
                    <Group justify="flex-end" mt="md">
                        <Button variant="outline" onClick={close}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={createWishlistMutation.isPending}
                        >
                            Create
                        </Button>
                    </Group>
                </form>
            </Modal>
        </Container>
    );
}
