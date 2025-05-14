import {
    Container,
    Title,
    Paper,
    Avatar,
    Text,
    Group,
    Tabs,
    Button,
    Stack,
    Divider,
    Badge,

} from "@mantine/core";
import { useStore } from "zustand";
import { authStore } from "../../../stores/authStore";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "@tanstack/react-router";
import {
    IconEdit,
    IconKey,
    IconShoppingBag,
    IconHeart,
    IconSettings,
    IconTrash,
} from "@tabler/icons-react";
import { WishlistsPage } from "./WishlistsPage";

export function UserProfile() {
    const { user } = useStore(authStore);
    const [activeTab, setActiveTab] = useState<string | null>("profile");
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    return (
        <Container size="xl" py="xl">
            <Paper radius="md" p="xl" withBorder mb="lg">
                <Group wrap="nowrap">
                    <Avatar
                        size={120}
                        radius={120}
                        color="blue"
                        alt={`${user?.firstName} ${user?.lastName}`}
                    >
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                    </Avatar>

                    <div style={{ flex: 1 }}>
                        <Text fz="xl" fw={700} mb={5}>
                            {user?.firstName} {user?.lastName}
                        </Text>
                        <Text c="dimmed" fz="lg">
                            @{user?.username}
                        </Text>
                        <Group mt="md">
                            <Badge color="blue">{user?.role}</Badge>
                            <Text size="sm" c="dimmed">
                                Member since{" "}
                                {new Date(
                                    user?.createdAt || ""
                                ).toLocaleDateString()}
                            </Text>
                        </Group>
                    </div>

                    {activeTab === "profile" && !isEditing && (
                        <Button
                            leftSection={<IconEdit size={16} />}
                            variant="light"
                            onClick={() => navigate({ to: "/profile/edit" })}
                        >
                            Edit Profile
                        </Button>
                    )}
                </Group>
            </Paper>

            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List mb="md">
                    <Tabs.Tab
                        value="profile"
                        leftSection={<IconSettings size={16} />}
                    >
                        Profile Details
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="wishlists"
                        leftSection={<IconHeart size={16} />}
                    >
                        My Wishlists
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="orders"
                        leftSection={<IconShoppingBag size={16} />}
                    >
                        Order History
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="security"
                        leftSection={<IconKey size={16} />}
                    >
                        Security
                    </Tabs.Tab>
                </Tabs.List>

                {/* Profile Details Tab */}
                <Tabs.Panel value="profile">
                    <Paper p="md" withBorder>
                        <Stack>
                                <Group>
                                    <Text fw={500} w={120}>
                                        Full Name:
                                    </Text>
                                    <Text>
                                        {user?.firstName} {user?.lastName}
                                    </Text>
                                </Group>
                                <Divider my="sm" />
                                <Group>
                                    <Text fw={500} w={120}>
                                        Username:
                                    </Text>
                                    <Text>{user?.username}</Text>
                                </Group>
                                <Divider my="sm" />
                                <Group>
                                    <Text fw={500} w={120}>
                                        Email:
                                    </Text>
                                    <Text>{user?.email}</Text>
                                </Group>
                                <Divider my="sm" />
                                <Group>
                                    <Text fw={500} w={120}>
                                        Role:
                                    </Text>
                                    <Badge color="blue">{user?.role}</Badge>
                                </Group>
                            </Stack>
                    </Paper>
                </Tabs.Panel>

                {/* Wishlists Tab */}
                <Tabs.Panel value="wishlists">
                    <WishlistsPage/>
                </Tabs.Panel>

                {/* Orders Tab */}
                <Tabs.Panel value="orders">
                    <Title order={3} mb="md">
                        Order History
                    </Title>
                    <Paper p="xl" withBorder ta="center">
                        <Text size="lg" mb="md">
                            You don't have any orders yet.
                        </Text>
                        <Button onClick={() => navigate({ to: "/products" })}>
                            Browse Products
                        </Button>
                    </Paper>
                </Tabs.Panel>

                {/* Security Tab */}
                <Tabs.Panel value="security">
                    <Title order={3} mb="md">
                        Account Security
                    </Title>
                    <Paper p="md" withBorder>
                        <Stack>
                            <Group justify="space-between">
                                <div>
                                    <Text fw={500}>Password</Text>
                                    <Text size="sm" c="dimmed">
                                        Change your password to protect your
                                        account
                                    </Text>
                                </div>
                                {/* <Button
                                    variant="light"
                                    leftSection={<IconKey size={16} />}
                                    onClick={openPasswordModal}
                                >
                                    Change Password
                                </Button> */}
                            </Group>

                            <Divider my="sm" />

                            <Group justify="space-between">
                                <div>
                                    <Text fw={500} c="red">
                                        Delete Account
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        Permanently delete your account and all
                                        associated data
                                    </Text>
                                </div>
                                <Button
                                    variant="outline"
                                    color="red"
                                    leftSection={<IconTrash size={16} />}
                                    onClick={() => {
                                        notifications.show({
                                            title: "Feature Not Available",
                                            message:
                                                "This feature is not implemented yet.",
                                            color: "orange",
                                        });
                                    }}
                                >
                                    Delete Account
                                </Button>
                            </Group>
                        </Stack>
                    </Paper>
                </Tabs.Panel>
            </Tabs>
           
        </Container>
    );
}
