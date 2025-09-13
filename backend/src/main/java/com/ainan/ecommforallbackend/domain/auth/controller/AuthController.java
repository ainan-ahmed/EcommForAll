package com.ainan.ecommforallbackend.domain.auth.controller;

import com.ainan.ecommforallbackend.core.security.JwtUtil;
import com.ainan.ecommforallbackend.domain.auth.dto.*;
import com.ainan.ecommforallbackend.domain.user.dto.UserDto;
import com.ainan.ecommforallbackend.domain.user.dto.UserAuthDto;
import com.ainan.ecommforallbackend.domain.auth.service.AuthService;
import com.ainan.ecommforallbackend.domain.cart.service.ShoppingCartService;
import com.ainan.ecommforallbackend.domain.user.service.UserService;
import com.ainan.ecommforallbackend.domain.wishlist.dto.WishlistCreateDto;
import com.ainan.ecommforallbackend.domain.wishlist.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserService userservice;
    private final WishlistService wishlistService;
    private final ShoppingCartService shoppingCartService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody UserAuthDto registrationDto) {
        System.out.println("Received DTO: " + registrationDto.toString());
        System.out.println("Password received: [" + registrationDto.getPassword() + "]");
        UserDto registeredUser = authService.register(registrationDto);
        createDefaultWishlist(registeredUser.getId().toString());
        createDefaultShoppingCart(registeredUser.getId().toString());
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        try {
            // The service will throw BadCredentialsException if credentials are wrong
            UserDto userDto = authService.login(loginDto.getUsername(), loginDto.getPassword());
            String token = jwtUtil.generateToken(loginDto.getUsername());
            return ResponseEntity.ok(new JwtResponse(token, userDto));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));

        }

    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {

        if (token != null && jwtUtil.validateJwtToken(token)) {
            return ResponseEntity.ok(Map.of("valid", true));
        }
        return ResponseEntity.ok(Map.of("valid", false));
    }

    @GetMapping("/user")
    public ResponseEntity<UserDto> getUserDetails(@RequestHeader("Authorization") String token, Principal principal) {
        String username;
        if (token != null && token.startsWith("Bearer ")) {
            // Extract the token without "Bearer "
            token = token.substring(7);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (principal != null) {
            username = principal.getName();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDto userDto = userservice.getUserByUsername(username);
        if (userDto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(userDto);
    }

    private void createDefaultWishlist(String userId) {
        WishlistCreateDto defaultWishlist = new WishlistCreateDto();
        defaultWishlist.setName("Favorites");
        wishlistService.createWishlist(defaultWishlist, userId);
    }

    private void createDefaultShoppingCart(String userId) {
        shoppingCartService.createShoppingCartIfNotExists(userId);
    }
}