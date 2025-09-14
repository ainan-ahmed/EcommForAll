package com.ainan.ecommforallbackend.domain.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import com.ainan.ecommforallbackend.domain.order.entity.OrderStatus;
import com.ainan.ecommforallbackend.domain.order.entity.PaymentStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {

    private UUID id;

    private UserSummaryDto user;

    private OrderStatus status;

    private PaymentStatus paymentStatus;

    private BigDecimal subtotal;

    private BigDecimal tax;

    private BigDecimal shippingCost;

    private BigDecimal totalAmount;

    private String shippingAddress;

    private String billingAddress;

    private String paymentMethod;

    private String paymentTransactionId;

    private String trackingNumber;

    private String shippingCarrier;

    private String orderNotes;

    private String cancellationReason;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime processedAt;

    private LocalDateTime shippedAt;

    private LocalDateTime deliveredAt;

    private LocalDateTime cancelledAt;

    private Set<OrderItemDto> items = new HashSet<>();
}