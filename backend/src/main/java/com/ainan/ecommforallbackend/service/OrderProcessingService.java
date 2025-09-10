package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.entity.Order;
import com.ainan.ecommforallbackend.entity.enums.OrderStatus;
import com.ainan.ecommforallbackend.entity.enums.PaymentStatus;
import com.ainan.ecommforallbackend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderProcessingService {

    private final OrderRepository orderRepository;

    /**
     * Process orders with completed payments that haven't been moved to PROCESSING
     * status yet
     * Runs every 15 minutes
     */
    @Scheduled(fixedRate = 900000) // 15 minutes
    @Transactional
    public void processCompletedPayments() {
        List<Order> pendingOrders = orderRepository.findAll().stream()
                .filter(order -> order.getStatus() == OrderStatus.PENDING
                        && order.getPaymentStatus() == PaymentStatus.COMPLETED)
                .toList();

        if (!pendingOrders.isEmpty()) {
            log.info("Processing {} orders with completed payments", pendingOrders.size());

            for (Order order : pendingOrders) {
                order.setStatus(OrderStatus.PROCESSING);
                order.setProcessedAt(LocalDateTime.now());
                orderRepository.save(order);
                log.info("Updated order {} to PROCESSING status", order.getId());
            }
        }
    }

    /**
     * Check for stale pending orders and cancel them if payment hasn't been
     * received
     * Runs once per day at midnight
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void cancelStalePendingOrders() {
        // Get all PENDING orders older than 24 hours with PENDING payment status
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(24);

        List<Order> staleOrders = orderRepository.findAll().stream()
                .filter(order -> order.getStatus() == OrderStatus.PENDING
                        && order.getPaymentStatus() == PaymentStatus.PENDING
                        && order.getCreatedAt().isBefore(cutoffTime))
                .toList();

        if (!staleOrders.isEmpty()) {
            log.info("Cancelling {} stale pending orders", staleOrders.size());

            for (Order order : staleOrders) {
                order.setStatus(OrderStatus.CANCELLED);
                order.setCancellationReason("Order cancelled automatically due to payment timeout");
                order.setCancelledAt(LocalDateTime.now());
                orderRepository.save(order);
                log.info("Cancelled stale order {}", order.getId());
            }
        }
    }
}