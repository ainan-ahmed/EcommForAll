package com.ainan.ecommforallbackend.domain.order.entity;

import com.ainan.ecommforallbackend.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;
import tech.ailef.snapadmin.external.annotations.DisplayFormat;
import tech.ailef.snapadmin.external.annotations.DisplayName;
import tech.ailef.snapadmin.external.annotations.Filterable;
import tech.ailef.snapadmin.external.annotations.ReadOnly;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"items"})
public class Order {

    @Id
    @UuidGenerator
    @EqualsAndHashCode.Include
    private UUID id;

    @Filterable
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Filterable
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    @Filterable
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @DisplayFormat(format = "$%.2f")
    @Column(nullable = false)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @DisplayFormat(format = "$%.2f")
    @Column(nullable = false)
    private BigDecimal tax = BigDecimal.ZERO;

    @DisplayFormat(format = "$%.2f")
    @Column(nullable = false)
    private BigDecimal shippingCost = BigDecimal.ZERO;

    @DisplayFormat(format = "$%.2f")
    @Column(nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(length = 500)
    private String shippingAddress;

    @Column(length = 500)
    private String billingAddress;

    @Column(length = 255)
    private String paymentMethod;

    @Column(length = 255)
    private String paymentTransactionId;

    @Column(length = 255)
    private String trackingNumber;

    @Column(length = 255)
    private String shippingCarrier;

    @Column(length = 1000)
    private String orderNotes;

    @Column(length = 1000)
    private String cancellationReason;

    @ReadOnly
    @CreationTimestamp
    private LocalDateTime createdAt;

    @ReadOnly
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime processedAt;

    private LocalDateTime shippedAt;

    private LocalDateTime deliveredAt;

    private LocalDateTime cancelledAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItem> items = new HashSet<>();

    @DisplayName
    public String getDisplayName() {
        return "Order #" + (id != null ? id.toString().substring(0, 8) : "new")
                + (user != null ? " - " + user.getUsername() : "");
    }

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }

    public void calculateTotals() {
        this.subtotal = items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Default tax calculation (can be replaced with a more sophisticated tax
        // service)
        this.tax = this.subtotal.multiply(new BigDecimal("0.10"));

        // Total is subtotal + tax + shipping
        this.totalAmount = this.subtotal.add(this.tax).add(this.shippingCost);
    }
}
