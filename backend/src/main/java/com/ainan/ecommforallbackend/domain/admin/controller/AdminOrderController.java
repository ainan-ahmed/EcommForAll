package com.ainan.ecommforallbackend.domain.admin.controller;

import com.ainan.ecommforallbackend.domain.order.dto.OrderResponseDto;
import com.ainan.ecommforallbackend.domain.order.dto.OrderStatusUpdateDto;
import com.ainan.ecommforallbackend.domain.order.dto.PaymentStatusUpdateDto;
import com.ainan.ecommforallbackend.domain.order.entity.OrderStatus;
import com.ainan.ecommforallbackend.domain.order.service.OrderService;
import com.ainan.ecommforallbackend.domain.product.dto.ProductSalesDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<Page<OrderResponseDto>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {

        Pageable pageable = PageRequest.of(page, size, Sort.Direction.fromString(direction), sort);
        Page<OrderResponseDto> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<OrderResponseDto>> getOrdersByStatus(
            @PathVariable OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponseDto> orders = orderService.getOrdersByStatus(status, pageable);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponseDto> updateOrderStatus(
            @PathVariable UUID orderId,
            @Valid @RequestBody OrderStatusUpdateDto updateDto,
            Principal principal) {

        String adminId = principal.getName();
        OrderResponseDto updatedOrder = orderService.updateOrderStatus(orderId, updateDto, adminId);
        return ResponseEntity.ok(updatedOrder);
    }

    @PutMapping("/{orderId}/payment")
    public ResponseEntity<OrderResponseDto> updatePaymentStatus(
            @PathVariable UUID orderId,
            @Valid @RequestBody PaymentStatusUpdateDto updateDto,
            Principal principal) {

        String adminId = principal.getName();
        OrderResponseDto updatedOrder = orderService.updatePaymentStatus(orderId, updateDto, adminId);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getOrderMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime thirtyDaysAgo = today.minusDays(30);
        LocalDateTime yesterdayStart = today.minusDays(1);

        // Order counts
        metrics.put("pendingCount", orderService.getOrderCountByStatus(OrderStatus.PENDING));
        metrics.put("processingCount", orderService.getOrderCountByStatus(OrderStatus.PROCESSING));
        metrics.put("shippedCount", orderService.getOrderCountByStatus(OrderStatus.SHIPPED));
        metrics.put("deliveredCount", orderService.getOrderCountByStatus(OrderStatus.DELIVERED));
        metrics.put("cancelledCount", orderService.getOrderCountByStatus(OrderStatus.CANCELLED));

        // Revenue
        metrics.put("todayRevenue", orderService.getTotalRevenueBetween(today, LocalDateTime.now()));
        metrics.put("yesterdayRevenue", orderService.getTotalRevenueBetween(yesterdayStart, today));
        metrics.put("monthlyRevenue", orderService.getTotalRevenueBetween(thirtyDaysAgo, LocalDateTime.now()));

        // New orders today
        metrics.put("newOrdersToday", orderService.getOrderCountSince(today));

        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/top-selling")
    public ResponseEntity<List<ProductSalesDto>> getTopSellingProducts(
            @RequestParam(defaultValue = "10") int limit) {

        List<ProductSalesDto> topProducts = orderService.getTopSellingProducts(limit);
        return ResponseEntity.ok(topProducts);
    }
}