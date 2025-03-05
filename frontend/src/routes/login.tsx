import {createFileRoute, Link, redirect, useNavigate} from '@tanstack/react-router'
import {  Anchor, Paper, Container, Title, Text } from '@mantine/core';
import { userSchema } from '../domains/auth/schemas/userSchema.ts';
import {LoginFormValues} from "../types/formTypes.ts";
import { useLogin } from '../domains/auth/hooks/useLogin.ts';
import {LoginForm} from "../domains/auth/components/loginForm.tsx";
import {authStore} from "../stores/authStore.ts";
export const loginSchema = userSchema.pick({ email: true, password: true });

export const Route  = createFileRoute('/login')({
    beforeLoad: ({location}) => {
        if (authStore.getState().isAuthenticated) {
            throw redirect({ to: '/', search: {
                    redirect: location.href
                } });
        }
    },
    component: LoginPage,
})

function LoginPage() {
    const navigate = useNavigate();
    const loginMutation = useLogin({
        onSuccess: () => navigate({ to: '/' }),
        onError: () => {
            // console.error('Login failed:', error.message);
        },
    });
    const handleSubmit = (values : LoginFormValues) => {
        loginMutation.mutate(values);
        console.log(values);
    }
    return (
        <Container size="xs" mt="xl">
            <Paper radius="md" p="xl" withBorder>
                <Title order={2} ta="center" mb="md">Welcome back</Title>
                <Text c="dimmed" size="sm" ta="center" mb="xl">
                    Enter your credentials to log in
                </Text>

                <LoginForm onSubmit={handleSubmit} isLoading={loginMutation.isPending} />

                <Text ta="center" mt="md">
                    Don't have an account?{' '}
                    <Anchor component={Link} to="/register">
                        Register
                    </Anchor>
                </Text>
            </Paper>
        </Container>
    );
}
