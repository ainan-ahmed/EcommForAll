package com.ainan.ecommforallbackend.domain.order.entity;

import com.ainan.ecommforallbackend.domain.product.entity.Product;
import com.ainan.ecommforallbackend.domain.product.entity.ProductVariant;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"order"})
public class OrderItem {

    @Id
    @UuidGenerator
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;

    @Column(nullable = false)
    private String productName;

    @Column(length = 1000)
    private String productDescription;

    @Column
    private String sku;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer quantity;

    @Column
    private BigDecimal subtotal;

    @PrePersist
    @PreUpdate
    public void calculateSubtotal() {
        this.subtotal = this.price.multiply(new BigDecimal(this.quantity));
    }
}