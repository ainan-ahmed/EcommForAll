package com.ainan.ecommforallbackend.dto.order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDto {

    private UUID id;

    private String email;

    private String firstName;

    private String lastName;
}