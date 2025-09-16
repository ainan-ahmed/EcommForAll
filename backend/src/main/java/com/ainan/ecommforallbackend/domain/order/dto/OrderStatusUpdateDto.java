package com.ainan.ecommforallbackend.domain.order.dto;

import com.ainan.ecommforallbackend.domain.order.entity.OrderStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusUpdateDto {

    @NotNull(message = "Order status is required")
    private OrderStatus status;

    private String trackingNumber;

    private String shippingCarrier;

    private String cancellationReason;
}