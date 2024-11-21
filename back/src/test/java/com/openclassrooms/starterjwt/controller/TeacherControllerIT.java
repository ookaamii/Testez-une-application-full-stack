package com.openclassrooms.starterjwt.controller;

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
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
public class TeacherControllerIT {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    private String jwtToken;

    @BeforeEach
    void setUp() {
        // Générer un jwt token
        UserDetails userDetails = userDetailsService.loadUserByUsername("yoga@studio.com");

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        jwtToken = jwtUtils.generateJwtToken(authentication);
    }


    @Test
    public void teacher_findAll() throws Exception {
        mockMvc
                .perform(MockMvcRequestBuilders.get("/api/teacher")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void teacher_findById_ShouldReturnOKWhenTeacherExist() throws Exception {
        mockMvc
                .perform(MockMvcRequestBuilders.get("/api/teacher/{id}", "1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void teacher_findById_ShouldReturnNotFoundWhenTeacherDoesNotExist() throws Exception {
        mockMvc
                .perform(MockMvcRequestBuilders.get("/api/teacher/{id}", "4")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void teacher_findById_ShouldReturnBadRequestWhenNumberFormatException() throws Exception {
        mockMvc
                .perform(MockMvcRequestBuilders.get("/api/teacher/{id}", "error")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }
}
