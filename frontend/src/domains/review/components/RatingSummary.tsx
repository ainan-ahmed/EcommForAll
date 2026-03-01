import { Group, Text, Rating, Stack, Progress, Grid } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { useProductReviews } from "../hooks/useReviews";

interface RatingSummaryProps {
    productId: string;
}

export function RatingSummary({ productId }: RatingSummaryProps) {
    const { data: reviewsData, isLoading } = useProductReviews(productId, 0, 100); // Get all reviews for summary

    if (isLoading || !reviewsData || reviewsData.totalElements === 0) {
        return null;
    }

    // Calculate average rating based on fetched content
    const fetchedCount = reviewsData.content.length;
    const totalRating = reviewsData.content.reduce(
        (sum: number, review: any) => sum + review.rating,
        0
    );
    const averageRating = fetchedCount > 0 ? totalRating / fetchedCount : 0;
    const roundedRating = Math.round(averageRating * 10) / 10;

    // Calculate distribution
    const distribution = [0, 0, 0, 0, 0];
    reviewsData.content.forEach((review: any) => {
        if (review.rating >= 1 && review.rating <= 5) {
            distribution[review.rating - 1]++;
        }
    });

    return (
        <Grid gutter="xl" mb="xl">
            <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack align="center" gap="xs">
                    <Text size="50px" fw={700} style={{ lineHeight: 1 }}>
                        {roundedRating}
                    </Text>
                    <Rating
                        value={roundedRating}
                        readOnly
                        size="lg"
                        count={5}
                        emptySymbol={<IconStar size={24} color="gray.3" />}
                        fullSymbol={<IconStar size={24} fill="yellow.4" color="yellow.4" />}
                    />
                    <Text size="sm" c="dimmed">
                        Based on {reviewsData.totalElements}{" "}
                        {reviewsData.totalElements === 1 ? "review" : "reviews"}
                    </Text>
                </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack gap="xs">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = distribution[star - 1];
                        const percentage = fetchedCount > 0 ? (count / fetchedCount) * 100 : 0;
                        return (
                            <Group key={star} gap="sm">
                                <Text size="sm" w={50}>
                                    {star} stars
                                </Text>
                                <Progress
                                    value={percentage}
                                    color="yellow.4"
                                    size="sm"
                                    style={{ flex: 1 }}
                                    radius="xl"
                                />
                                <Text size="sm" w={30} ta="right">
                                    {count}
                                </Text>
                            </Group>
                        );
                    })}
                </Stack>
            </Grid.Col>
        </Grid>
    );
}
