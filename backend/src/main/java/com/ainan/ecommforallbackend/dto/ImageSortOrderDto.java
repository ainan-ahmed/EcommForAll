package com.ainan.ecommforallbackend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class ImageSortOrderDto {
    private UUID id;
    private int sortOrder;
}