package com.openclassrooms.starterjwt.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import com.openclassrooms.starterjwt.services.SessionService;
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

import java.util.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
public class SessionControllerIT {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private SessionService sessionService;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    private String jwtToken;

    private SessionDto testSessionDto;

    @BeforeEach
    void setUp() {
        // Générer un jwt token
        UserDetails userDetails = userDetailsService.loadUserByUsername("yoga@studio.com");

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        jwtToken = jwtUtils.generateJwtToken(authentication);

        // On iniatialise ici les sessions
        testSessionDto = new SessionDto();
        testSessionDto.setName("Pilate modif");
        testSessionDto.setDescription("Cours de 1h de pilate");
        testSessionDto.setDate(new Date());
        testSessionDto.setTeacher_id(2L);
    }

    @Test
    public void session_findAll_ShouldReturnListSessions_WhenSessionsExist() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/session")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$").isArray());
    }

    @Test
    public void session_findById_ShouldReturnSession_WhenSessionExist() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/session/{id}", "1")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Yoga"));
    }

    @Test
    public void session_findById_ShouldReturnNotFound_WhenSessionDoesNotExist() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/session/{id}", "3")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void session_findById_ShouldReturnBadRequest_WhenNumberFormatException() throws Exception {
        mockMvc
                .perform(MockMvcRequestBuilders.get("/api/session/{id}", "error")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void session_create_ShouldSaveSession() throws Exception {
        // Initialiser une session
        SessionDto testSessionDto = new SessionDto();
        testSessionDto.setId(2L);
        testSessionDto.setName("Pilate");
        testSessionDto.setDescription("Cours de 45min de pilate");
        testSessionDto.setDate(new Date());
        testSessionDto.setTeacher_id(2L);

        // Convertir les données en JSON
        String sessionDtoJson = new ObjectMapper().writeValueAsString(testSessionDto);

        // Vérifier les données attendues
        mockMvc.perform(MockMvcRequestBuilders.post("/api/session")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                    .content(sessionDtoJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(2L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Pilate"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.description").value("Cours de 45min de pilate"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.teacher_id").value(2L));
    }

    @Test
    public void session_update_ShouldReturnSession_WhenSessionExist() throws Exception {
        // Convertir les données en JSON
        String sessionDtoJson = new ObjectMapper().writeValueAsString(testSessionDto);

        // Vérifier les données attendues
        mockMvc.perform(MockMvcRequestBuilders.put("/api/session/{id}", "1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(sessionDtoJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Pilate modif"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.description").value("Cours de 1h de pilate"));
    }

    @Test
    public void session_update_ShouldReturnBadRequest_WhenNumberFormatException() throws Exception {
        // Convertir les données en JSON
        String sessionDtoJson = new ObjectMapper().writeValueAsString(testSessionDto);

        // Vérifier les données attendues
        mockMvc.perform(MockMvcRequestBuilders.put("/api/session/{id}", "error")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(sessionDtoJson))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void session_delete_ShouldDeleteSession_WhenSessionExist() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/{id}", "1")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void session_delete_ShouldReturnNotFound_WhenSessionDoesNotExist() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/{id}", "2")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void session_delete_ShouldReturnBadRequest_WhenNumberFormatException() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/{id}", "error")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void session_participate_ShouldAddUserToSession_WhenSessionAndUserExist() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/session/{id}/participate/{userId}", "1", "1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void session_participate_ShouldReturnBadRequest_WhenNumberFormatException() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/session/{id}/participate/{userId}", "1", "error")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void session_participate_ShouldReturnNotFound_WhenSessionDoesNotExist() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/session/{id}/participate/{userId}", "2", "1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void session_participate_ShouldReturnNotFound_WhenUserDoesNotExist() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/session/{id}/participate/{userId}", "1", "5")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void session_participate_ShouldReturnBadRequest_WhenUserAlreadyParticipates() throws Exception {
        // Préparer une session avec un utilisateur existant
        User user = userRepository.findById(1L).orElseThrow(() -> new RuntimeException("User not found"));
        Session session = sessionRepository.findById(1L).orElseThrow(() -> new RuntimeException("Session not found"));

        // Ajouter l'utilisateur à la session, pour qu'il participe déjà
        session.setUsers(new ArrayList<>(List.of(user)));
        sessionRepository.save(session);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/session/{id}/participate/{userId}", "1", "1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void session_noLongerParticipate_ShouldDeleteUserInSession_WhenSessionExistAndUserParticipate() throws Exception {
        // Préparer une session avec un utilisateur existant
        User user = userRepository.findById(1L).orElseThrow(() -> new RuntimeException("User not found"));
        Session session = sessionRepository.findById(1L).orElseThrow(() -> new RuntimeException("Session not found"));

        // Ajouter l'utilisateur à la session, pour qu'il participe et pouvoir le supprimer
        session.setUsers(new ArrayList<>(List.of(user)));
        sessionRepository.save(session);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/{id}/participate/{userId}", "1", "1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void session_noLongerParticipate_ShouldReturnNotFound_WhenSessionDoesNotExist() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/{id}/participate/{userId}", "5", "1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void session_noLongerParticipate_ShouldReturnBadRequest_WhenNumberFormatException() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/{id}/participate/{userId}", "1", "error")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void session_noLongerParticipate_ShouldReturnBadRequest_WhenSessionExistAndUserNotParticipate() throws Exception {
        // Préparer une session
        Session session = sessionRepository.findById(1L).orElseThrow(() -> new RuntimeException("Session not found"));

        // Préparer une liste vide, aucun utilisateur ne participe à la session
        session.setUsers(new ArrayList<>());
        sessionRepository.save(session);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/{id}/participate/{userId}", "1", "1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

}
