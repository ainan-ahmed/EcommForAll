package com.ainan.ecommforallbackend.entity;

import com.ainan.ecommforallbackend.listener.VariantListener;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EntityListeners(VariantListener.class)
@Table(name = "product_variant")
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @Type(JsonType.class)
    @Column(name = "attribute_values", columnDefinition = "jsonb", nullable = false)
    //@Convert(converter = MapToJsonConverter.class)
    private Map<String, String> attributeValues; // {"color":"red","size":"XL"}

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL)
    private List<VariantImage> images;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

}
