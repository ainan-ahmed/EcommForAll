import { Grid, TextInput, NumberInput, Select, Switch } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Product } from "../types";
import { Brand } from "../../brand/types";
import { Category } from "../../category/types";
import { RichTextEditorField } from "../../../shared/components/RichTextEditorField";
import { GenerateDescriptionButton } from "./GenerateDescriptionButton";

interface BasicInfoTabProps {
    form: UseFormReturnType<Omit<Product, "variants" | "images">>;
    categories: Category[];
    brands: Brand[];
}
export function BasicInfoTab({ form, categories, brands }: BasicInfoTabProps) {
    const selectedCategory = categories.find((cat) => cat.id === form.values.categoryId);
    const selectedBrand = brands.find((brand) => brand.id === form.values.brandId);
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

            <Grid.Col span={12} pos={"relative"}>
                <RichTextEditorField
                    form={form}
                    name="description"
                    label="Product Description"
                    description="Describe your product with rich formatting"
                    required
                    minHeight={250}
                    placeholder="Enter detailed product information..."
                />
                {/* Position the button in the top-right corner of the textarea */}
                <div style={{ position: "absolute", top: 0, right: 0 }}>
                    <GenerateDescriptionButton
                        productName={form.values.name}
                        existingDescription={form.values.description}
                        category={selectedCategory?.name}
                        brand={selectedBrand?.name}
                        productId={form.values.id} // For existing products
                        onDescriptionGenerated={(description) =>
                            form.setFieldValue("description", description)
                        }
                    />
                </div>
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
