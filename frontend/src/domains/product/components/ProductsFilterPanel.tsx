import { useState, useRef } from "react";
import {
    Title,
    Stack,
    TextInput,
    Select,
    Text,
    RangeSlider,
    Group,
    Button,
    ActionIcon,
} from "@mantine/core";
import { IconX, IconSearch } from "@tabler/icons-react";

interface ProductsFilterPanelProps {
    nameSearch: string;
    setNameSearch: (value: string) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    priceRange: [number, number];
    setPriceRange: (value: [number, number]) => void;
    categories: { id: string; name: string }[];
    isMobile?: boolean;
    onClose?: () => void;
}

export function ProductsFilterPanel({
    nameSearch,
    setNameSearch,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    categories,
    isMobile = false,
    onClose,
}: ProductsFilterPanelProps) {
    const searchInputRef = useRef<HTMLInputElement>(null);

    return (
        <Stack gap="md">
            <Title order={4}>Filters</Title>

            <TextInput
                ref={searchInputRef}
                label="Search"
                placeholder="Search products..."
                value={nameSearch}
                onChange={(e) => {
                    setNameSearch(e.target.value);
                    setTimeout(() => {
                        searchInputRef.current?.focus();
                    }, 0);
                }}
                rightSection={
                    nameSearch ? (
                        <ActionIcon onClick={() => setNameSearch("")}>
                            <IconX size={16} />
                        </ActionIcon>
                    ) : (
                        <IconSearch size={16} />
                    )
                }
            />

            <Select
                label="Category"
                placeholder="All Categories"
                data={[
                    { value: "", label: "All Categories" },
                    ...categories.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                    })),
                ]}
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value || "")}
                searchable
                clearable
            />

            <Stack gap="xs">
                <Text size="sm" fw={500}>
                    Price Range
                </Text>
                <RangeSlider
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onChange={setPriceRange}
                    marks={[
                        { value: 0, label: "$0" },
                        { value: 500, label: "$500" },
                        { value: 1000, label: "$1000+" },
                    ]}
                />
                <Group justify="space-between">
                    <Text size="sm">${priceRange[0]}</Text>
                    <Text size="sm">
                        ${priceRange[1] === 1000 ? "1000+" : priceRange[1]}
                    </Text>
                </Group>
            </Stack>

            {isMobile && onClose && (
                <Button onClick={onClose} mt="xl">
                    Apply Filters
                </Button>
            )}
        </Stack>
    );
}
