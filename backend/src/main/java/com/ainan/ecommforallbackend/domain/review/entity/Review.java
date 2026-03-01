package com.ainan.ecommforallbackend.domain.review.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import tech.ailef.snapadmin.external.annotations.DisplayName;
import tech.ailef.snapadmin.external.annotations.Filterable;
import tech.ailef.snapadmin.external.annotations.ReadOnly;

import com.ainan.ecommforallbackend.domain.product.entity.Product;
import com.ainan.ecommforallbackend.domain.user.entity.User;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity()
@Table(name = "review")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Filterable
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false, updatable = false)
    private Product product;

    @Filterable
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Filterable
    private Integer rating;  // 1-5

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "comment", nullable = false, length = 2000)
    private String comment;

    @Filterable
    private Boolean isApproved = true;

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
        return title + " (Rating: " + rating + "/5)";
    }
}
