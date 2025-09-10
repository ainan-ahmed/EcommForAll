package com.ainan.ecommforallbackend.dto.order;

import com.ainan.ecommforallbackend.entity.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatusUpdateDto {

    @NotNull(message = "Payment status is required")
    private PaymentStatus paymentStatus;

    private String paymentTransactionId;
}