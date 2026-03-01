package com.ainan.ecommforallbackend.core.config;

import com.ainan.ecommforallbackend.core.security.JwtAuthenticationFilter;
import com.ainan.ecommforallbackend.domain.auth.service.CustomUserDetailsService;
import com.ainan.ecommforallbackend.domain.user.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandlerImpl;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity(debug = true)
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    private final UserRepository userRepository;

    public SecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public CustomUserDetailsService customUserDetailsService() {
        return new CustomUserDetailsService(userRepository);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://172.20.0.4:5173"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                // SnapAdmin uses server-side sessions for its own UI; keep API stateless via JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        // Admin login page is public (must be before the /admin/** ADMIN rule)
                        .requestMatchers("/admin/login").permitAll()
                        // SnapAdmin routes: all write operations (POST) restricted to ADMIN role
                        .requestMatchers(AntPathRequestMatcher.antMatcher(HttpMethod.POST, "/admin/**"))
                        .hasRole("ADMIN")
                        // SnapAdmin routes: read-only access also restricted to ADMIN only
                        .requestMatchers(AntPathRequestMatcher.antMatcher("/admin/**"))
                        .hasRole("ADMIN")
                        // public endpoints
                        .requestMatchers("/api/auth/**", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/error")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/products/**",
                                "/api/categories/**",
                                "/api/brands/**",
                                "/api/product-images/**",
                                "/api/variant-images/**",
                                "/api/variants/**",
                                "/api/ai/similar-products/**",
                                "/api/review/*/reviews")
                        .permitAll()
                        // admin only endpoints
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        // all other requests require authentication
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .userDetailsService(customUserDetailsService())
                // Enable form login for SnapAdmin web UI at /admin/login
                .formLogin(form -> form
                        .loginPage("/admin/login")
                        .loginProcessingUrl("/admin/login")
                        .defaultSuccessUrl("/admin", true)
                        .permitAll())
                // Custom access denied handler: show SnapAdmin forbidden page for /admin/** paths
                .exceptionHandling(e -> e.accessDeniedHandler((req, res, ex) -> {
                    AccessDeniedHandlerImpl defaultHandler = new AccessDeniedHandlerImpl();
                    if (req.getServletPath().startsWith("/admin/")) {
                        res.sendRedirect("/admin/forbidden");
                    } else {
                        defaultHandler.handle(req, res, ex);
                    }
                }))
                .httpBasic(Customizer.withDefaults());
        return http.build();
    }
}
