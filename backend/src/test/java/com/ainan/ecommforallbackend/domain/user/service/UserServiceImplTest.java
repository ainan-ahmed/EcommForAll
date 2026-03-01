package com.ainan.ecommforallbackend.domain.user.service;

import com.ainan.ecommforallbackend.core.exception.ResourceNotFoundException;
import com.ainan.ecommforallbackend.domain.user.dto.UserAuthDto;
import com.ainan.ecommforallbackend.domain.user.dto.UserDto;
import com.ainan.ecommforallbackend.domain.user.entity.RoleName;
import com.ainan.ecommforallbackend.domain.user.entity.User;
import com.ainan.ecommforallbackend.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserServiceImpl Unit Tests")
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private UUID userId;
    private User testUser;

    /**
     * Build a User using setters (avoids @AllArgsConstructor null-LocalDateTime ambiguity).
     */
    private User buildUser(UUID id, String firstName, String lastName,
                           String username, String email,
                           String password, RoleName role) {
        User user = new User();
        user.setId(id);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        return user;
    }

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        testUser = buildUser(userId, "John", "Doe", "johndoe",
                "john@example.com", "encodedPassword", RoleName.USER);
    }

    // -------------------------------------------------------------------------
    // getUser
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("getUser()")
    class GetUser {

        @Test
        @DisplayName("returns UserDto when user exists")
        void returnsUserDtoWhenUserExists() {
            given(userRepository.findById(userId)).willReturn(Optional.of(testUser));

            UserDto result = userService.getUser(userId);

            assertThat(result).isNotNull();
            assertThat(result.getFirstName()).isEqualTo("John");
            assertThat(result.getLastName()).isEqualTo("Doe");
            assertThat(result.getEmail()).isEqualTo("john@example.com");
            assertThat(result.getUsername()).isEqualTo("johndoe");
            verify(userRepository).findById(userId);
        }

        @Test
        @DisplayName("throws RuntimeException when user not found")
        void throwsRuntimeExceptionWhenUserNotFound() {
            given(userRepository.findById(userId)).willReturn(Optional.empty());

            assertThatThrownBy(() -> userService.getUser(userId))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("User not found");

            verify(userRepository).findById(userId);
        }
    }

    // -------------------------------------------------------------------------
    // updateUser
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("updateUser()")
    class UpdateUser {

        @Test
        @DisplayName("updates and returns UserAuthDto when user exists")
        void updatesAndReturnsUserAuthDtoWhenUserExists() {
            UserAuthDto updateDto = new UserAuthDto();
            updateDto.setFirstName("Jane");
            updateDto.setLastName("Smith");
            updateDto.setEmail("jane@example.com");
            updateDto.setUsername("janesmith");
            updateDto.setPassword("password123");
            updateDto.setRole("USER");

            User savedUser = buildUser(userId, "Jane", "Smith", "janesmith",
                    "jane@example.com", "encodedPassword", RoleName.USER);

            given(userRepository.findById(userId)).willReturn(Optional.of(testUser));
            given(userRepository.save(any(User.class))).willReturn(savedUser);

            UserAuthDto result = userService.updateUser(userId, updateDto);

            assertThat(result).isNotNull();
            assertThat(result.getFirstName()).isEqualTo("Jane");
            assertThat(result.getLastName()).isEqualTo("Smith");
            assertThat(result.getUsername()).isEqualTo("janesmith");
            assertThat(result.getEmail()).isEqualTo("jane@example.com");
            verify(userRepository).findById(userId);
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("throws ResourceNotFoundException when user not found")
        void throwsResourceNotFoundExceptionWhenUserNotFound() {
            UserAuthDto updateDto = new UserAuthDto();
            updateDto.setFirstName("Jane");
            updateDto.setLastName("Smith");
            updateDto.setEmail("jane@example.com");
            updateDto.setUsername("janesmith");
            updateDto.setPassword("password123");

            given(userRepository.findById(userId)).willReturn(Optional.empty());

            assertThatThrownBy(() -> userService.updateUser(userId, updateDto))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("User not found");

            verify(userRepository).findById(userId);
            verify(userRepository, never()).save(any());
        }
    }

    // -------------------------------------------------------------------------
    // deleteUser
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("deleteUser()")
    class DeleteUser {

        @Test
        @DisplayName("deletes user when user exists")
        void deletesUserWhenUserExists() {
            given(userRepository.findById(userId)).willReturn(Optional.of(testUser));
            willDoNothing().given(userRepository).delete(testUser);

            userService.deleteUser(userId);

            verify(userRepository).findById(userId);
            verify(userRepository).delete(testUser);
        }

        @Test
        @DisplayName("throws ResourceNotFoundException when user not found")
        void throwsResourceNotFoundExceptionWhenUserNotFound() {
            given(userRepository.findById(userId)).willReturn(Optional.empty());

            assertThatThrownBy(() -> userService.deleteUser(userId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("User not found");

            verify(userRepository).findById(userId);
            verify(userRepository, never()).delete(any());
        }
    }

    // -------------------------------------------------------------------------
    // getUserByUsername
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("getUserByUsername()")
    class GetUserByUsername {

        @Test
        @DisplayName("returns UserDto when username exists")
        void returnsUserDtoWhenUsernameExists() {
            given(userRepository.findByUsername("johndoe")).willReturn(Optional.of(testUser));

            UserDto result = userService.getUserByUsername("johndoe");

            assertThat(result).isNotNull();
            assertThat(result.getUsername()).isEqualTo("johndoe");
            verify(userRepository).findByUsername("johndoe");
        }

        @Test
        @DisplayName("throws ResourceNotFoundException when username not found")
        void throwsResourceNotFoundExceptionWhenUsernameNotFound() {
            given(userRepository.findByUsername("unknown")).willReturn(Optional.empty());

            assertThatThrownBy(() -> userService.getUserByUsername("unknown"))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("User not found");

            verify(userRepository).findByUsername("unknown");
        }
    }

    // -------------------------------------------------------------------------
    // getUserByEmail
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("getUserByEmail()")
    class GetUserByEmail {

        @Test
        @DisplayName("returns UserDto when email exists")
        void returnsUserDtoWhenEmailExists() {
            given(userRepository.findByEmail("john@example.com")).willReturn(Optional.of(testUser));

            UserDto result = userService.getUserByEmail("john@example.com");

            assertThat(result).isNotNull();
            assertThat(result.getEmail()).isEqualTo("john@example.com");
            verify(userRepository).findByEmail("john@example.com");
        }

        @Test
        @DisplayName("throws ResourceNotFoundException when email not found")
        void throwsResourceNotFoundExceptionWhenEmailNotFound() {
            given(userRepository.findByEmail("unknown@example.com")).willReturn(Optional.empty());

            assertThatThrownBy(() -> userService.getUserByEmail("unknown@example.com"))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("User not found");

            verify(userRepository).findByEmail("unknown@example.com");
        }
    }

    // -------------------------------------------------------------------------
    // changePassword
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("changePassword()")
    class ChangePassword {

        @Test
        @DisplayName("changes password when old password matches")
        void changesPasswordWhenOldPasswordMatches() {
            given(userRepository.findByUsername("johndoe")).willReturn(Optional.of(testUser));
            given(passwordEncoder.matches("oldPassword", "encodedPassword")).willReturn(true);
            given(passwordEncoder.encode("newPassword123")).willReturn("newEncodedPassword");

            userService.changePassword("johndoe", "oldPassword", "newPassword123");

            verify(passwordEncoder).matches("oldPassword", "encodedPassword");
            verify(passwordEncoder).encode("newPassword123");
            verify(userRepository).save(testUser);
            assertThat(testUser.getPassword()).isEqualTo("newEncodedPassword");
        }

        @Test
        @DisplayName("throws UsernameNotFoundException when user does not exist")
        void throwsUsernameNotFoundExceptionWhenUserDoesNotExist() {
            given(userRepository.findByUsername("unknown")).willReturn(Optional.empty());

            assertThatThrownBy(() -> userService.changePassword("unknown", "oldPass", "newPass"))
                    .isInstanceOf(UsernameNotFoundException.class)
                    .hasMessageContaining("User not found");

            verify(userRepository).findByUsername("unknown");
            verify(passwordEncoder, never()).matches(anyString(), anyString());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("throws IllegalArgumentException when old password is incorrect")
        void throwsIllegalArgumentExceptionWhenOldPasswordIsIncorrect() {
            given(userRepository.findByUsername("johndoe")).willReturn(Optional.of(testUser));
            given(passwordEncoder.matches("wrongPassword", "encodedPassword")).willReturn(false);

            assertThatThrownBy(() -> userService.changePassword("johndoe", "wrongPassword", "newPass"))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Old password is incorrect");

            verify(passwordEncoder).matches("wrongPassword", "encodedPassword");
            verify(passwordEncoder, never()).encode(anyString());
            verify(userRepository, never()).save(any());
        }
    }
}
