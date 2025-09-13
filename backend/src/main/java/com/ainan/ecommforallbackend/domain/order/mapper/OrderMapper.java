package com.ainan.ecommforallbackend.domain.order.mapper;

import com.ainan.ecommforallbackend.domain.order.dto.*;
import com.ainan.ecommforallbackend.domain.order.entity.Order;
import com.ainan.ecommforallbackend.domain.order.entity.OrderItem;
import com.ainan.ecommforallbackend.domain.user.entity.User;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.Set;

@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OrderMapper {

    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);

    @Mapping(target = "user", source = "order.user")
    @Mapping(target = "items", source = "order.items")
    OrderResponseDto toDto(Order order);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", source = "user")
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "paymentStatus", constant = "PENDING")
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "processedAt", ignore = true)
    @Mapping(target = "shippedAt", ignore = true)
    @Mapping(target = "deliveredAt", ignore = true)
    @Mapping(target = "cancelledAt", ignore = true)
    @Mapping(target = "subtotal", ignore = true)
    @Mapping(target = "tax", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "paymentTransactionId", ignore = true)
    @Mapping(target = "trackingNumber", ignore = true)
    @Mapping(target = "shippingCost", ignore = true)
    @Mapping(target = "shippingCarrier", ignore = true)
    @Mapping(target = "cancellationReason", ignore = true)
    Order toEntity(OrderCreateDto orderCreateDto, User user);

    OrderItemDto toOrderItemDto(OrderItem orderItem);

    Set<OrderItemDto> toOrderItemDtoSet(Set<OrderItem> items);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateOrderFromStatusUpdate(OrderStatusUpdateDto updateDto, @MappingTarget Order order);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateOrderFromPaymentUpdate(PaymentStatusUpdateDto updateDto, @MappingTarget Order order);

    @Mapping(target = "itemCount", expression = "java(order.getItems().size())")
    OrderSummaryDto toSummaryDto(Order order);

    @Mapping(target = "id", source = "user.id")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "firstName", source = "user.firstName")
    @Mapping(target = "lastName", source = "user.lastName")
    UserSummaryDto userToUserSummaryDto(User user);
}