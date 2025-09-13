package com.ainan.ecommforallbackend.domain.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.ainan.ecommforallbackend.domain.order.entity.OrderStatus;
import com.ainan.ecommforallbackend.domain.order.entity.PaymentStatus;

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