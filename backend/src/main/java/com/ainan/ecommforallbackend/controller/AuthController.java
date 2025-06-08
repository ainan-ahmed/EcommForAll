package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.*;
import com.ainan.ecommforallbackend.security.JwtUtil;
import com.ainan.ecommforallbackend.service.AuthService;
import com.ainan.ecommforallbackend.service.ShoppingCartService;
import com.ainan.ecommforallbackend.service.WishlistService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final WishlistService wishlistService;
    private final ShoppingCartService shoppingCartService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

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

    private void createDefaultWishlist(String userId) {
        WishlistCreateDto defaultWishlist = new WishlistCreateDto();
        defaultWishlist.setName("Favorites");
        wishlistService.createWishlist(defaultWishlist, userId);
    }

    private void createDefaultShoppingCart(String userId) {
        shoppingCartService.createShoppingCartIfNotExists(userId);
    }
}