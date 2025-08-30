import { useState } from "react";
import { Stack, Button, Group, Text, Divider } from "@mantine/core";
import { IconMessageCircle, IconPlus } from "@tabler/icons-react";
import { ReviewForm } from "./ReviewForm";
import { ReviewsList } from "./ReviewsList";
import { RatingSummary } from "./RatingSummary";
import { useStore } from "zustand/react";
import { authStore } from "../../../stores/authStore";

interface ReviewsSectionProps {
    productId: string;
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const { isAuthenticated } = useStore(authStore);

    const handleReviewSuccess = () => {
        setShowReviewForm(false);
    };

    return (
        <Stack gap="lg">
            {/* Header */}
            <Group justify="space-between" align="center">
                <Group gap="xs">
                    <IconMessageCircle size={24} color="blue" />
                    <Text size="xl" fw={600}>
                        Customer Reviews
                    </Text>
                </Group>
                
                <Button
                    variant={showReviewForm ? "outline" : "filled"}
                    leftSection={<IconPlus size={16} />}
                    onClick={() => setShowReviewForm(!showReviewForm)}
                >
                    {showReviewForm ? "Cancel" : "Write a Review"}
                </Button>
            </Group>

            {/* Review Form */}
            {showReviewForm && (
                <>
                    <ReviewForm productId={productId} onSuccess={handleReviewSuccess} />
                    <Divider />
                </>
            )}

            {/* Rating Summary */}
            <RatingSummary productId={productId} />
            
            {/* Reviews List */}
            {isAuthenticated ? (
                <ReviewsList productId={productId} />
            ) : (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                    <Text c="dimmed" size="lg">
                        Please log in to view product reviews
                    </Text>
                </div>
            )}
        </Stack>
    );
}
