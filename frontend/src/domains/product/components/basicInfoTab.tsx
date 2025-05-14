import { Grid, TextInput, NumberInput, Select, Switch } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Product } from "../types";
import { Brand } from "../../brand/types";
import { Category } from "../../category/types";
import { RichTextEditorField } from "../../../shared/components/RichTextEditorField";

interface BasicInfoTabProps {
    form: UseFormReturnType<Omit<Product, "variants" | "images">>;
    categories: Category[];
    brands: Brand[];
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
                <RichTextEditorField
                    form={form}
                    name="description"
                    label="Product Description"
                    description="Describe your product with rich formatting"
                    required
                    minHeight={250}
                    placeholder="Enter detailed product information..."
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
                        value: cat.id!,
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
                        value: brand.id!, // assert non-null so value is string
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
    );
}
