package com.ainan.ecommforallbackend.domain.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreateDto {

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    @NotBlank(message = "Billing address is required")
    private String billingAddress;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    private String orderNotes;

    @NotNull(message = "Cart to order conversion is required")
    private boolean fromCart = true;

    // If not from cart, individual items can be provided
    private java.util.List<OrderItemCreateDto> items;
}
