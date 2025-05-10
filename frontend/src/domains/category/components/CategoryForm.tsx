import { useForm, zodResolver } from "@mantine/form";
import {
    TextInput,
    Textarea,
    Button,
    FileInput,
    Group,
    Stack,
    Paper,
    Select,
} from "@mantine/core";
import { IconUpload, IconCheck } from "@tabler/icons-react";
import { Category } from "../types";
import { categorySchema } from "../categorySchemas";

interface CategoryFormProps {
    initialData?: Partial<Category>;
    onSubmit: (data: Category) => void;
    isLoading: boolean;
    onCancel: () => void;
    categories?: Category[]; // Add categories for parent selection
}

export function CategoryForm({
    initialData,
    onSubmit,
    isLoading,
    onCancel,
    categories = [], // Default to empty array if not provided
}: CategoryFormProps) {
    const form = useForm<Omit<Category, "productCount" | "id" | "slug" >>({
        initialValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            parent: initialData?.parent ?? "",      // always a string
            imageUrl: initialData?.imageUrl || null,
        },
        validate: zodResolver(categorySchema),
    });

    // Filter out the current category from parent options to prevent circular references
    const parentOptions = categories
        .filter((category) => category.id !== initialData?.id && category.id != null)
        .map((category) => ({
            value: String(category.id),           // force string
            label: category.name,
        }));

    // Add a "No parent" option at the top
    parentOptions.unshift({ value: "", label: "No parent" });

    const handleSubmit = (values: Omit<Category, "productCount"> & { image?: File | null }) => {
        // Create a copy of values to avoid modifying the original
        const formData = { ...values };

        // If parentId is empty string or null, remove it from the submission
        if (!formData.parent) { 
            delete formData.parent;
        }

        onSubmit(formData as Category);
    };

    return (
        <Paper p="xl" withBorder>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <TextInput
                        label="Category Name"
                        placeholder="Enter category name"
                        required
                        {...form.getInputProps("name")}
                        onChange={(event) => {
                            form.getInputProps("name").onChange(event);
                        }}
                    />

                    <Select
                        label="Parent Category"
                        description="Select a parent category (optional)"
                        placeholder="Select parent category"
                        data={parentOptions}
                        clearable
                        searchable
                        {...form.getInputProps("parent")}
                    />

                    <Textarea
                        label="Description"
                        placeholder="Enter category description"
                        autosize
                        minRows={3}
                        maxRows={5}
                        {...form.getInputProps("description")}
                    />

                    <FileInput
                        label="Category Image"
                        placeholder="Upload an image"
                        accept="image/png,image/jpeg,image/webp"
                        leftSection={<IconUpload size={16} />}
                        {...form.getInputProps("image")}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button
                            variant="default"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            leftSection={<IconCheck size={18} />}
                            loading={isLoading}
                        >
                            {initialData
                                ? "Update Category"
                                : "Create Category"}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    );
}
