import { Container, Paper, Title, Stack, Alert, Text } from "@mantine/core";
import { IconLock, IconAlertTriangle } from "@tabler/icons-react";
import { ResetPasswordForm } from "./ResetPasswordForm";

interface ResetPasswordPageProps {
    token: string;
}

export function ResetPasswordPage({ token }: ResetPasswordPageProps) {
    if (!token) {
        return (
            <Container size="sm" py="xl">
                <Paper p="xl" withBorder>
                    <Stack gap="lg" align="center">
                        <IconAlertTriangle
                            size={48}
                            color="red"
                            style={{ marginBottom: "1rem" }}
                        />
                        <Title order={2} c="red" mb="md">
                            Invalid Reset Link
                        </Title>
                        <Text size="lg" c="dimmed" ta="center">
                            This password reset link is invalid or has expired. 
                            Please request a new password reset link.
                        </Text>
                        <Alert
                            icon={<IconLock size={16} />}
                            title="What to do next"
                            color="blue"
                            variant="light"
                        >
                            <Text size="sm">
                                Go back to the login page and click "Forgot Password" 
                                to request a new reset link.
                            </Text>
                        </Alert>
                    </Stack>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="sm" py="xl">
            <Paper p="xl" withBorder>
                <Stack gap="lg">
                    <div style={{ textAlign: "center" }}>
                        <IconLock
                            size={48}
                            color="blue"
                            style={{ marginBottom: "1rem" }}
                        />
                        <Title order={2} mb="md">
                            Reset Your Password
                        </Title>
                        <Text c="dimmed">
                            Enter your new password below
                        </Text>
                    </div>

                    <ResetPasswordForm token={token} />
                </Stack>
            </Paper>
        </Container>
    );
}
