package com.ainan.ecommforallbackend.domain.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDto {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String role;

}
