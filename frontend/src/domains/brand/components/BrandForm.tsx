import { useForm, zodResolver } from "@mantine/form";
import {
    TextInput,
    Textarea,
    Button,
    Switch,
    FileInput,
    Group,
    Stack,
    Paper,
} from "@mantine/core";
import { IconUpload, IconCheck } from "@tabler/icons-react";
import { Brand } from "../types";
import { brandSchema } from "../schemas/brandSchemas";

interface BrandFormProps {
    initialData?: Partial<Brand>;
    onSubmit: (data: Brand) => void;
    isLoading: boolean;
    onCancel: () => void;
}

export function BrandForm({
    initialData,
    onSubmit,
    isLoading,
    onCancel,
}: BrandFormProps) {
    const form = useForm<
        Omit<Brand, "productCount" | "createdAt" | "updatedAt" | "id"> & {
            image?: File | null;
        }
    >({
        initialValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            website: initialData?.website || "",
            isActive: initialData?.isActive ?? true,
            imageUrl: initialData?.imageUrl || null,
        },
        validate: zodResolver(brandSchema),
    });

    // This function will be called when clicking the submit button
    const handleFormSubmit = (
        values: Omit<
            Brand,
            "productCount" | "createdAt" | "updatedAt" | "id" | "imageUrl"
        > & { image?: File | null }
    ) => {
        console.log("Form submitted with values:", values);

        // Create a copy to avoid modifying original values
        const formData = { ...values };
        console.log("Form data before processing:", formData);
        // Handle empty values
        if (formData.website === "") {
            delete formData.website;
        }

        // Pass processed data to parent component
        onSubmit(formData as Brand);
    };

    return (
        <Paper p="xl" withBorder>
            <form
                onSubmit={form.onSubmit(handleFormSubmit)}
                onError={() =>
                    console.log("Form has validation errors:", form.errors)
                }
            >
                <Stack gap="md">
                    <TextInput
                        label="Brand Name"
                        placeholder="Enter brand name"
                        required
                        {...form.getInputProps("name")}
                    />

                    <Textarea
                        label="Description"
                        placeholder="Enter brand description"
                        autosize
                        minRows={3}
                        maxRows={5}
                        required
                        {...form.getInputProps("description")}
                    />

                    <TextInput
                        label="Website"
                        placeholder="https://www.example.com"
                        {...form.getInputProps("website")}
                    />

                    <FileInput
                        label="Brand Image"
                        placeholder="Upload brand logo"
                        accept="image/png,image/jpeg,image/webp"
                        leftSection={<IconUpload size={16} />}
                        {...form.getInputProps("image")}
                    />

                    <Switch
                        label="Active"
                        {...form.getInputProps("isActive", {
                            type: "checkbox",
                        })}
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
                            {initialData ? "Update Brand" : "Create Brand"}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    );
}
