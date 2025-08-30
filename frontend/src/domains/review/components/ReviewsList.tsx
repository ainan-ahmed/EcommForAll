import { useState } from "react";
import { Stack, Text, Group, Pagination, Skeleton, Alert } from "@mantine/core";
import { IconMessageCircle, IconAlertCircle } from "@tabler/icons-react";
import { useProductReviews } from "../hooks/useReviews";
import { ReviewItem } from "./ReviewItem";
import { Review } from "../types";

interface ReviewsListProps {
    productId: string;
}

export function ReviewsList({ productId }: ReviewsListProps) {
    const [page, setPage] = useState(0);
    const pageSize = 5;

    const { data: reviewsData, isLoading, isError, error } = useProductReviews(productId, page, pageSize);

    // Handle authentication errors gracefully
    if (isError && error?.message?.includes("Authentication required")) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} title="Authentication Required" color="blue">
                Please log in to view product reviews.
            </Alert>
        );
    }

    if (isLoading) {
        return (
            <Stack gap="md">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} height={120} radius="md" />
                ))}
            </Stack>
        );
    }

    if (isError) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                Failed to load reviews. Please try again later.
            </Alert>
        );
    }

    if (!reviewsData || reviewsData.content.length === 0) {
        return (
            <Alert icon={<IconMessageCircle size={16} />} title="No Reviews Yet" color="blue">
                Be the first to review this product!
            </Alert>
        );
    }

    const totalPages = reviewsData.totalPages;
    const reviews = reviewsData.content;

    return (
        <Stack gap="md">
            {/* Reviews Count */}
            <Group justify="space-between" align="center">
                <Text size="lg" fw={500}>
                    Customer Reviews ({reviewsData.totalElements})
                </Text>
            </Group>

            {/* Reviews List */}
            <Stack gap="md">
                {reviews.map((review: Review) => (
                    <ReviewItem key={review.id} review={review} />
                ))}
            </Stack>

            {/* Pagination */}
            {totalPages > 1 && (
                <Group justify="center" mt="md">
                    <Pagination
                        total={totalPages}
                        value={page + 1}
                        onChange={(newPage) => setPage(newPage - 1)}
                        withEdges
                    />
                </Group>
            )}
        </Stack>
    );
}
