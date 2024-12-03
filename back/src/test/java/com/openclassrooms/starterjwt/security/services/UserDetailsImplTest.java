package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
public class UserDetailsImplTest {

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
    public void userDetailsImpl_isAccountNonExpired_ShouldReturnTrue_WhenAccountNonExpired() {
        // GIVEN : Initialiser UserDetailsImpl
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();

        // WHEN & THEN : Vérifier que isAccountNonExpired retourne true
        assertThat(userDetails.isAccountNonExpired()).isTrue();
    }

    @Test
    public void userDetailsImpl_isAccountNonLocked_ShouldReturnTrue_WhenAccountNonLocked() {
        // GIVEN : Initialiser UserDetailsImpl
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();

        // WHEN & THEN : Vérifier que isAccountNonLocked retourne true
        assertThat(userDetails.isAccountNonLocked()).isTrue();
    }

    @Test
    public void userDetailsImpl_isCredentialsNonExpired_ShouldReturnTrue_WhenCredentialsNonExpired() {
        // GIVEN : Initialiser UserDetailsImpl
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();

        // WHEN & THEN : Vérifier que isCredentialsNonExpired retourne true
        assertThat(userDetails.isCredentialsNonExpired()).isTrue();
    }

    @Test
    public void userDetailsImpl_isEnabled_ShouldReturnTrue_WhenIsEnabled() {
        // GIVEN : Initialiser UserDetailsImpl
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();

        // WHEN & THEN : Vérifier que isEnabled retourne true
        assertThat(userDetails.isEnabled()).isTrue();
    }

    @Test
    public void userDetailsImpl_equals_ShouldReturnTrue_WhenThisEqualsObject() {
        // GIVEN : Créer une instance de UserDetailsImpl
        Long userId = 1L;
        String username = "daryl@mail.com";
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
    public void userDetailsImpl_equals_ShouldReturnFalse_WhenObjectIsNullOrNotSameClass() {
        // GIVEN
        Long userId = 1L;
        String username = "daryl@mail.com";
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
    public void userDetailsImpl_equals_ShouldReturnTrue_WhenThisEqualsObjectWithId() {
        // GIVEN : Créer une instance de UserDetailsImpl
        Long userId = 1L;
        String username = "daryl@mail.com";
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
