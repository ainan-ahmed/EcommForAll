package com.ainan.ecommforallbackend.repository;

import com.ainan.ecommforallbackend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

    List<OrderItem> findByOrderId(UUID orderId);

    @Query("SELECT oi.product.id, SUM(oi.quantity) as totalQuantity FROM OrderItem oi " +
            "WHERE oi.order.status <> 'CANCELLED' GROUP BY oi.product.id ORDER BY totalQuantity DESC")
    List<Object[]> findTopSellingProducts(int limit);

    @Query("SELECT COUNT(oi) FROM OrderItem oi WHERE oi.product.id = :productId")
    long countByProductId(UUID productId);
}