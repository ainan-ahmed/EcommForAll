import {
    Anchor,
    Button,
    Group,
    Loader,
    PasswordInput,
    TextInput,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { LoginFormValues } from "../types.ts";
import { loginSchema } from "../schemas/userSchema.ts";
import { useForm, zodResolver } from "@mantine/form";

interface LoginFormProps {
    onSubmit: (values: LoginFormValues) => void;
    isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
    const form = useForm<LoginFormValues>({
        initialValues: { username: "", password: "" },
        validate: zodResolver(loginSchema),
    });

    return !isLoading ? (
        <form onSubmit={form.onSubmit(onSubmit)}>
            <TextInput
                label="Username"
                placeholder="enter your username"
                required
                {...form.getInputProps("username")}
            />

            <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                {...form.getInputProps("password")}
            />

            <Group justify="space-between" mt="lg">
                <Anchor component={Link} to="/forgot-password" size="sm">
                    Forgot password?
                </Anchor>
            </Group>

            <Button fullWidth mt="xl" type="submit" loading={isLoading}>
                Sign in
            </Button>
        </form>
    ) : (
        <Loader color="blue" />
    );
}
