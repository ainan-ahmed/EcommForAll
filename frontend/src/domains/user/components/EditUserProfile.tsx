import {
    Container,
    Title,
    Paper,
    TextInput,
    Button,
    Group,
    Stack,
    LoadingOverlay,
    Alert,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { updateUserProfile } from "../api/userApi"; // You'll need to create this API function

// Define the validation schema
const profileSchema = z.object({
    id: z.string().uuid("Invalid user ID"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be less than 30 characters")
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores"
        ),
    email: z.string().email("Please enter a valid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function EditUserProfile() {
    const { user, setUser } = useStore(authStore);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Initialize the form with current user data
    const form = useForm<ProfileFormValues>({
        initialValues: {
            id: user?.id || "",
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            username: user?.username || "",
            email: user?.email || "",
        },
        validate: zodResolver(profileSchema),
    });

    // Handle form submission
    const handleSubmit = async (values: ProfileFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const updatedUser = await updateUserProfile(values);

            // Update user data in the auth store
            setUser(updatedUser);

            notifications.show({
                title: "Profile Updated",
                message: "Your profile has been successfully updated",
                color: "green",
            });

            navigate({ to: "/profile" });
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to update profile. Please try again.";

            setError(errorMessage);
            notifications.show({
                title: "Update Failed",
                message: errorMessage,
                color: "red",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate({ to: "/profile" });
    };

    if (!user) {
        return (
            <Container size="md" py="xl">
                <Alert color="red" title="Error">
                    User data not available. Please try again.
                </Alert>
            </Container>
        );
    }

    return (
        <Container size="md" py="xl">
            <Title order={2} mb="xl">
                Edit Profile
            </Title>

            <Paper p="xl" withBorder pos="relative">
                <LoadingOverlay visible={isLoading} />
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        {error && (
                            <Alert
                                color="red"
                                title="Error"
                                withCloseButton
                                onClose={() => setError(null)}
                            >
                                {error}
                            </Alert>
                        )}

                        <TextInput
                            label="First Name"
                            placeholder="Enter your first name"
                            required
                            {...form.getInputProps("firstName")}
                        />

                        <TextInput
                            label="Last Name"
                            placeholder="Enter your last name"
                            required
                            {...form.getInputProps("lastName")}
                        />

                        <TextInput
                            label="Username"
                            placeholder="Enter your username"
                            required
                            {...form.getInputProps("username")}
                        />

                        <TextInput
                            label="Email"
                            placeholder="Enter your email address"
                            required
                            type="email"
                            {...form.getInputProps("email")}
                        />

                        <Group justify="flex-end" mt="md">
                            <Button variant="default" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" loading={isLoading}>
                                Save Changes
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
