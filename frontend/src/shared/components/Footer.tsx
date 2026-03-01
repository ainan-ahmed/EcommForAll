import {
    Container,
    Group,
    ActionIcon,
    Text,
    SimpleGrid,
    Stack,
    Title,
    Anchor,
    Divider,
    TextInput,
    Button,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import {
    IconBrandTwitter,
    IconBrandInstagram,
    IconBrandFacebook,
    IconSend,
} from "@tabler/icons-react";
import classes from "./Footer.module.css";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={classes.footer}>
            <Container size="xl">
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl" py="xl">
                    {/* Company Information */}
                    <Stack>
                        <Title order={3}>EcommForAll</Title>
                        <Text size="sm" c="dimmed">
                            Your one-stop shop for quality products at competitive prices. Shop with
                            confidence and discover your favorite brands.
                        </Text>
                        <Group>
                            <ActionIcon size="lg" variant="subtle" radius="xl">
                                <IconBrandTwitter size={18} stroke={1.5} />
                            </ActionIcon>
                            <ActionIcon size="lg" variant="subtle" radius="xl">
                                <IconBrandFacebook size={18} stroke={1.5} />
                            </ActionIcon>
                            <ActionIcon size="lg" variant="subtle" radius="xl">
                                <IconBrandInstagram size={18} stroke={1.5} />
                            </ActionIcon>
                        </Group>
                    </Stack>

                    {/* Shop Links */}
                    <Stack>
                        <Title order={4}>Shop</Title>
                        <Anchor component={Link} to="/products" size="sm">
                            All Products
                        </Anchor>
                        <Anchor component={Link} to="/categories" size="sm">
                            Categories
                        </Anchor>
                        <Anchor component={Link} to="/brands" size="sm">
                            Brands
                        </Anchor>
                        <Anchor component={Link} to="/wishlists" size="sm">
                            Wishlists
                        </Anchor>
                    </Stack>

                    {/* Customer Service */}
                    <Stack>
                        <Title order={4}>Customer Service</Title>
                        <Anchor component="a" href="#" size="sm">
                            Contact Us
                        </Anchor>
                        <Anchor component="a" href="#" size="sm">
                            Shipping & Returns
                        </Anchor>
                        <Anchor component="a" href="#" size="sm">
                            FAQ
                        </Anchor>
                        <Anchor component="a" href="#" size="sm">
                            Track Your Order
                        </Anchor>
                    </Stack>

                    {/* Newsletter */}
                    <Stack>
                        <Title order={4}>Newsletter</Title>
                        <Text size="sm" c="dimmed">
                            Subscribe to receive updates, offers, and more.
                        </Text>
                        <Group>
                            <TextInput
                                placeholder="Your email"
                                radius="md"
                                style={{ flexGrow: 1 }}
                            />
                            <Button radius="md" rightSection={<IconSend size={16} />}>
                                Subscribe
                            </Button>
                        </Group>
                    </Stack>
                </SimpleGrid>

                <Divider my="md" />

                <Group justify="space-between" py="md">
                    <Text size="sm" c="dimmed">
                        © {currentYear} EcommForAll. All rights reserved.
                    </Text>
                    <Group gap="xs" wrap="nowrap">
                        <Anchor component="a" href="#" size="xs">
                            Privacy Policy
                        </Anchor>
                        <Text size="xs" c="dimmed">
                            •
                        </Text>
                        <Anchor component="a" href="#" size="xs">
                            Terms of Service
                        </Anchor>
                        <Text size="xs" c="dimmed">
                            •
                        </Text>
                        <Anchor component="a" href="#" size="xs">
                            Sitemap
                        </Anchor>
                    </Group>
                </Group>
            </Container>
        </footer>
    );
}
