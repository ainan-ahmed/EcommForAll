package com.ainan.ecommforallbackend.domain.order.service;

import com.ainan.ecommforallbackend.core.exception.ResourceNotFoundException;
import com.ainan.ecommforallbackend.domain.cart.dto.CartItemDto;
import com.ainan.ecommforallbackend.domain.cart.service.ShoppingCartService;
import com.ainan.ecommforallbackend.domain.order.dto.*;
import com.ainan.ecommforallbackend.domain.order.entity.Order;
import com.ainan.ecommforallbackend.domain.order.entity.OrderItem;
import com.ainan.ecommforallbackend.domain.order.entity.OrderStatus;
import com.ainan.ecommforallbackend.domain.order.mapper.OrderMapper;
import com.ainan.ecommforallbackend.domain.order.repository.OrderItemRepository;
import com.ainan.ecommforallbackend.domain.order.repository.OrderRepository;
import com.ainan.ecommforallbackend.domain.product.dto.ProductImageDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductSalesDto;
import com.ainan.ecommforallbackend.domain.product.entity.Product;
import com.ainan.ecommforallbackend.domain.product.entity.ProductVariant;
import com.ainan.ecommforallbackend.domain.product.repository.ProductRepository;
import com.ainan.ecommforallbackend.domain.product.repository.ProductVariantRepository;
import com.ainan.ecommforallbackend.domain.product.service.ProductImageService;
import com.ainan.ecommforallbackend.domain.user.entity.User;
import com.ainan.ecommforallbackend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ShoppingCartService shoppingCartService;
    private final OrderMapper orderMapper;
    private final ProductImageService productImageService;

    @Override
    @Transactional
    public OrderResponseDto createOrder(OrderCreateDto orderCreateDto, String userId) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = orderMapper.toEntity(orderCreateDto, user);

        // If creating order from cart
        if (orderCreateDto.isFromCart()) {
            List<CartItemDto> cartItems = shoppingCartService.getCartItems(userId);

            if (cartItems.isEmpty()) {
                throw new IllegalStateException("Cannot create order: cart is empty");
            }
            // Validate stock for all cart items before processing
            validateStockForCartItems(cartItems);

            for (CartItemDto cartItem : cartItems) {
                OrderItem orderItem = createOrderItemFromCartItem(cartItem);
                order.addItem(orderItem);
            }

            // Clear the cart after creating order
            shoppingCartService.clearShoppingCart(userId);
        } else {
            // Create order from provided items
            if (orderCreateDto.getItems() == null || orderCreateDto.getItems().isEmpty()) {
                throw new IllegalArgumentException("Order must contain at least one item");
            }
            validateStockForOrderItems(orderCreateDto.getItems());
            for (OrderItemCreateDto itemDto : orderCreateDto.getItems()) {
                OrderItem orderItem = createOrderItemFromCreateDto(itemDto);
                order.addItem(orderItem);
            }
        }

        // Calculate order totals
        order.calculateTotals();

        // Save the order
        Order savedOrder = orderRepository.save(order);

        // Update inventory (reduce stock) for all items
        updateInventoryForOrder(order.getItems(), false);
        log.info("Created order {} for user {}", savedOrder.getId(), userId);

        return orderMapper.toDto(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(UUID orderId, String userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Check if the order belongs to the user or user is admin
        if (!order.getUser().getId().toString().equals(userId)) {
            throw new AccessDeniedException("You don't have permission to access this order");
        }

        OrderResponseDto orderDto = orderMapper.toDto(order);

        // Add primary images for order items
        orderDto.setItems(addPrimaryImagesToOrderItems(orderDto.getItems()));

        return orderDto;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderSummaryDto> getUserOrders(String userId, Pageable pageable) {
        Page<Order> orders = orderRepository.findByUserId(UUID.fromString(userId), pageable);
        return orders.map(orderMapper::toSummaryDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderSummaryDto> getRecentUserOrders(String userId, int limit) {
        List<Order> recentOrders = orderRepository.findRecentOrdersByUserId(
                UUID.fromString(userId),
                PageRequest.of(0, limit));

        return recentOrders.stream()
                .map(orderMapper::toSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponseDto updateOrderStatus(UUID orderId, OrderStatusUpdateDto statusUpdateDto, String adminId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Apply the status update
        orderMapper.updateOrderFromStatusUpdate(statusUpdateDto, order);

        // Set timestamp based on new status
        switch (statusUpdateDto.getStatus()) {
            case PROCESSING:
                order.setProcessedAt(LocalDateTime.now());
                break;
            case SHIPPED:
                order.setShippedAt(LocalDateTime.now());
                break;
            case DELIVERED:
                order.setDeliveredAt(LocalDateTime.now());
                break;
            case CANCELLED:
                order.setCancelledAt(LocalDateTime.now());
                break;
            default:
        }

        Order savedOrder = orderRepository.save(order);
        log.info("Updated order {} status to {} by admin {}", orderId, statusUpdateDto.getStatus(), adminId);

        return orderMapper.toDto(savedOrder);
    }

    @Override
    @Transactional
    public OrderResponseDto updatePaymentStatus(UUID orderId, PaymentStatusUpdateDto paymentStatusUpdateDto,
                                                String adminId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        orderMapper.updateOrderFromPaymentUpdate(paymentStatusUpdateDto, order);

        Order savedOrder = orderRepository.save(order);
        log.info("Updated order {} payment status to {} by admin {}",
                orderId, paymentStatusUpdateDto.getPaymentStatus(), adminId);

        return orderMapper.toDto(savedOrder);
    }

    @Override
    @Transactional
    public void cancelOrder(UUID orderId, String reason, String userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Check if the order belongs to the user
        if (!order.getUser().getId().toString().equals(userId)) {
            throw new AccessDeniedException("You don't have permission to cancel this order");
        }

        // Check if the order can be cancelled
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.PROCESSING) {
            throw new IllegalStateException("Order cannot be cancelled in its current state");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancellationReason(reason);
        order.setCancelledAt(LocalDateTime.now());
        // Restore inventory for cancelled order
        updateInventoryForOrder(order.getItems(), true);
        orderRepository.save(order);
        log.info("Order {} cancelled by user {}: {}", orderId, userId, reason);
    }

    @Override
    public boolean userHasActiveOrders(String userId) {
        return orderRepository.existsByUserIdAndStatusNot(
                UUID.fromString(userId), OrderStatus.CANCELLED);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponseDto> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(orderMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponseDto> getOrdersByStatus(OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable)
                .map(orderMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public long getOrderCountByStatus(OrderStatus status) {
        return orderRepository.countByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public long getOrderCountSince(LocalDateTime startDate) {
        return orderRepository.countOrdersCreatedAfter(startDate);
    }

    @Override
    @Transactional(readOnly = true)
    public Double getTotalRevenueBetween(LocalDateTime startDate, LocalDateTime endDate) {
        Double revenue = orderRepository.getTotalRevenueBetween(startDate, endDate);
        return revenue != null ? revenue : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSalesDto> getTopSellingProducts(int limit) {
        List<Object[]> results = orderItemRepository.findTopSellingProducts(limit);
        List<ProductSalesDto> salesData = new ArrayList<>();

        for (Object[] result : results) {
            UUID productId = (UUID) result[0];
            Long quantity = (Long) result[1];

            Product product = productRepository.findById(productId)
                    .orElse(null);

            if (product != null) {
                ProductSalesDto salesDto = new ProductSalesDto();
                salesDto.setProductId(productId);
                salesDto.setProductName(product.getName());
                salesDto.setQuantitySold(quantity.intValue());

                salesData.add(salesDto);
            }
        }

        return salesData;
    }

    // Helper methods

    private OrderItem createOrderItemFromCartItem(CartItemDto cartItem) {
        OrderItem orderItem = new OrderItem();

        // Find the product
        Product product = productRepository.findById(cartItem.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        orderItem.setProduct(product);
        orderItem.setProductName(product.getName());
        orderItem.setProductDescription(product.getDescription());
        orderItem.setQuantity(cartItem.getQuantity());

        // Handle variant if applicable
        if (cartItem.getVariantId() != null) {
            ProductVariant variant = productVariantRepository.findById(cartItem.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));

            orderItem.setProductVariant(variant);
            orderItem.setSku(variant.getSku());
            orderItem.setPrice(variant.getPrice());
        } else {
            orderItem.setPrice(product.getPrice());
        }
        return orderItem;
    }

    private OrderItem createOrderItemFromCreateDto(OrderItemCreateDto itemDto) {
        OrderItem orderItem = new OrderItem();

        // Find the product
        Product product = productRepository.findById(itemDto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        orderItem.setProduct(product);
        orderItem.setProductName(product.getName());
        orderItem.setProductDescription(product.getDescription());
        orderItem.setQuantity(itemDto.getQuantity());

        // Handle variant if applicable
        if (itemDto.getVariantId() != null) {
            ProductVariant variant = productVariantRepository.findById(itemDto.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));

            orderItem.setProductVariant(variant);
            orderItem.setSku(variant.getSku());
            orderItem.setPrice(variant.getPrice());
        } else {
            orderItem.setPrice(product.getPrice());
        }
        return orderItem;
    }
    // New methods for stock management

    private void validateStockForCartItems(List<CartItemDto> cartItems) {
        List<String> outOfStockItems = new ArrayList<>();

        for (CartItemDto item : cartItems) {
            if (item.getVariantId() != null) {
                ProductVariant variant = productVariantRepository.findById(item.getVariantId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));

                if (variant.getStock() < item.getQuantity()) {
                    String variantInfo = variant.getSku() != null ? variant.getSku() : variant.getId().toString();
                    outOfStockItems.add("Product variant: " + variantInfo + " (requested: " + item.getQuantity() + ", available: " + variant.getStock() + ")");
                }
            } else {
                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

                if (product.getStock() < item.getQuantity()) {
                    outOfStockItems.add("Product: " + product.getName() + " (available: " + product.getStock() + ")");
                }
            }
        }

        if (!outOfStockItems.isEmpty()) {
            throw new IllegalStateException("Insufficient stock for: " + String.join(", ", outOfStockItems));
        }
    }

    private void validateStockForOrderItems(List<OrderItemCreateDto> items) {
        List<String> outOfStockItems = new ArrayList<>();

        for (OrderItemCreateDto item : items) {
            if (item.getVariantId() != null) {
                ProductVariant variant = productVariantRepository.findById(item.getVariantId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));

                if (variant.getStock() < item.getQuantity()) {
                    String variantInfo = variant.getSku() != null ? variant.getSku() : variant.getId().toString();
                    outOfStockItems.add("Product variant: " + variantInfo + " (requested: " + item.getQuantity() + ", available: " + variant.getStock() + ")");
                }
            } else {
                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

                if (product.getStock() < item.getQuantity()) {
                    outOfStockItems.add("Product: " + product.getName() + " (available: " + product.getStock() + ")");
                }
            }
        }

        if (!outOfStockItems.isEmpty()) {
            throw new IllegalStateException("Insufficient stock for: " + String.join(", ", outOfStockItems));
        }
    }

    private void updateInventoryForOrder(Collection<OrderItem> items, boolean isRestore) {
        for (OrderItem item : items) {
            if (item.getProductVariant() != null) {
                ProductVariant variant = item.getProductVariant();
                int stockChange = isRestore ? item.getQuantity() : -item.getQuantity();
                variant.setStock(variant.getStock() + stockChange);
                productVariantRepository.save(variant);
            } else {
                Product product = item.getProduct();
                int stockChange = isRestore ? item.getQuantity() : -item.getQuantity();
                product.setStock(product.getStock() + stockChange);
                productRepository.save(product);
            }
        }
    }

    private Set<OrderItemDto> addPrimaryImagesToOrderItems(Set<OrderItemDto> orderItems) {
        orderItems.forEach(orderItem -> {
            Page<ProductImageDto> image = productImageService.getImagesByProductId(
                    orderItem.getProductId(),
                    PageRequest.of(0, 1));
            if (image.hasContent()) {
                orderItem.setImageUrl(image.getContent().get(0).getImageUrl());
            }
        });
        return orderItems;
    }
}