package com.openclassrooms.starterjwt.security.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceImplTest {

    @Mock
    UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @BeforeEach
    public void setup() {
        // Ici, Mockito injectera automatiquement les mocks dans classUnderTest, grâce à InjectMocks.
    }

    @Test
    public void userDetailsServiceImpl_loadUserByUsername_ShouldInitializeUser() {
        // GIVEN : Initialisation d'un utilisateur
        String email = "daryl@mail.com";
        User user = new User();
        user.setEmail("daryl@mail.com");
        user.setLastName("Dixon");
        user.setFirstName("Daryl");

        given(userRepository.findByEmail(email)).willReturn(Optional.of(user));

        // WHEN : Appeler la méthode loadUserByUsername
        UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(email);

        // THEN : Vérifier l'instance
        assertThat(userDetails).isInstanceOf(UserDetailsImpl.class);
    }

    @Test
    public void UserDetailsServiceImpl_loadUserByUsername_ShouldUsernameNotFoundException_WhereUserNotFound() {
        // GIVEN : Initialiser un mail d'un utilisateur qui n'existe pas
        String email = "daryl@mail.com";

        // Simuler un résultat vide pour cet email
        given(userRepository.findByEmail(email)).willReturn(Optional.empty());

        // WHEN & THEN : Vérifier que UsernameNotFoundException et le message d'erreur sont lancés
        assertThatThrownBy(() -> userDetailsServiceImpl.loadUserByUsername(email))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("User Not Found with email: " + email);
    }
}