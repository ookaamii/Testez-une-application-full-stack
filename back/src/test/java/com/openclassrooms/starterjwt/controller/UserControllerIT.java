package com.openclassrooms.starterjwt.controller;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class UserControllerIT {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    private String jwtToken;

    @BeforeEach
    void setUp() {
        // Générer un jwt token
        UserDetails userDetails = userDetailsService.loadUserByUsername("yoga@studio.com");

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        jwtToken = jwtUtils.generateJwtToken(authentication);
    }

    @Test
    void user_findById_ShouldReturnUserWhenUserExist() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/{id}", "1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("yoga@studio.com"));
    }

    @Test
    void user_findById_ShouldReturnNotFoundWhenUserNotExist() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/{id}", "3")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    void user_findById_ShouldReturnBadRequestWhenNumberFormatException() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/{id}", "error")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    void user_delete_ShouldDeleteUserWhenUserExist() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/{id}", "1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void user_delete_ShouldReturnNotFoundWhenUserNotExist() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/{id}", "3")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    void user_delete_ShouldReturnBadRequestWhenNumberFormatException() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/{id}", "error")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    void user_delete_ShouldReturnUnauthorizedWhenUserNotMatching() throws Exception {
        // GIVEN : Créer un utilisateur dans la base de données, qui est différent de celui authentifié
        User user = new User();
        user.setEmail("daryl@mail.com");
        user.setFirstName("Daryl");
        user.setLastName("Dixon");
        user.setPassword("password");
        userRepository.save(user);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/{id}", user.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }
}