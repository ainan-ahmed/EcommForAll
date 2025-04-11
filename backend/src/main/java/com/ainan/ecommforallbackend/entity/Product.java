package com.ainan.ecommforallbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.beans.factory.annotation.Value;

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

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT", length = 3000)
    private String description;

    @Column(unique = true)
    private String sku;
    @Column(nullable = false)
    private Boolean isActive = true;
    @Column(nullable = false)
    private Boolean isFeatured = false;
    @Column(nullable = true,name = "min_price")
    private BigDecimal minPrice;

    @ManyToOne()
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Each product is associated with a user who is a seller.
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    // Many-to-many relationship with categories via a join table.
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    // One-to-many relationship with ProductVariant
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductVariant> variants;
    // One-to-many relationship with ProductImage
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductImage> images;

}
