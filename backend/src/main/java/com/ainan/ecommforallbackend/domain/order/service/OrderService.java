package com.ainan.ecommforallbackend.domain.order.service;

import com.ainan.ecommforallbackend.domain.order.dto.*;
import com.ainan.ecommforallbackend.domain.order.entity.OrderStatus;
import com.ainan.ecommforallbackend.domain.product.dto.ProductSalesDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface OrderService {

    OrderResponseDto createOrder(OrderCreateDto orderCreateDto, String userId);

    OrderResponseDto getOrderById(UUID orderId, String userId);

    Page<OrderSummaryDto> getUserOrders(String userId, Pageable pageable);

    List<OrderSummaryDto> getRecentUserOrders(String userId, int limit);

    OrderResponseDto updateOrderStatus(UUID orderId, OrderStatusUpdateDto orderStatusUpdateDto, String adminId);

    OrderResponseDto updatePaymentStatus(UUID orderId, PaymentStatusUpdateDto paymentStatusUpdateDto, String adminId);

    void cancelOrder(UUID orderId, String reason, String userId);

    boolean userHasActiveOrders(String userId);

    // Admin methods
    Page<OrderResponseDto> getAllOrders(Pageable pageable);

    Page<OrderResponseDto> getOrdersByStatus(OrderStatus status, Pageable pageable);

    long getOrderCountByStatus(OrderStatus status);

    long getOrderCountSince(LocalDateTime startDate);

    Double getTotalRevenueBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<ProductSalesDto> getTopSellingProducts(int limit);
}