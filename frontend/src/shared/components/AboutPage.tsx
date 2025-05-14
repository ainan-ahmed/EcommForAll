import {
    Container,
    Title,
    Text,
    SimpleGrid,
    Paper,
    ThemeIcon,
    Group,
    Badge,
    Button,
    Image,
    Stack,
    Card,
    Center,
} from "@mantine/core";
import {
    IconTruck,
    IconHeadset,
    IconDiscount,
    IconShieldCheck,
    IconUsers,
    IconHistory,
    IconHeart,
    IconShoppingCart,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import classes from "./AboutPage.module.css";

export function AboutPage() {
    // Features data
    const features = [
        {
            icon: <IconShoppingCart size={28} />,
            title: "Wide Selection",
            description:
                "Browse thousands of products across various categories",
            color: "blue",
        },
        {
            icon: <IconTruck size={28} />,
            title: "Fast Delivery",
            description:
                "Get your orders quickly with our reliable shipping partners",
            color: "green",
        },
        {
            icon: <IconHeadset size={28} />,
            title: "24/7 Support",
            description:
                "Our customer service team is always ready to help you",
            color: "orange",
        },
        {
            icon: <IconDiscount size={28} />,
            title: "Regular Deals",
            description:
                "Enjoy special promotions and discounts throughout the year",
            color: "violet",
        },
        {
            icon: <IconShieldCheck size={28} />,
            title: "Secure Shopping",
            description: "Shop with confidence with our secure payment methods",
            color: "indigo",
        },
        {
            icon: <IconHeart size={28} />,
            title: "Wishlists",
            description: "Save your favorite items for later purchase",
            color: "pink",
        },
    ];

    // Team member data (placeholder)
    const team = [
        {
            name: "John Davidson",
            position: "CEO & Founder",
            image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200",
        },
        {
            name: "Sarah Johnson",
            position: "Chief Product Officer",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
        },
        {
            name: "Michael Robinson",
            position: "Head of Customer Experience",
            image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200",
        },
    ];

    return (
        <>
            {/* Hero Section */}
            <div className={classes.heroSection}>
                <Container size="xl">
                    <div className={classes.heroContent}>
                        <Badge size="lg" color="blue" variant="filled" mb="md">
                            Welcome to EcommForAll
                        </Badge>
                        <Title order={1} className={classes.heroTitle}>
                            Discover Shopping Without Limits
                        </Title>
                        <Text size="xl" className={classes.heroText}>
                            Your one-stop destination for quality products at
                            competitive prices. Join thousands of satisfied
                            customers who trust our platform.
                        </Text>
                        <Group mt="xl">
                            <Button size="lg" component={Link} to="/products">
                                Browse Products
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                component={Link}
                                to="/categories"
                            >
                                Explore Categories
                            </Button>
                        </Group>
                    </div>
                </Container>
            </div>

            {/* Stats Section */}
            <Container size="xl" py="xl">
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                    <Paper
                        p="md"
                        radius="md"
                        withBorder
                        className={classes.statCard}
                    >
                        <Text
                            size="xl"
                            fw={700}
                            ta="center"
                            variant="gradient"
                            gradient={{ from: "blue", to: "cyan" }}
                        >
                            10,000+
                        </Text>
                        <Text ta="center" size="lg">
                            Products
                        </Text>
                    </Paper>
                    <Paper
                        p="md"
                        radius="md"
                        withBorder
                        className={classes.statCard}
                    >
                        <Text
                            size="xl"
                            fw={700}
                            ta="center"
                            variant="gradient"
                            gradient={{ from: "violet", to: "grape" }}
                        >
                            5,000+
                        </Text>
                        <Text ta="center" size="lg">
                            Happy Customers
                        </Text>
                    </Paper>
                    <Paper
                        p="md"
                        radius="md"
                        withBorder
                        className={classes.statCard}
                    >
                        <Text
                            size="xl"
                            fw={700}
                            ta="center"
                            variant="gradient"
                            gradient={{ from: "orange", to: "red" }}
                        >
                            100+
                        </Text>
                        <Text ta="center" size="lg">
                            Trusted Brands
                        </Text>
                    </Paper>
                </SimpleGrid>
            </Container>

            {/* Features Section */}
            <Container size="xl" py="xl">
                <Title order={2} ta="center" mb="xl">
                    Why Choose EcommForAll?
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
                    {features.map((feature, index) => (
                        <Paper
                            key={index}
                            p="xl"
                            radius="md"
                            withBorder
                            className={classes.featureCard}
                        >
                            <ThemeIcon
                                size={60}
                                radius={60}
                                color={feature.color}
                                mb="md"
                            >
                                {feature.icon}
                            </ThemeIcon>
                            <Text size="lg" fw={500} mb="sm">
                                {feature.title}
                            </Text>
                            <Text size="sm" c="dimmed">
                                {feature.description}
                            </Text>
                        </Paper>
                    ))}
                </SimpleGrid>
            </Container>

            {/* About Us Section */}
            <div className={classes.aboutSection}>
                <Container size="xl" py="xl">
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                        <div>
                            <Badge color="blue" mb="md">
                                Our Story
                            </Badge>
                            <Title order={2} mb="xl">
                                Bringing Quality Products to Everyone
                            </Title>
                            <Text mb="md">
                                Founded in 2020, EcommForAll started with a
                                simple mission: to make quality products
                                accessible to everyone. What began as a small
                                online shop has grown into a comprehensive
                                e-commerce platform that connects customers with
                                the best products from around the world.
                            </Text>
                            <Text mb="md">
                                Our team is passionate about providing an
                                exceptional shopping experience, from browsing
                                to delivery. We carefully select the products we
                                offer and work directly with manufacturers and
                                brands to ensure quality and value.
                            </Text>
                            <Group mt="xl" gap="md">
                                <Paper
                                    p="md"
                                    withBorder
                                    className={classes.valueCard}
                                >
                                    <IconUsers
                                        size={24}
                                        color="var(--mantine-color-blue-6)"
                                    />
                                    <Text fw={500} mt="sm">
                                        Customer First
                                    </Text>
                                </Paper>
                                <Paper
                                    p="md"
                                    withBorder
                                    className={classes.valueCard}
                                >
                                    <IconShieldCheck
                                        size={24}
                                        color="var(--mantine-color-green-6)"
                                    />
                                    <Text fw={500} mt="sm">
                                        Quality Assured
                                    </Text>
                                </Paper>
                                <Paper
                                    p="md"
                                    withBorder
                                    className={classes.valueCard}
                                >
                                    <IconHistory
                                        size={24}
                                        color="var(--mantine-color-orange-6)"
                                    />
                                    <Text fw={500} mt="sm">
                                        Fast Service
                                    </Text>
                                </Paper>
                            </Group>
                        </div>
                        <Center>
                            <Image
                                src="https://images.unsplash.com/photo-1573164574397-dd250bc8a598?q=80&w=1000"
                                height={400}
                                radius="md"
                                alt="About EcommForAll"
                                className={classes.aboutImage}
                            />
                        </Center>
                    </SimpleGrid>
                </Container>
            </div>

            {/* Team Section */}
            <Container size="xl" py="xl">
                <Title order={2} ta="center" mb="md">
                    Meet Our Team
                </Title>
                <Text
                    size="lg"
                    ta="center"
                    mb="xl"
                    c="dimmed"
                    maw={800}
                    mx="auto"
                >
                    We're a dedicated team of e-commerce experts committed to
                    bringing you the best shopping experience.
                </Text>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
                    {team.map((member, index) => (
                        <Card
                            key={index}
                            padding="lg"
                            radius="md"
                            withBorder
                            className={classes.teamCard}
                        >
                            <Card.Section>
                                <Image
                                    src={member.image}
                                    height={240}
                                    alt={member.name}
                                />
                            </Card.Section>
                            <Stack mt="md" gap="xs">
                                <Text fw={500} size="lg">
                                    {member.name}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    {member.position}
                                </Text>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>
            </Container>

            {/* Call to Action */}
            <div className={classes.ctaSection}>
                <Container size="xl" py={60}>
                    <Title order={2} ta="center" c="white" mb="lg">
                        Ready to Start Shopping?
                    </Title>
                    <Text
                        ta="center"
                        size="lg"
                        c="white"
                        mb="xl"
                        maw={600}
                        mx="auto"
                    >
                        Join thousands of satisfied customers who have
                        discovered their favorite products on EcommForAll.
                    </Text>
                    <Center>
                        <Button size="lg" component={Link} to="/register">
                            Create an Account
                        </Button>
                    </Center>
                </Container>
            </div>
        </>
    );
}
