import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import {
    Container,
    Group,
    Text,
    Menu,
    Button,
    Avatar,
    ActionIcon,
    useComputedColorScheme,
    useMantineColorScheme,
    Badge,
    LoadingOverlay,
} from "@mantine/core";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import cx from "clsx";
import {
    IconLogin,
    IconLogout,
    IconMoon,
    IconSettings,
    IconShoppingCart,
    IconSun,
    IconUser,
} from "@tabler/icons-react";
import { JSX, useEffect } from "react";
import { useAuth } from "../domains/auth/hooks/useAuth.ts";
import { useLogout } from "../domains/auth/hooks/useLogout.ts";
import classes from "./__root.module.css";
import { Footer } from "../shared/components/Footer.tsx";
import { useCart } from "../domains/cart/hooks/useCart.ts";
import { useStore } from "zustand";
import { authStore } from "../stores/authStore";

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: () => <div>Not Found</div>,
});

export function RootComponent(): JSX.Element {
    const { isAuthenticated, user } = useAuth() as {
        isAuthenticated: boolean;
        user: {
            firstName: string;
            lastName: string;
            email: string;
            username: string;
        } | null;
    };
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme("light", {
        getInitialValueInEffect: true,
    });
    const { data: cart } = useCart();
    const cartItemCount = cart?.totalItems || 0;
    const logout = useLogout();
    const { checkAuth } = useStore(authStore);

    useEffect(() => {
        // Validate token on app load
        checkAuth();

        // Optional: Set up periodic validation
        const intervalId = setInterval(
            () => {
                checkAuth();
            },
            15 * 60 * 1000
        ); // Check every 15 minutes

        return () => clearInterval(intervalId);
    }, [checkAuth]);

    return (
        <>
            <header className={classes.header}>
                <Container fluid h={50}>
                    <div className={classes.inner}>
                        <Group>
                            <Button
                                component={Link}
                                to="/"
                                variant="gradient"
                                gradient={{ from: "red", to: "green", deg: 90 }}
                            >
                                <Text fw={700}>EcommForAll</Text>
                            </Button>
                        </Group>
                        {/* middle section (empty) */}
                        <Group justify="center">
                            <Button
                                variant="subtle"
                                component={Link}
                                to="/products"
                            >
                                Products
                            </Button>
                            <Button
                                variant="subtle"
                                component={Link}
                                to="/categories"
                            >
                                Categories
                            </Button>
                            <Button
                                variant="subtle"
                                component={Link}
                                to="/brands"
                            >
                                Brands
                            </Button>
                            <Button
                                variant="subtle"
                                color="green"
                                component={Link}
                                to="/about"
                                activeOptions={{ exact: true }}
                            >
                                About
                            </Button>
                            {isAuthenticated && (
                                <Group gap="xs">
                                    <Button
                                        variant="subtle"
                                        component={Link}
                                        to="/wishlists"
                                    >
                                        My Wishlists
                                    </Button>
                                    <ActionIcon
                                        component={Link}
                                        to="/cart"
                                        variant="subtle"
                                        size="lg"
                                        pos="relative"
                                    >
                                        <IconShoppingCart size={20} />
                                        {cartItemCount > 0 && (
                                            <Badge
                                                size="xs"
                                                variant="filled"
                                                color="red"
                                                pos="absolute"
                                                top={-5}
                                                right={-5}
                                                style={{
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                {cartItemCount}
                                            </Badge>
                                        )}
                                    </ActionIcon>
                                </Group>
                            )}
                        </Group>
                        {/* right section */}
                        <Group justify="flex-end">
                            <ActionIcon
                                onClick={() =>
                                    setColorScheme(
                                        computedColorScheme === "light"
                                            ? "dark"
                                            : "light"
                                    )
                                }
                                variant="default"
                                size="xl"
                                aria-label="Toggle color scheme"
                            >
                                <IconSun
                                    className={cx(classes.icon, classes.light)}
                                    stroke={1.5}
                                />
                                <IconMoon
                                    className={cx(classes.icon, classes.dark)}
                                    stroke={1.5}
                                />
                            </ActionIcon>
                            {isAuthenticated ? (
                                <Menu position="bottom-end" withArrow>
                                    <Menu.Target>
                                        <Button variant="subtle">
                                            <Group gap="xs">
                                                <Avatar
                                                    size="sm"
                                                    // src={user.image}
                                                    color="blue"
                                                >
                                                    {user?.firstName.charAt(0)}
                                                </Avatar>
                                                <Text>{user?.lastName}</Text>
                                            </Group>
                                        </Button>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item
                                            component={Link}
                                            to="/profile"
                                            leftSection={<IconUser size={16} />}
                                        >
                                            Profile
                                        </Menu.Item>
                                        <Menu.Item
                                            leftSection={
                                                <IconSettings size={16} />
                                            }
                                        >
                                            Settings
                                        </Menu.Item>
                                        <Menu.Item
                                            leftSection={
                                                <IconLogout size={16} />
                                            }
                                            color="red"
                                            onClick={logout}
                                        >
                                            Logout
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            ) : (
                                <Group justify="flex-end" gap="sm">
                                    <Button
                                        component={Link}
                                        to="/login"
                                        variant="subtle"
                                        leftSection={<IconLogin size={16} />}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/register"
                                        variant="filled"
                                        leftSection={<IconUser size={16} />}
                                    >
                                        Register
                                    </Button>
                                </Group>
                            )}
                        </Group>
                    </div>
                </Container>
            </header>
            <main>
                <Outlet />
            </main>
            <Footer />
            <TanStackRouterDevtools position="bottom-right" />
        </>
    );
}
