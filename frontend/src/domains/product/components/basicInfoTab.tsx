import { Grid, TextInput, Textarea, NumberInput, Select, Switch } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Product } from "../types";

interface BasicInfoTabProps {
    form: UseFormReturnType<Omit<Product, "variants" | "images">>;
    categories: { id: string; name: string }[];
    brands: { id: string; name: string }[];
}
export function BasicInfoTab({ form, categories, brands }: BasicInfoTabProps) {
    return (
        <Grid>
            <Grid.Col span={12}>
                <TextInput
                    label="Product Name"
                    placeholder="Enter product name"
                    required
                    {...form.getInputProps("name")}
                />
            </Grid.Col>

            <Grid.Col span={12}>
                <Textarea
                    label="Description"
                    placeholder="Enter product description"
                    minRows={4}
                    {...form.getInputProps("description")}
                />
            </Grid.Col>

            <Grid.Col span={6}>
                <TextInput
                    label="SKU"
                    placeholder="Enter product SKU"
                    required
                    {...form.getInputProps("sku")}
                />
            </Grid.Col>

            <Grid.Col span={6}>
                <NumberInput
                    label="Base Price"
                    placeholder="Enter base price"
                    allowNegative={false}
                    min={0}
                    required
                    {...form.getInputProps("minPrice")}
                />
            </Grid.Col>

            <Grid.Col span={6}>
                <Select
                    label="Category"
                    placeholder="Select a category"
                    data={categories.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                    }))}
                    required
                    {...form.getInputProps("categoryId")}
                />
            </Grid.Col>

            <Grid.Col span={6}>
                <Select
                    label="Brand"
                    placeholder="Select a brand"
                    data={brands.map((brand) => ({
                        value: brand.id,
                        label: brand.name,
                    }))}
                    {...form.getInputProps("brandId")}
                />
            </Grid.Col>

            <Grid.Col span={6}>
                <Switch
                    label="Active"
                    description="Product is available for purchase"
                    {...form.getInputProps("isActive", {
                        type: "checkbox",
                    })}
                />
            </Grid.Col>

            <Grid.Col span={6}>
                <Switch
                    label="Featured"
                    description="Display in featured sections"
                    {...form.getInputProps("isFeatured", {
                        type: "checkbox",
                    })}
                />
            </Grid.Col>
        </Grid>
    )
}