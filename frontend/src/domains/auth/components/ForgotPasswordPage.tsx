import { Container, Paper, Title, Stack, Alert, Text } from "@mantine/core";
import { IconMail, IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export function ForgotPasswordPage() {
    const [isEmailSent, setIsEmailSent] = useState(false);

    const handleSuccess = () => {
        setIsEmailSent(true);
    };

    if (isEmailSent) {
        return (
            <Container size="sm" py="xl">
                <Paper p="xl" withBorder>
                    <Stack gap="lg" align="center">
                        <div style={{ textAlign: "center" }}>
                            <IconCheck
                                size={48}
                                color="green"
                                style={{ marginBottom: "1rem" }}
                            />
                            <Title order={2} mb="md">
                                Check Your Email
                            </Title>
                            <Text size="lg" c="dimmed" mb="lg">
                                We've sent a password reset link to your email address.
                            </Text>
                            <Alert
                                icon={<IconMail size={16} />}
                                title="Important"
                                color="blue"
                                variant="light"
                            >
                                <Text size="sm">
                                    If you don't see the email, check your spam folder. 
                                    The link will expire in 24 hours.
                                </Text>
                            </Alert>
                        </div>
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
                        <Title order={2} mb="md">
                            Forgot Password
                        </Title>
                        <Text c="dimmed">
                            Enter your email to receive a password reset link
                        </Text>
                    </div>

                    <ForgotPasswordForm onSuccess={handleSuccess} />
                </Stack>
            </Paper>
        </Container>
    );
}
