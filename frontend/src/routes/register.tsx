import {createFileRoute, redirect, useNavigate} from '@tanstack/react-router'
import {authStore} from "../stores/authStore.ts";
import {Container, Paper, Text, Title} from "@mantine/core";
import {RegisterFormValues} from "../types/formTypes.ts";
import {RegisterForm} from "../domains/auth/components/RegisterForm.tsx";
import {useRegister} from "../domains/auth/hooks/useRegister.ts";

export const Route = createFileRoute('/register')({
    beforeLoad: ({location}) => {
        if (authStore.getState().isAuthenticated) {
            throw redirect({
                to: '/', search: {
                    redirect: location.href
                }
            });
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate();
    const registerMutation = useRegister({
        onSuccess: () => {
            const searchParams = new URLSearchParams(window.location.search);
            const redirectUrl = searchParams.get('redirect');
            if (redirectUrl) {
                navigate({
                    to: redirectUrl,
                    replace: true
                });
            } else {
                navigate({ to: '/' });
            }
        },
        onError: () => {
            // console.error('Login failed:', error.message);
        },
    });
    const handleSubmit = (values: RegisterFormValues) => {
        registerMutation.mutate(values);
        console.log(values);
    }
    return (
        <Container size="xs" mt="xl">
            <Paper radius="md" p="xl" withBorder>
                <Title order={2} ta="center" mb="md">Welcome to ecommForAll</Title>
                <Text c="dimmed" size="sm" ta="center" mb="xl">
                    Enter your credentials to register
                </Text>

                <RegisterForm onSubmit={handleSubmit} isLoading={registerMutation.isPending}/>

            </Paper>
        </Container>
    )
}
