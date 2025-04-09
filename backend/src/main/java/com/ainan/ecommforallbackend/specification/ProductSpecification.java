package com.ainan.ecommforallbackend.specification;

import com.ainan.ecommforallbackend.dto.ProductFilterDto;
import com.ainan.ecommforallbackend.entity.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.UUID;

public class ProductSpecification {

    public static Specification<Product> getSpecification(ProductFilterDto filter) {
        return Specification
                .where(nameContains(filter.getName()))
                .and(brandEquals(filter.getBrandId()))
                .and(categoryEquals(filter.getCategoryId()))
                .and(sellerEquals(filter.getSellerId()))
                .and(activeEquals(filter.getIsActive()))
                .and(featuredEquals(filter.getIsFeatured()))
                .and(priceBetween(filter.getMinPrice(), filter.getMaxPrice()));
    }

    private static Specification<Product> nameContains(String name) {
        return name == null ? null : (root, query, cb) ->
            cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    private static Specification<Product> brandEquals(UUID brandId) {
        return brandId == null ? null : (root, query, cb) ->
            cb.equal(root.get("brand").get("id"), brandId);
    }

    private static Specification<Product> categoryEquals(UUID categoryId) {
        return categoryId == null ? null : (root, query, cb) ->
            cb.equal(root.get("category").get("id"), categoryId);
    }

    private static Specification<Product> sellerEquals(UUID sellerId) {
        return sellerId == null ? null : (root, query, cb) ->
            cb.equal(root.get("seller").get("id"), sellerId);
    }

    private static Specification<Product> activeEquals(Boolean isActive) {
        return isActive == null ? null : (root, query, cb) ->
            cb.equal(root.get("isActive"), isActive);
    }

    private static Specification<Product> featuredEquals(Boolean isFeatured) {
        return isFeatured == null ? null : (root, query, cb) ->
            cb.equal(root.get("isFeatured"), isFeatured);
    }

    private static Specification<Product> priceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        if (minPrice == null && maxPrice == null) return null;

        if (minPrice != null && maxPrice != null) {
            return (root, query, cb) -> cb.between(root.get("minPrice"), minPrice, maxPrice);
        } else if (minPrice != null) {
            return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("minPrice"), minPrice);
        } else {
            return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("minPrice"), maxPrice);
        }
    }
}