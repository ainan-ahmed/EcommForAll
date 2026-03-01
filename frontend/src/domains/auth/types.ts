export interface LoginFormValues {
    username: string;
    password: string;
}

export interface RegisterFormValues {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ForgotPasswordFormValues {
    email: string;
}

export interface ResetPasswordFormValues {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ForgotPasswordResponse {
    message: string;
    success: boolean;
}

export interface ResetPasswordResponse {
    message: string;
    success: boolean;
}
