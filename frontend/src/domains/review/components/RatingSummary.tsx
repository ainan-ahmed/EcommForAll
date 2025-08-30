import { Group, Text, Rating, Badge } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { useProductReviews } from "../hooks/useReviews";

interface RatingSummaryProps {
    productId: string;
}

export function RatingSummary({ productId }: RatingSummaryProps) {
    const { data: reviewsData, isLoading, isError, error } = useProductReviews(productId, 0, 100); // Get all reviews for summary
    
    // Handle authentication errors gracefully
    if (isError && error?.message?.includes("Authentication required")) {
        return null; // Don't show rating summary for unauthenticated users
    }
    
    if (isLoading || !reviewsData || reviewsData.totalElements === 0) {
        return null;
    }

    // Calculate average rating
    const totalRating = reviewsData.content.reduce((sum: number, review: any) => sum + review.rating, 0);
    const averageRating = totalRating / reviewsData.totalElements;
    const roundedRating = Math.round(averageRating * 10) / 10; // Round to 1 decimal place

    return (
        <Group gap="md" align="center" mb="lg">
            <Group gap="xs" align="center">
                <Rating
                    value={roundedRating}
                    readOnly
                    size="lg"
                    count={5}
                    emptySymbol={<IconStar size={24} color="gray.3" />}
                    fullSymbol={<IconStar size={24} fill="yellow.4" color="yellow.4" />}
                />
                <div>
                    <Text size="xl" fw={700} c="yellow.4">
                        {roundedRating}
                    </Text>
                    <Text size="sm" c="dimmed">
                        out of 5
                    </Text>
                </div>
            </Group>
            
            <Badge size="lg" variant="light" color="blue">
                {reviewsData.totalElements} {reviewsData.totalElements === 1 ? 'review' : 'reviews'}
            </Badge>
        </Group>
    );
}
