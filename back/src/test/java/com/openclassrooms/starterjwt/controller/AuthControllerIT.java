package com.openclassrooms.starterjwt.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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
public class AuthControllerIT {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

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
    public void auth_authenticateUser_ShouldReturnUserWhenUserIsOkAndAdmin() throws Exception {
        // GIVEN : Créer un utilisateur et un JWT
        String username = "yoga@studio.com";
        String firstName = "Admin";
        String lastName = "Admin";
        boolean isAdmin = true;

        // Créer un LoginRequest
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("yoga@studio.com");
        loginRequest.setPassword("test!1234");

        String loginRequestJson = new ObjectMapper().writeValueAsString(loginRequest);

        // WHEN : Authentification via MockMvc pour obtenir un JWT valide
        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequestJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.token").exists()) // Vérifie si le champ token existe
                .andExpect(MockMvcResultMatchers.jsonPath("$.type").value("Bearer"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value(username))
                .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value(firstName))
                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value(lastName))
                .andExpect(MockMvcResultMatchers.jsonPath("$.admin").value(isAdmin));
    }

    @Test
    public void auth_authenticateUser_ShouldReturnUnauthorizedWhenUserNotFound() throws Exception {
        // GIVEN : Créer un LoginRequest avec un utilisateur qui n'existe pas
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nonexistent@studio.com");
        loginRequest.setPassword("test!1234");

        String loginRequestJson = new ObjectMapper().writeValueAsString(loginRequest);

        // WHEN : Authentification via MockMvc pour un utilisateur inexistant
        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequestJson))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    public void auth_registerUser_ShouldReturnSuccesMessageWhenSignupRequest() throws Exception {
        // GIVEN : Créer un signUpRequest
        SignupRequest signUpRequest = new SignupRequest();
        signUpRequest.setEmail("daryl@mail.com");
        signUpRequest.setFirstName("Daryl");
        signUpRequest.setLastName("Dixon");
        signUpRequest.setPassword("password");

        String signUpRequestJson = new ObjectMapper().writeValueAsString(signUpRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(signUpRequestJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("User registered successfully!"));
    }

    @Test
    public void auth_registerUser_ShouldReturnBadRequestAndErrorMessageWhenEmailAlreadyExist() throws Exception {
        // GIVEN : Créer un utilisateur dans la base de données avec un mail déjà utilisé
        SignupRequest signUpRequest = new SignupRequest();
        signUpRequest.setEmail("yoga@studio.com");
        signUpRequest.setFirstName("Daryl");
        signUpRequest.setLastName("Dixon");
        signUpRequest.setPassword("password");

        String signUpRequestJson = new ObjectMapper().writeValueAsString(signUpRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signUpRequestJson))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("Error: Email is already taken!"));
    }
}
