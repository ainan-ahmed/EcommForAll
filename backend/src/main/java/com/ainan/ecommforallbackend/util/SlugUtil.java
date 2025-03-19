package com.ainan.ecommforallbackend.util;

import com.ainan.ecommforallbackend.entity.Category;

public class SlugUtil {
    public static String toSlug(String input) {
        if (input == null) {
            return "";
        }
        // Convert to lowercase
        String slug = input.toLowerCase();
        // Remove non-alphanumeric characters (except spaces and hyphens)
        slug = slug.replaceAll("[^a-z0-9\\s-]", "");
        // Replace multiple spaces/hyphens with a single space
        slug = slug.replaceAll("[\\s-]+", " ").trim();
        // Replace spaces with hyphens
        slug = slug.replaceAll("\\s", "-");
        return slug;
    }
    public static String buildFullSlug(Category category) {
        if (category.getParent() != null) {
            return buildFullSlug(category.getParent()) + "/" + category.getSlug();
        } else {
            return category.getSlug();
        }
    }
}
