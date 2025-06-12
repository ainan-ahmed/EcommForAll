package com.ainan.ecommforallbackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @Column(unique = true)
    private String sku;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    // Price for products without variants
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    // Stock for products without variants
    private Integer stock = 0;

    // Calculated minimum price from variants
    @Column(name = "min_price", precision = 10, scale = 2)
    private BigDecimal minPrice;

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductVariant> variants;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductImage> images;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Helper method to get effective price
    public BigDecimal getEffectivePrice() {
        if (hasVariants()) {
            return minPrice;
        } else {
            return price;
        }
    }

    // Helper method to get effective stock
    public Integer getEffectiveStock() {
        if (hasVariants()) {
            return variants.stream()
                    .mapToInt(variant -> variant.getStock() != null ? variant.getStock() : 0)
                    .sum();
        } else {
            return stock;
        }
    }

    // Helper method to check if the product has variants
    public boolean hasVariants() {
        return variants != null && !variants.isEmpty();
    }

    // Helper method to check if a product is in stock
    public boolean isInStock() {
        if (hasVariants()) {
            return variants.stream()
                    .anyMatch(variant -> variant.getStock() != null && variant.getStock() > 0);
        } else {
            return stock != null && stock > 0;
        }
    }
}