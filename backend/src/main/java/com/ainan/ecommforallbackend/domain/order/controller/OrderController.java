package com.ainan.ecommforallbackend.domain.order.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ainan.ecommforallbackend.domain.order.dto.*;
import com.ainan.ecommforallbackend.domain.order.service.OrderService;
import com.ainan.ecommforallbackend.domain.user.service.UserService;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<OrderResponseDto> createOrder(@Valid @RequestBody OrderCreateDto orderCreateDto,
            Principal principal) {
        String userId = getCurrentUserId(principal);
        OrderResponseDto createdOrder = orderService.createOrder(orderCreateDto, userId);
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping
    public ResponseEntity<Page<OrderSummaryDto>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction,
            Principal principal) {

        String userId = getCurrentUserId(principal);
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.fromString(direction), sort);
        Page<OrderSummaryDto> orders = orderService.getUserOrders(userId, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<OrderSummaryDto>> getRecentOrders(
            @RequestParam(defaultValue = "5") int limit,
            Principal principal) {

        String userId = getCurrentUserId(principal);
        List<OrderSummaryDto> recentOrders = orderService.getRecentUserOrders(userId, limit);
        return ResponseEntity.ok(recentOrders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDto> getOrderById(@PathVariable UUID orderId, Principal principal) {
        String userId = getCurrentUserId(principal);
        OrderResponseDto order = orderService.getOrderById(orderId, userId);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(
            @PathVariable UUID orderId,
            @RequestBody OrderCancellationDto cancellationDto,
            Principal principal) {

        String userId = getCurrentUserId(principal);
        orderService.cancelOrder(orderId, cancellationDto.getReason(), userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/has-active")
    public ResponseEntity<Boolean> hasActiveOrders(Principal principal) {
        String userId = getCurrentUserId(principal);
        boolean hasActiveOrders = orderService.userHasActiveOrders(userId);
        return ResponseEntity.ok(hasActiveOrders);
    }

    private String getCurrentUserId(Principal principal) {
        if (principal == null) {
            throw new IllegalStateException("User not authenticated");
        }
        String username = principal.getName();
        try {
            return userService.getUserByUsername(username)
                    .getId()
                    .toString();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to get user ID for username: " + username, e);
        }
    }
}