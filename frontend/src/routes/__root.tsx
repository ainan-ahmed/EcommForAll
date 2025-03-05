import {createRootRoute, Link, Outlet} from '@tanstack/react-router'
import {AppShell, Container, Group, Text, Menu, Button, Avatar, Burger} from "@mantine/core";
import {TanStackRouterDevtools} from "@tanstack/router-devtools";
import {IconLogin, IconLogout, IconSettings, IconUser} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import {JSX} from "react";
import {useAuth} from "../domains/auth/hooks/useAuth.ts";



function RootComponent() : JSX.Element {
    const {isAuthenticated, user} = useAuth()
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    console.log(user,isAuthenticated);
    return (
        <Container>
            <AppShell
                header={{height: 60}}
                navbar={{width: 300, breakpoint: 'sm', collapsed: {mobile: !mobileOpened, desktop: !desktopOpened},}}
                padding="md"
            >
                <AppShell.Header>
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                    <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                    <Group justify="space-between" h="100%" px="md">
                        <Text size='lg' fw={700}>App</Text>
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
                                    <Menu.Item leftSection={<IconSettings size={16}/>}>
                                        Settings
                                    </Menu.Item>
                                    <Menu.Item
                                        leftSection={<IconLogout size={16}/>}
                                        color="red"
                                    >
                                        Logout
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        ) : (
                            <Group>
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="subtle"
                                    leftSection={<IconLogin size={16}/>}
                                >
                                    Login
                                </Button>
                                <Button
                                    component={Link}
                                    to="/register"
                                    variant="filled"
                                    leftSection={<IconUser size={16}/>}
                                >
                                    Register
                                </Button>
                            </Group>
                        )}
                    </Group>
                </AppShell.Header>
                <AppShell.Navbar>

                </AppShell.Navbar>
                <AppShell.Main>
                <Outlet/>
                </AppShell.Main>
                <TanStackRouterDevtools/>
            </AppShell>
        </Container>
    )
}
export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent : () => <div>Not Found</div>
});