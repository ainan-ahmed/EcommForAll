import { useForm, zodResolver } from "@mantine/form";
import { PasswordInput, Button, Stack, Text } from "@mantine/core";
import { IconLock, IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ResetPasswordFormValues } from "../types";
import { resetPasswordSchema } from "../schemas/userSchema";
import { useResetPassword } from "../hooks/useResetPassword";

interface ResetPasswordFormProps {
    token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const navigate = useNavigate();

    const form = useForm<ResetPasswordFormValues>({
        initialValues: {
            token,
            newPassword: "",
            confirmPassword: "",
        },
        validate: zodResolver(resetPasswordSchema),
    });

    const resetPasswordMutation = useResetPassword({
        onSuccess: () => {
            // Redirect to login page after successful password reset
            setTimeout(() => {
                navigate({ to: "/login" });
            }, 2000);
        },
    });

    const handleSubmit = (values: ResetPasswordFormValues) => {
        resetPasswordMutation.mutate(values);
    };

    return (
        <Stack gap="md">
            <Text size="lg" fw={500} ta="center">
                Reset Your Password
            </Text>

            <Text size="sm" c="dimmed" ta="center">
                Enter your new password below.
            </Text>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <PasswordInput
                        label="New Password"
                        placeholder="Enter your new password"
                        leftSection={<IconLock size={16} />}
                        required
                        {...form.getInputProps("newPassword")}
                    />

                    <PasswordInput
                        label="Confirm New Password"
                        placeholder="Confirm your new password"
                        leftSection={<IconLock size={16} />}
                        required
                        {...form.getInputProps("confirmPassword")}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        leftSection={<IconCheck size={16} />}
                        loading={resetPasswordMutation.isPending}
                        disabled={resetPasswordMutation.isPending}
                    >
                        Reset Password
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
