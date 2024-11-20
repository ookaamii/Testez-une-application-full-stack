/*package com.openclassrooms.starterjwt.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.controllers.UserController;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.AuthEntryPointJwt;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import com.openclassrooms.starterjwt.services.UserService;

import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.BDDMockito.given;

import static org.mockito.Mockito.*;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get; // Pour les requêtes GET
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status; // Pour vérifier le statut HTTP
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath; // Pour vérifier le contenu JSON
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;


@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserController userController;

    private String jwtToken;

    @Transactional
    @BeforeEach
    void setUp() {
        // Créer un utilisateur pour les tests
        User testUser = new User();
        testUser.setId(5L);
        testUser.setEmail("okok@example.com");
        testUser.setPassword("password"); // Assure-toi d'utiliser un mot de passe encodé si nécessaire
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        userRepository.save(testUser); // Sauvegarde l'utilisateur en base de données (H2 en mémoire par exemple)


        // Charger les UserDetails via le UserDetailsService
        UserDetails userDetails = userDetailsService.loadUserByUsername(testUser.getEmail());
System.out.println(testUser.getEmail());
        // Créer un objet Authentication
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        // Générer le token JWT
        jwtToken = jwtUtils.generateJwtToken(authentication);
    }

    @Test
    void getUserById_Success_Test() throws Exception {
        // Vérifier l'existence de l'utilisateur dans la base de données
        Optional<User> userOptional = userRepository.findById(5L);
        assertTrue(userOptional.isPresent(), "User should be present in the database");
        System.out.println(jwtToken);
        // Quand on effectue la requête, on devrait récupérer cet utilisateur
        User user = userOptional.get();

        List<User> users = userRepository.findAll();
        System.out.println("Users in DB: " + user);


        // when and then
        mockMvc.perform(get("/api/user/{id}", "5")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5L))
                .andExpect(jsonPath("$.email").value("okok@example.com"))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"));
    }
}
*/