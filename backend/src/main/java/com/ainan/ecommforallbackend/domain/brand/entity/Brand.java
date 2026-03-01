package com.ainan.ecommforallbackend.domain.brand.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import tech.ailef.snapadmin.external.annotations.ComputedColumn;
import tech.ailef.snapadmin.external.annotations.DisplayName;
import tech.ailef.snapadmin.external.annotations.Filterable;
import tech.ailef.snapadmin.external.annotations.ReadOnly;

import com.ainan.ecommforallbackend.domain.product.entity.Product;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "brand")
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(unique = true)
    private String website;

    @Filterable
    @Column(name = "is_active")
    private Boolean isActive = true;

    @OneToMany(mappedBy = "brand")
    private List<Product> products;

    @ReadOnly
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @ReadOnly
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @DisplayName
    public String getDisplayName() {
        return name;
    }

    @ComputedColumn(name = "Product Count")
    public int getProductCount() {
        return products != null ? products.size() : 0;
    }
}
