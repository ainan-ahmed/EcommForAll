import { Card, Group, Text, Stack, Badge, ActionIcon, Menu, Rating } from "@mantine/core";
import { IconDots, IconTrash, IconStar } from "@tabler/icons-react";
import { Review } from "../types";
import { useStore } from "zustand/react";
import { authStore } from "../../../stores/authStore";
import { useDeleteReview } from "../hooks/useReviews";
import { formatDistanceToNow } from "date-fns";

interface ReviewItemProps {
    review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
    const { user } = useStore(authStore);
    const deleteReviewMutation = useDeleteReview();
    
    const canDelete = user?.id === review.userId || user?.role === "ADMIN";
    const isOwnReview = user?.id === review.userId;

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this review?")) {
            deleteReviewMutation.mutate(review.id);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <Rating
                value={rating}
                readOnly
                size="sm"
                count={5}
                emptySymbol={<IconStar size={16} color="gray.3" />}
                fullSymbol={<IconStar size={16} fill="yellow.4" color="yellow.4" />}
            />
        );
    };

    return (
        <Card withBorder p="md" mb="md">
            <Stack gap="sm">
                {/* Header */}
                <Group justify="space-between" align="flex-start">
                    <Stack gap={4}>
                        <Group gap="xs">
                            <Text fw={600} size="sm">
                                {review.user.firstName} {review.user.lastName}
                            </Text>
                            {isOwnReview && (
                                <Badge size="xs" color="blue" variant="light">
                                    You
                                </Badge>
                            )}
                        </Group>
                        <Text size="xs" c="dimmed">
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </Text>
                    </Stack>

                    {canDelete && (
                        <Menu>
                            <Menu.Target>
                                <ActionIcon variant="subtle" size="sm">
                                    <IconDots size={16} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    color="red"
                                    leftSection={<IconTrash size={16} />}
                                    onClick={handleDelete}
                                    disabled={deleteReviewMutation.isPending}
                                >
                                    Delete Review
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    )}
                </Group>

                {/* Rating */}
                <Group gap="xs">
                    {renderStars(review.rating)}
                    <Text size="sm" c="dimmed">
                        {review.rating}/5
                    </Text>
                </Group>

                {/* Title */}
                <Text fw={500} size="md">
                    {review.title}
                </Text>

                {/* Comment */}
                <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                    {review.comment}
                </Text>
            </Stack>
        </Card>
    );
}
