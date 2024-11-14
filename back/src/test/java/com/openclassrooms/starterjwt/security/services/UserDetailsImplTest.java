package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
public class UserDetailsImplTest {

   /* @Test
    public void userDetailsImpl_ShouldReturnCorrectAttributes() {
        // GIVEN : Initialisation de UserDetailsImpl
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("testUser")
                .firstName("John")
                .lastName("Doe")
                .admin(true)
                .password("password123")
                .build();

        // THEN : Vérifier les attributs
        assertThat(userDetails.getId()).isEqualTo(1L);
        assertThat(userDetails.getUsername()).isEqualTo("testUser");
        assertThat(userDetails.getFirstName()).isEqualTo("John");
        assertThat(userDetails.getLastName()).isEqualTo("Doe");
        assertThat(userDetails.getPassword()).isEqualTo("password123");
        assertThat(userDetails.getAdmin()).isTrue();
    }*/

    @Test
    public void userDetailsImpl_getAuthorities_ShouldReturnEmptyAuthorities() {
        // GIVEN : Initialiser UserDetailsImpl
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();

        // WHEN : Simuler la méthode getAuthorities du service
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

        // THEN : Vérifier que authorities est vide
        assertThat(authorities).isNotNull();
        assertThat(authorities).isEmpty();
    }

    @Test
    public void userDetailsImpl_isAccountNonExpired_ShouldReturnTrueWhenAccountNonExpired() {
        // GIVEN : Initialiser UserDetailsImpl
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();

        // WHEN & THEN : Vérifier que isAccountNonExpired retourne true
        assertThat(userDetails.isAccountNonExpired()).isTrue();
    }

    @Test
    public void userDetailsImpl_isAccountNonLocked_ShouldReturnTrueWhenAccountNonLocked() {
        // GIVEN : Initialiser UserDetailsImpl
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();

        // WHEN & THEN : Vérifier que isAccountNonLocked retourne true
        assertThat(userDetails.isAccountNonLocked()).isTrue();
    }

    @Test
    public void userDetailsImpl_isCredentialsNonExpired_ShouldReturnTrueWhenCredentialsNonExpired() {
        // GIVEN : Initialiser UserDetailsImpl
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();

        // WHEN & THEN : Vérifier que isCredentialsNonExpired retourne true
        assertThat(userDetails.isCredentialsNonExpired()).isTrue();
    }

    @Test
    public void userDetailsImpl_isEnabled_ShouldReturnTrueWhenIsEnabled() {
        // GIVEN : Initialiser UserDetailsImpl
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();

        // WHEN & THEN : Vérifier que isEnabled retourne true
        assertThat(userDetails.isEnabled()).isTrue();
    }

    @Test
    public void userDetailsImpl_equals_ShouldReturnTrueWhenThisEqualsObject() {
        // GIVEN : Créer une instance de UserDetailsImpl
        Long userId = 1L;
        String username = "walkingdead";
        String firstName = "Daryl";
        String lastName = "Dixon";
        Boolean admin = true;
        String password = "123456";

        UserDetailsImpl userDetails = new UserDetailsImpl(userId, username, firstName, lastName, admin, password);

        // WHEN : Comparer l'objet avec lui-même
        boolean result = userDetails.equals(userDetails);

        // THEN : Vérifier que la méthode retourne true
        assertThat(result).isTrue();
    }

    @Test
    public void userDetailsImpl_equals_ShouldReturnFalseWhenObjectIsNullOrNotSameClass() {
        // GIVEN
        Long userId = 1L;
        String username = "walkingdead";
        String firstName = "Daryl";
        String lastName = "Dixon";
        Boolean admin = true;
        String password = "123456";

        UserDetailsImpl userDetails = new UserDetailsImpl(userId, username, firstName, lastName, admin, password);

        // WHEN : Comparer l'objet avec null
        boolean resultWithNull = userDetails.equals(null);

        // WHEN : Comparer avec un objet d'une classe différente
        Object anotherObject = new Object();
        boolean differentClass = userDetails.equals(anotherObject);

        // THEN : Vérifier que la méthode retourne false dans les deux cas
        assertThat(resultWithNull).isFalse();
        assertThat(differentClass).isFalse();
    }

    @Test
    public void userDetailsImpl_equals_ShouldReturnTrueWhenThisEqualsObjectWithId() {
        // GIVEN : Créer une instance de UserDetailsImpl
        Long userId = 1L;
        String username = "walkingdead";
        String firstName = "Daryl";
        String lastName = "Dixon";
        Boolean admin = true;
        String password = "123456";

        UserDetailsImpl userDetails1 = new UserDetailsImpl(userId, username, firstName, lastName, admin, password);
        UserDetailsImpl userDetails2 = new UserDetailsImpl(userId, username, firstName, lastName, admin, password);

        // WHEN : Comparer les deux objets qui ont les mêmes valeurs
        boolean result = userDetails1.equals(userDetails2);

        // THEN : Vérifier que la méthode retourne true
        assertThat(result).isTrue();
    }
}
