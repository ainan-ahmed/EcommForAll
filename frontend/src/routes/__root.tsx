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
} from "@mantine/core";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import cx from "clsx";
import {
    IconLogin,
    IconLogout,
    IconMoon,
    IconSettings,
    IconSun,
    IconUser,
} from "@tabler/icons-react";
import { JSX } from "react";
import { useAuth } from "../domains/auth/hooks/useAuth.ts";
import { useLogout } from "../domains/auth/hooks/useLogout.ts";
import classes from "./__root.module.css";

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
    const logout = useLogout();
    
    return (
        <>
            <header className={classes.header}>
                <Container fluid h={50}>
                    <div className={classes.inner}>
                        <Group>
                            <Text fw={700}>App</Text>
                        </Group>
                        {/* middle section (empty) */}
                        <Group justify="center">
                            <Button variant="subtle" component={Link} to="/products">Products</Button>
                            <Button variant="subtle" component={Link} to="/categories">Categories</Button>
                            <Button variant="subtle" component={Link} to="/brands">Brands</Button>
                            <Button variant="subtle" component={Link} to="/" activeOptions={{ exact: true }}>About</Button>
                            {isAuthenticated && (
                                <Button
                                    variant="subtle"
                                    component={Link}
                                    to="/wishlists"
                                >
                                    My Wishlists
                                </Button>
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
            <TanStackRouterDevtools position="bottom-right" />
        </>
    );
}

