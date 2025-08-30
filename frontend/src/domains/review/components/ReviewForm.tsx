import { useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import {
    TextInput,
    Textarea,
    Button,
    Stack,
    Group,
    Text,
    Rating,
    Paper,
    Title,
} from "@mantine/core";
import { IconStar, IconSend } from "@tabler/icons-react";
import { useCreateReview } from "../hooks/useReviews";
import { ReviewCreateRequest } from "../types";
import { useStore } from "zustand/react";
import { authStore } from "../../../stores/authStore";
import { reviewSchema } from "../schemas/reviewSchema";

interface ReviewFormProps {
    productId: string;
    onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
    const { user } = useStore(authStore);
    const [rating, setRating] = useState(5);

    const form = useForm({
        initialValues: {
            title: "",
            comment: "",
        },
        validate: zodResolver(reviewSchema),
    });

    const createReviewMutation = useCreateReview();

    const handleSubmit = (values: { title: string; comment: string }) => {
        if (!user) return;

        const reviewData: ReviewCreateRequest = {
            productId,
            userId: user.id,
            title: values.title,
            rating,
            comment: values.comment,
        };

        createReviewMutation.mutate(reviewData, {
            onSuccess: () => {
                form.reset();
                setRating(5);
                onSuccess?.();
            },
        });
    };

    if (!user) {
        return (
            <Paper p="md" withBorder>
                <Text c="dimmed" ta="center">
                    Please log in to leave a review
                </Text>
            </Paper>
        );
    }

    return (
        <Paper p="md" withBorder>
            <Title order={4} mb="md">
                Write a Review
            </Title>
            
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    {/* Rating */}
                    <div>
                        <Text size="sm" fw={500} mb="xs">
                            Rating *
                        </Text>
                        <Group gap="xs" align="center">
                            <Rating
                                value={rating}
                                onChange={setRating}
                                defaultValue={0}
                                size="lg"
                                count={5}
                                // highlightSelectedOnly
                                // fractions={2}
                                // emptySymbol={<IconStar size={24} color="gray.3" />}
                                // fullSymbol={<IconStar size={24} fill="yellow.4" color="yellow.4" />}
                            />
                            <Text size="sm" c="dimmed" ml="xs">
                                {rating} out of 5
                            </Text>
                        </Group>
                        <Text size="xs" c="dimmed" mt={4}>
                            Click on the stars to rate this product • 
                            <Text span c={rating <= 2 ? 'red' : rating === 3 ? 'yellow' : 'green'} fw={500}>
                                {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
                            </Text>
                        </Text>
                    </div>

                    {/* Title */}
                    <TextInput
                        label="Review Title"
                        placeholder="Summarize your experience"
                        required
                        {...form.getInputProps("title")}
                    />

                    {/* Comment */}
                    <Textarea
                        label="Review Comment"
                        placeholder="Share your detailed thoughts about this product..."
                        required
                        minRows={3}
                        maxRows={6}
                        {...form.getInputProps("comment")}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        leftSection={<IconSend size={16} />}
                        loading={createReviewMutation.isPending}
                        disabled={createReviewMutation.isPending}
                    >
                        Post Review
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
}
