import {
    Container,
    Title,
    Text,
    SimpleGrid,
    Paper,
    Button,
    Group,
    Card,
    Badge,
    Image,
    ThemeIcon,
    Box,
    Skeleton,
    Center,
    Grid,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { Link } from "@tanstack/react-router";
import {
    IconPackage,
    IconStars,
    IconStar,
    IconChevronRight,
    IconDiscount,
    IconTruckDelivery,
} from "@tabler/icons-react";

import { useBrands } from "../../domains/brand/hooks/useBrands";
import { useCategories } from "../../domains/category/hooks/useCategories";
import { ProductCard } from "../../domains/product/components/ProductCard";
import { useProducts } from "../../domains/product/hooks/useProducts";
// Styles
import classes from "./HomePage.module.css";

export function HomePage() {
    // Product data fetching with pagination
    const { data: productsData, isLoading: isLoadingProducts } = useProducts({
        page: 0,
        size: 8,
        sort: "createdAt,desc",
    });

    // const { data: featuredProductsData, isLoading: isLoadingFeatured } =
    //     useProducts({
    //         page: 0,
    //         size: 4,
    //         featured: true,
    //     });
    // get featured products from product data with isaFeatured = true. use the data object already from above
    const featuredProductsData = productsData?.content.filter(
        (product) => product.isFeatured
    );
    const isLoadingFeatured = isLoadingProducts;

    const { data: brandsData, isLoading: isLoadingBrands } = useBrands({
        page: 0,
        size: 6,
    });

    const { data: categoriesData, isLoading: isLoadingCategories } =
        useCategories({
            page: 0,
            size: 12,
            sort: "name,asc",
        });

    const products = productsData?.content || [];
    const featuredProducts = featuredProductsData || [];
    const brands = brandsData?.content || [];
    // Promotional banner data
    const heroSlides =
        categoriesData?.content?.map((category) => ({
            id: category.id,
            imageUrl: category.imageUrl,
            title: category.name,
            description: `Explore our ${category.name} collection`,
            buttonText: "Shop Now",
            buttonLink: `/categories/${category.slug}`,
            color: "blue",
        })) || [];

    // Featured categories with icons

    const featuredCategories = categoriesData?.content
        .filter((category) => category.productCount! > 0)
        .slice(0, 4);

    // Deals/promotions data
    const promotions = [
        {
            title: "Flash Sale",
            description: "Up to 70% off",
            image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=400",
            link: "/products?sale=true",
            color: "red",
        },
        {
            title: "New Arrivals",
            description: "Just landed this week",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400",
            link: "/products?new=true",
            color: "blue",
        },
        {
            title: "Gift Cards",
            description: "Perfect for any occasion",
            image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400",
            link: "/gift-cards",
            color: "green",
        },
    ];

    // Loading skeletons
    const ProductSkeletons = () => (
        <>
            {Array.from({ length: 8 }).map((_, i) => (
                <Grid.Col key={i} span={{ base: 6, xs: 6, sm: 4, md: 3 }}>
                    <Skeleton height={320} radius="md" />
                </Grid.Col>
            ))}
        </>
    );

    const BrandSkeletons = () => (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <Grid.Col key={i} span={{ base: 6, xs: 4, sm: 4, md: 2 }}>
                    <Skeleton height={100} radius="md" />
                </Grid.Col>
            ))}
        </>
    );
    const CategorySkeletons = () => (
        <>
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                    <Skeleton height={100} radius="md" />
                </div>
            ))}
        </>
    );

    return (
        <>
            {/* Hero Carousel - Amazon-style banner rotator */}
            <Box className={classes.heroCarousel} my="xl">
                <Carousel
                    withIndicators
                    height={500}
                    slideGap="md"
                    emblaOptions={{
                        loop: true,
                        align: "start", // Changed from "center" to "start"
                    }}
                    withControls
                    classNames={{
                        indicators: classes.indicators,
                        indicator: classes.indicator,
                        root: classes.carouselRoot, // Added root class
                        slide: classes.carouselFullSlide, // Added slide class
                    }}
                >
                    {heroSlides.map((slide) => (
                        <Carousel.Slide key={slide.id}>
                            <div
                                className={classes.carouselSlide}
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${slide.imageUrl})`,
                                }}
                            >
                                <Container size="xl">
                                    <div className={classes.carouselContent}>
                                        <Title
                                            order={1}
                                            className={classes.carouselTitle}
                                        >
                                            {slide.title}
                                        </Title>
                                        <Text
                                            size="xl"
                                            className={
                                                classes.carouselDescription
                                            }
                                        >
                                            {slide.description}
                                        </Text>
                                        <Button
                                            size="lg"
                                            component={Link}
                                            to={slide.buttonLink}
                                            color={slide.color}
                                            className={classes.carouselButton}
                                        >
                                            {slide.buttonText}
                                        </Button>
                                    </div>
                                </Container>
                            </div>
                        </Carousel.Slide>
                    ))}
                </Carousel>
            </Box>
            <Container size="xl">
                {/* Featured Categories - Quick access to popular categories */}
                <div className={classes.categoriesSection}>
                    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg" my="xl">
                        {isLoadingCategories ? (
                            <CategorySkeletons />
                        ) : (
                            featuredCategories?.map((category, index) => (
                                <Card
                                    key={index}
                                    component={Link}
                                    to={`/categories/${category.slug}/`}
                                    padding="lg"
                                    radius="md"
                                    className={classes.categoryCard}
                                >
                                    <Card.Section>
                                        <Center py="xl">
                                            <ThemeIcon size={64} radius={64}>
                                                {category.imageUrl}
                                            </ThemeIcon>
                                        </Center>
                                    </Card.Section>

                                    <Text ta="center" fw={500} mt="md">
                                        {category.name}
                                    </Text>
                                </Card>
                            ))
                        )}
                    </SimpleGrid>
                </div>

                {/* Deal Cards - Similar to Amazon's promotional cards */}
                <SimpleGrid
                    cols={{ base: 1, md: 3 }}
                    spacing="lg"
                    className={classes.dealsSection}
                    my="xl"
                >
                    {promotions.map((promo, index) => (
                        <Card
                            key={index}
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            component={Link}
                            to={promo.link}
                            className={classes.dealCard}
                        >
                            <Card.Section>
                                <Image
                                    src={promo.image}
                                    height={160}
                                    alt={promo.title}
                                />
                            </Card.Section>

                            <Badge color={promo.color} my="md">
                                {promo.title}
                            </Badge>

                            <Text fw={700} size="lg">
                                {promo.description}
                            </Text>

                            <Group mt="md">
                                <Text c="dimmed" size="sm">
                                    Learn more
                                </Text>
                                <IconChevronRight size={14} color="gray" />
                            </Group>
                        </Card>
                    ))}
                </SimpleGrid>

                {/* Featured Products - Amazon style "Recommended for you" */}
                <div className={classes.section}>
                    <Group justify="space-between" my="xl">
                        <Title order={2} className={classes.sectionTitle}>
                            <IconStar size={24} /> Featured Products
                        </Title>
                        <Button
                            variant="subtle"
                            component={Link}
                            to="/products?featured=true"
                            rightSection={<IconChevronRight size={16} />}
                        >
                            View All
                        </Button>
                    </Group>

                    <Grid>
                        {isLoadingFeatured ? (
                            <ProductSkeletons />
                        ) : (
                            featuredProducts.map((product) => (
                                <Grid.Col
                                    key={product.id}
                                    span={{ base: 6, xs: 6, sm: 4, md: 3 }}
                                >
                                    <ProductCard
                                        product={product}
                                        showAddToCart={true}
                                    />
                                </Grid.Col>
                            ))
                        )}
                    </Grid>
                </div>

                {/* Value Props - Similar to Amazon's service highlights */}
                <Paper
                    p="lg"
                    radius="md"
                    withBorder
                    className={classes.valuePropSection}
                    mt="md"
                >
                    <SimpleGrid cols={{ base: 1, sm: 3 }}>
                        <Group align="flex-start">
                            <ThemeIcon size={56} radius={56} color="blue">
                                <IconTruckDelivery size={28} />
                            </ThemeIcon>
                            <div>
                                <Text fw={700}>Free Shipping</Text>
                                <Text size="sm" c="dimmed">
                                    On orders over $50
                                </Text>
                            </div>
                        </Group>

                        <Group align="flex-start">
                            <ThemeIcon size={56} radius={56} color="green">
                                <IconDiscount size={28} />
                            </ThemeIcon>
                            <div>
                                <Text fw={700}>Special Discounts</Text>
                                <Text size="sm" c="dimmed">
                                    Save with member pricing
                                </Text>
                            </div>
                        </Group>

                        <Group align="flex-start">
                            <ThemeIcon size={56} radius={56} color="orange">
                                <IconStars size={28} />
                            </ThemeIcon>
                            <div>
                                <Text fw={700}>Loyalty Rewards</Text>
                                <Text size="sm" c="dimmed">
                                    Earn points with every purchase
                                </Text>
                            </div>
                        </Group>
                    </SimpleGrid>
                </Paper>

                {/* New Arrivals - Latest Products */}
                <div className={classes.section}>
                    <Group justify="space-between" my="xl">
                        <Title order={2} className={classes.sectionTitle}>
                            <IconPackage size={24} /> New Arrivals
                        </Title>
                        <Button
                            variant="subtle"
                            component={Link}
                            to="/products"
                            rightSection={<IconChevronRight size={16} />}
                        >
                            View All
                        </Button>
                    </Group>

                    <Grid>
                        {isLoadingProducts ? (
                            <ProductSkeletons />
                        ) : (
                            products.map((product) => (
                                <Grid.Col
                                    key={product.id}
                                    span={{ base: 6, xs: 6, sm: 4, md: 3 }}
                                >
                                    <ProductCard
                                        product={product}
                                        showAddToCart={true}
                                    />
                                </Grid.Col>
                            ))
                        )}
                    </Grid>
                </div>

                {/* Popular Brands */}
                <div className={classes.section}>
                    <Group justify="space-between" my="xl">
                        <Title order={2} className={classes.sectionTitle}>
                            Popular Brands
                        </Title>
                        <Button
                            variant="subtle"
                            component={Link}
                            to="/brands"
                            rightSection={<IconChevronRight size={16} />}
                        >
                            View All Brands
                        </Button>
                    </Group>

                    <Grid align="center" my="xl">
                        {isLoadingBrands ? (
                            <BrandSkeletons />
                        ) : (
                            brands.map((brand) => (
                                <Grid.Col
                                    key={brand.id}
                                    span={{ base: 6, xs: 4, sm: 4, md: 2 }}
                                >
                                    <Paper
                                        p="md"
                                        withBorder
                                        ta="center"
                                        component={Link}
                                        to={`/brands/${brand.id}`}
                                        className={classes.brandCard}
                                    >
                                        {brand.imageUrl ? (
                                            <Image
                                                src={brand.imageUrl}
                                                height={60}
                                                fit="contain"
                                                alt={brand.name}
                                            />
                                        ) : (
                                            <Box
                                                h={60}
                                                display="flex"
                                                style={{
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Text fw={500}>
                                                    {brand.name}
                                                </Text>
                                            </Box>
                                        )}
                                    </Paper>
                                </Grid.Col>
                            ))
                        )}
                    </Grid>
                </div>

                {/* Call to Action */}
                <Paper
                    radius="lg"
                    p="xl"
                    mt={60}
                    mb={40}
                    className={classes.ctaSection}
                >
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                        <div>
                            <Title order={2} mb="lg" c="white">
                                Join Our Community Today
                            </Title>
                            <Text size="lg" mb="xl" c="white">
                                Create an account to enjoy personalized
                                shopping, save your favorites, track orders and
                                get exclusive offers.
                            </Text>
                            <Group>
                                <Button
                                    size="lg"
                                    component={Link}
                                    to="/register"
                                >
                                    Sign Up Now
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    component={Link}
                                    to="/login"
                                    color="white"
                                >
                                    Sign In
                                </Button>
                            </Group>
                        </div>
                        <Center>
                            <Image
                                src="https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=500"
                                radius="md"
                                alt="Shopping experience"
                                className={classes.ctaImage}
                            />
                        </Center>
                    </SimpleGrid>
                </Paper>
            </Container>
        </>
    );
}
//
