package com.ainan.ecommforallbackend.domain.product.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import tech.ailef.snapadmin.external.annotations.ComputedColumn;
import tech.ailef.snapadmin.external.annotations.DisplayFormat;
import tech.ailef.snapadmin.external.annotations.DisplayName;
import tech.ailef.snapadmin.external.annotations.Filterable;
import tech.ailef.snapadmin.external.annotations.ReadOnly;

import com.ainan.ecommforallbackend.domain.brand.entity.Brand;
import com.ainan.ecommforallbackend.domain.category.entity.Category;
import com.ainan.ecommforallbackend.domain.user.entity.User;

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

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(unique = true)
    private String sku;

    @Filterable
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Filterable
    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    // Price for products without variants
    @DisplayFormat(format = "$%.2f")
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    // Stock for products without variants
    private Integer stock = 0;

    // Calculated minimum price from variants
    @DisplayFormat(format = "$%.2f")
    @Column(name = "min_price", precision = 10, scale = 2)
    private BigDecimal minPrice;

    @Filterable
    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Filterable
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductVariant> variants;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductImage> images;

    @ReadOnly
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ReadOnly
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @DisplayName
    public String getDisplayName() {
        return name + (sku != null ? " [" + sku + "]" : "");
    }

    // Helper method to get effective price
    public BigDecimal getEffectivePrice() {
        if (hasVariants()) {
            return minPrice;
        } else {
            return price;
        }
    }

    // Helper method to get effective stock
    @ComputedColumn(name = "Total Stock")
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
