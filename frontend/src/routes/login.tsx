import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { LoginFormValues } from "../domains/auth/types.ts";
import { useLogin } from "../domains/auth/hooks/useLogin.ts";
import { LoginForm } from "../domains/auth/components/loginForm.tsx";
import { authStore } from "../stores/authStore.ts";
import { Anchor, Container, Paper, Title, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export const Route = createFileRoute("/login")({
    beforeLoad: ({ location }) => {
        if (authStore.getState().isAuthenticated) {
            throw redirect({
                to: "/",
                search: {
                    redirect: location.href,
                },
                replace: true,
            });
        }
    },
    component: LoginPage,
});

export function LoginPage() {
    const navigate = useNavigate();
    const loginMutation = useLogin({
        onSuccess: () => {
            const searchParams = new URLSearchParams(window.location.search);
            const redirectUrl = searchParams.get("redirect");
            if (redirectUrl) {
                navigate({
                    to: redirectUrl,
                    replace: true,
                });
            } else {
                navigate({ to: "/", replace: true });
            }
        },
        onError: () => {
            notifications.show({
                title: "Login Failed",
                message: "Invalid username or password",
                color: "red",
            });
        },
    });
    const handleSubmit = (values: LoginFormValues) => {
        loginMutation.mutate(values);
        // console.log(values);
    };
    return (
        <Container size="xs" mt="xl">
            <Paper radius="md" p="xl" withBorder>
                <Title order={2} ta="center" mb="md">
                    Welcome back
                </Title>
                <Text c="dimmed" size="sm" ta="center" mb="xl">
                    Enter your credentials to log in
                </Text>

                <LoginForm onSubmit={handleSubmit} isLoading={loginMutation.isPending} />

                <Text ta="center" mt="md">
                    Don't have an account?{" "}
                    <Anchor component={Link} to="/register">
                        Register
                    </Anchor>
                </Text>
            </Paper>
        </Container>
    );
}
