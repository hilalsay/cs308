package edu.sabanciuniv.cs308.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private CorsConfig corsConfig;  // Inject the CORS config

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Explicitly create a CorsConfiguration object from the CorsConfig
        http.cors().configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(corsConfig.getAllowedOrigins());
            config.setAllowedMethods(corsConfig.getAllowedMethods());
            config.setAllowedHeaders(corsConfig.getAllowedHeaders());
            config.setAllowCredentials(corsConfig.getAllowCredentials());
            return config;
        });

        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeRequests(request -> request
                        .requestMatchers("/", "/api/auth/change-role","/api/auth/login", "/api/auth/signup", "/api/auth/users", "/api/auth/users/{userId}",
                                "/api/products", "/api/category", "/api/category/**", "/api/cart/allcarts", "/api/cart/view/{userId}",
                                "/api/cart/{cartId}/confirm", "/api/cart/deleteAll", "/api/orders/**",
                                "/api/cart/add/{userId}/{productId}/{quantity}", "/api/products/**","/api/reviews/**",
                                "/api/pdf/**","/api/product-manager/**","/api/cart/products/{shopId}", "/api/auth/**","/api/refunds/**",
                                "/api/pdf/**","/api/product-manager/**","/api/cart/products/{shopId}", "/api/auth/**", "/api/invoice/**", "/api/revenue/**")
                        .permitAll()
                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(new BCryptPasswordEncoder(12));
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
