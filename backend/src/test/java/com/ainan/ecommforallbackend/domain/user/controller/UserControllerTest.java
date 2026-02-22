package com.ainan.ecommforallbackend.domain.user.controller;

import com.ainan.ecommforallbackend.domain.auth.dto.ChangePasswordDto;
import com.ainan.ecommforallbackend.domain.user.dto.UserAuthDto;
import com.ainan.ecommforallbackend.domain.user.dto.UserDto;
import com.ainan.ecommforallbackend.domain.user.service.UserService;
import com.ainan.ecommforallbackend.core.exception.ResourceNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.verify;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Unit tests for UserController using MockMvcBuilders.standaloneSetup.
 *
 * standaloneSetup isolates the controller without loading any Spring context,
 * so there is no security filter chain to worry about.  Authentication is
 * simulated by passing a UsernamePasswordAuthenticationToken via .principal()
 * — Spring MVC's PrincipalMethodArgumentResolver resolves it to the
 * Authentication parameter because Authentication extends Principal.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserController Unit Tests")
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private UUID userId;
    private UserDto testUserDto;
    private UserAuthDto testUserAuthDto;

    @BeforeEach
    void setUp() {
        // standaloneSetup: no Spring context, no security filters
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        userId = UUID.randomUUID();

        testUserDto = new UserDto();
        testUserDto.setId(userId);
        testUserDto.setFirstName("John");
        testUserDto.setLastName("Doe");
        testUserDto.setEmail("john@example.com");
        testUserDto.setUsername("johndoe");
        testUserDto.setRole("USER");

        testUserAuthDto = new UserAuthDto();
        testUserAuthDto.setFirstName("John");
        testUserAuthDto.setLastName("Doe");
        testUserAuthDto.setEmail("john@example.com");
        testUserAuthDto.setUsername("johndoe");
        testUserAuthDto.setPassword("password123");
        testUserAuthDto.setRole("USER");
    }

    // -------------------------------------------------------------------------
    // GET /api/user/{id}
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("GET /api/user/{id}")
    class GetUser {

        @Test
        @DisplayName("returns 200 with UserDto when user exists")
        void returns200WithUserDtoWhenUserExists() throws Exception {
            given(userService.getUser(userId)).willReturn(testUserDto);

            mockMvc.perform(get("/api/user/{id}", userId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.firstName").value("John"))
                    .andExpect(jsonPath("$.lastName").value("Doe"))
                    .andExpect(jsonPath("$.email").value("john@example.com"))
                    .andExpect(jsonPath("$.username").value("johndoe"));

            verify(userService).getUser(userId);
        }

        @Test
        @DisplayName("returns 404 when user not found")
        void returns404WhenUserNotFound() throws Exception {
            given(userService.getUser(userId))
                    .willThrow(new ResourceNotFoundException("User not found"));

            mockMvc.perform(get("/api/user/{id}", userId))
                    .andExpect(status().isNotFound());

            verify(userService).getUser(userId);
        }
    }

    // -------------------------------------------------------------------------
    // PUT /api/user/{id}
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("PUT /api/user/{id}")
    class UpdateUser {

        @Test
        @DisplayName("returns 200 with updated UserAuthDto when user exists")
        void returns200WithUpdatedUserAuthDtoWhenUserExists() throws Exception {
            given(userService.updateUser(eq(userId), any(UserAuthDto.class)))
                    .willReturn(testUserAuthDto);

            mockMvc.perform(put("/api/user/{id}", userId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testUserAuthDto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.firstName").value("John"))
                    .andExpect(jsonPath("$.username").value("johndoe"));

            verify(userService).updateUser(eq(userId), any(UserAuthDto.class));
        }

        @Test
        @DisplayName("returns 404 when user not found")
        void returns404WhenUserNotFound() throws Exception {
            given(userService.updateUser(eq(userId), any(UserAuthDto.class)))
                    .willThrow(new ResourceNotFoundException("User not found"));

            mockMvc.perform(put("/api/user/{id}", userId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(testUserAuthDto)))
                    .andExpect(status().isNotFound());

            verify(userService).updateUser(eq(userId), any(UserAuthDto.class));
        }
    }

    // -------------------------------------------------------------------------
    // DELETE /api/user/{id}
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("DELETE /api/user/{id}")
    class DeleteUser {

        @Test
        @DisplayName("returns 200 with success message when user is deleted")
        void returns200WithSuccessMessageWhenUserIsDeleted() throws Exception {
            willDoNothing().given(userService).deleteUser(userId);

            mockMvc.perform(delete("/api/user/{id}", userId))
                    .andExpect(status().isOk())
                    .andExpect(content().string("User deleted successfully"));

            verify(userService).deleteUser(userId);
        }

        @Test
        @DisplayName("returns 404 when user not found")
        void returns404WhenUserNotFound() throws Exception {
            willThrow(new ResourceNotFoundException("User not found"))
                    .given(userService).deleteUser(userId);

            mockMvc.perform(delete("/api/user/{id}", userId))
                    .andExpect(status().isNotFound());

            verify(userService).deleteUser(userId);
        }
    }

    // -------------------------------------------------------------------------
    // PUT /api/user/changePassword
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("PUT /api/user/changePassword")
    class ChangePassword {

        @Test
        @DisplayName("returns 200 with success message when password is changed")
        void returns200WithSuccessMessageWhenPasswordIsChanged() throws Exception {
            ChangePasswordDto request = new ChangePasswordDto();
            request.setOldPassword("oldPassword");
            request.setNewPassword("newPassword123");

            willDoNothing().given(userService)
                    .changePassword("johndoe", "oldPassword", "newPassword123");

            // UsernamePasswordAuthenticationToken implements both Principal and Authentication.
            // standaloneSetup's PrincipalMethodArgumentResolver resolves the
            // Authentication parameter from request.getUserPrincipal().
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            "johndoe", null, Collections.emptyList());

            mockMvc.perform(put("/api/user/changePassword")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request))
                            .principal(auth))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Password changed successfully"));

            verify(userService).changePassword("johndoe", "oldPassword", "newPassword123");
        }

        @Test
        @DisplayName("propagates IllegalArgumentException when old password is incorrect")
        void propagatesExceptionWhenOldPasswordIsIncorrect() throws Exception {
            ChangePasswordDto request = new ChangePasswordDto();
            request.setOldPassword("wrongPassword");
            request.setNewPassword("newPassword123");

            willThrow(new IllegalArgumentException("Old password is incorrect"))
                    .given(userService)
                    .changePassword("johndoe", "wrongPassword", "newPassword123");

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            "johndoe", null, Collections.emptyList());

            // standaloneSetup has no exception handler for IllegalArgumentException,
            // so Spring MVC wraps it in NestedServletException and throws from perform().
            assertThatThrownBy(() ->
                    mockMvc.perform(put("/api/user/changePassword")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request))
                            .principal(auth)))
                    .hasCauseInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Old password is incorrect");

            verify(userService).changePassword("johndoe", "wrongPassword", "newPassword123");
        }
    }
}
