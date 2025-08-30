import { useForm, zodResolver } from "@mantine/form";
import { TextInput, Button, Stack, Text } from "@mantine/core";
import { IconMail, IconArrowLeft } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { ForgotPasswordFormValues } from "../types";
import { forgotPasswordSchema } from "../schemas/userSchema";
import { useForgotPassword } from "../hooks/useForgotPassword";

interface ForgotPasswordFormProps {
    onSuccess?: () => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
    const form = useForm<ForgotPasswordFormValues>({
        initialValues: {
            email: "",
        },
        validate: zodResolver(forgotPasswordSchema),
    });

    const forgotPasswordMutation = useForgotPassword({
        onSuccess: () => {
            onSuccess?.();
        },
    });

    const handleSubmit = (values: ForgotPasswordFormValues) => {
        forgotPasswordMutation.mutate(values);
    };

    return (
        <Stack gap="md">
            <Text size="lg" fw={500} ta="center">
                Forgot your password?
            </Text>
            
            <Text size="sm" c="dimmed" ta="center">
                Enter your email address and we'll send you a link to reset your password.
            </Text>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <TextInput
                        label="Email Address"
                        placeholder="Enter your email"
                        leftSection={<IconMail size={16} />}
                        required
                        {...form.getInputProps("email")}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        loading={forgotPasswordMutation.isPending}
                        disabled={forgotPasswordMutation.isPending}
                    >
                        Send Reset Link
                    </Button>
                </Stack>
            </form>

            <Button
                variant="subtle"
                component={Link}
                to="/login"
                leftSection={<IconArrowLeft size={16} />}
                fullWidth
            >
                Back to Login
            </Button>
        </Stack>
    );
}
