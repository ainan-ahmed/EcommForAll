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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.ainan.ecommforallbackend.domain.order.dto.*;
import com.ainan.ecommforallbackend.domain.order.entity.OrderStatus;
import com.ainan.ecommforallbackend.domain.order.service.OrderService;
import com.ainan.ecommforallbackend.domain.user.service.UserService;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Orders", description = "Order placement and customer order history")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @PostMapping
    @Operation(summary = "Create order", description = "Creates a new order for the authenticated user.")
    public ResponseEntity<OrderResponseDto> createOrder(@Valid @RequestBody OrderCreateDto orderCreateDto,
            Principal principal) {
        String userId = getCurrentUserId(principal);
        OrderResponseDto createdOrder = orderService.createOrder(orderCreateDto, userId);
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping
    @Operation(summary = "List user orders", description = "Returns paginated orders for the current user with optional status filter.")
    public ResponseEntity<Page<OrderSummaryDto>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            @RequestParam(required = false) OrderStatus status,
            Principal principal) {

        // Parse sort parameter correctly
        String[] sortParams = sort.split(",");
        String sortBy = sortParams[0];
        Sort.Direction direction = sortParams.length > 1 && "desc".equalsIgnoreCase(sortParams[1])
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        // Fix: Use getCurrentUserId() instead of principal.getName()
        String userId = getCurrentUserId(principal);
        Page<OrderSummaryDto> orders = orderService.getUserOrders(userId, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/recent")
    @Operation(summary = "List recent orders", description = "Returns the most recent orders for the current user.")
    public ResponseEntity<List<OrderSummaryDto>> getRecentOrders(
            @RequestParam(defaultValue = "5") int limit,
            Principal principal) {

        String userId = getCurrentUserId(principal);
        List<OrderSummaryDto> recentOrders = orderService.getRecentUserOrders(userId, limit);
        return ResponseEntity.ok(recentOrders);
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "Get order by ID", description = "Returns order details for the given order ID.")
    public ResponseEntity<OrderResponseDto> getOrderById(@PathVariable UUID orderId, Principal principal) {
        String userId = getCurrentUserId(principal);
        OrderResponseDto order = orderService.getOrderById(orderId, userId);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/{orderId}/cancel")
    @Operation(summary = "Cancel order", description = "Cancels an order for the current user with a cancellation reason.")
    public ResponseEntity<Void> cancelOrder(
            @PathVariable UUID orderId,
            @RequestBody OrderCancellationDto cancellationDto,
            Principal principal) {

        String userId = getCurrentUserId(principal);
        orderService.cancelOrder(orderId, cancellationDto.getReason(), userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/has-active")
    @Operation(summary = "Check active orders", description = "Returns whether the user has any active orders.")
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
