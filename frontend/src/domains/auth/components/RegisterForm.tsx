import {useForm, zodResolver} from "@mantine/form";
import {RegisterFormValues} from "../../../types/formTypes.ts";
import {userSchema} from "../schemas/userSchema.ts";
import { Button, Loader, PasswordInput, TextInput} from "@mantine/core";

interface RegisterFormProps {
    onSubmit: (values: RegisterFormValues) => void;
    isLoading: boolean;
}
export function RegisterForm({onSubmit,isLoading}:RegisterFormProps){
    const form = useForm<RegisterFormValues>({
        initialValues: {firstName: '',lastName: '',username: '',email: '', password: '',confirmPassword:''},
        validate: zodResolver(userSchema),
    });
    return !isLoading?(
        <form onSubmit={form.onSubmit(onSubmit)}>
            <TextInput
                label="First Name"
                placeholder="Enter your first name"
                required
                {...form.getInputProps('firstName')}
            />
            <TextInput
                label="Last Name"
                placeholder="Enter your last name"
                required
                {...form.getInputProps('lastName')}
            />
            <TextInput
                label="Username"
                placeholder="enter your username"
                required
                {...form.getInputProps('username')}
            />
            <TextInput
                label="Email"
                placeholder="Enter your email"
                required
                {...form.getInputProps('email')}
            />

            <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                {...form.getInputProps('password')}
            />
            <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                mt="md"
                {...form.getInputProps('confirmPassword')}
            />
            <Button fullWidth mt="xl" type="submit">
                Register
            </Button>
        </form>
    ): (<Loader color="blue" />);
};
