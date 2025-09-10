package com.ainan.ecommforallbackend.dto.order;

import com.ainan.ecommforallbackend.entity.enums.OrderStatus;
import com.ainan.ecommforallbackend.entity.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryDto {

    private UUID id;

    private OrderStatus status;

    private PaymentStatus paymentStatus;

    private BigDecimal totalAmount;

    private int itemCount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String trackingNumber;
}