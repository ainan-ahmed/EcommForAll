package com.ainan.ecommforallbackend.domain.order.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class ImageSortOrderDto {
    private UUID id;
    private int sortOrder;
}