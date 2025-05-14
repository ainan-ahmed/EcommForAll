import { Modal, TextInput, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreateWishlist } from "../hooks/useWishlist";

interface CreateWishlistModalProps {
    opened: boolean;
    onClose: () => void;
    onWishlistCreated?: (wishlistId: string) => void;
}

export function CreateWishlistModal({
    opened,
    onClose,
    onWishlistCreated,
}: CreateWishlistModalProps) {
    const createWishlistMutation = useCreateWishlist();

    // Form setup for new wishlist
    const form = useForm({
        initialValues: {
            name: "",
        },
        validate: {
            name: (value) => (!value ? "Wishlist name is required" : null),
        },
    });

    // Handle creating new wishlist
    const handleCreateWishlist = form.onSubmit(async (values) => {
        try {
            const newWishlist = await createWishlistMutation.mutateAsync(
                values.name
            );
            form.reset();
            onClose();

            // Call the callback if provided
            if (onWishlistCreated) {
                onWishlistCreated(newWishlist.id);
            }
        } catch (error: any) {
            // Error handling is already done in the useCreateWishlist hook
        }
    });

    return (
        <Modal
            opened={opened}
            onClose={onClose}
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
                    <Button variant="outline" onClick={onClose}>
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
    );
}
