package com.ainan.ecommforallbackend.dto.order;

import com.ainan.ecommforallbackend.entity.enums.OrderStatus;
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