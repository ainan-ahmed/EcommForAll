package com.ainan.ecommforallbackend.controller;

import com.ainan.ecommforallbackend.dto.JwtResponse;
import com.ainan.ecommforallbackend.dto.LoginDto;
import com.ainan.ecommforallbackend.dto.UserAuthDto;
import com.ainan.ecommforallbackend.dto.UserDto;
import com.ainan.ecommforallbackend.security.JwtUtil;
import com.ainan.ecommforallbackend.service.AuthService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@Getter
@Setter
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody UserAuthDto registrationDto) {
        System.out.println("Received DTO: " + registrationDto.toString());
        System.out.println("Password received: [" + registrationDto.getPassword() + "]");
        UserDto registeredUser = authService.register(registrationDto);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginDto loginDto) {
        UserDto userDto = authService.login(loginDto.getUsername(), loginDto.getPassword());
        String token = jwtUtil.generateToken(loginDto.getUsername());
        return ResponseEntity.ok(new JwtResponse(token,userDto));
    }
}