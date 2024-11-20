package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    UserRepository userRepository;

    @InjectMocks
    private UserService classUnderTest;

    @BeforeEach
    public void setup() {
        // Ici, Mockito injectera automatiquement les mocks dans classUnderTest, grâce à InjectMocks.
    }

    @Test
    public void user_delete_ShouldDeleteUser() {
        // GIVEN : Initialiser un userid
        Long userId = 1L;

        // WHEN : Simuler l'appel dans le service
        classUnderTest.delete(userId);

        // THEN : Vérifier que l'user a bien été supprimé
        then(userRepository).should().deleteById(userId);
    }

    @Test
    public void user_findById_ShouldReturnUserByIdWhenUserExist() {
        // GIVEN : Initialiser un userid
        Long userid = 1L;
        User user = new User();
        user.setId(1L);
        user.setEmail("daryl@mail.com");
        user.setFirstName("Daryl");
        user.setLastName("Dixon");

        given(userRepository.findById(userid)).willReturn(Optional.of(user));

        // WHEN
        classUnderTest.findById(userid);

        // THEN : Vérifier que la méthode findById a été appelée et que le contenu est correct
        then(userRepository).should().findById(userid);
        assertThat(user).isNotNull();
        assertThat(user.getId()).isEqualTo(userid);
        assertThat(user.getEmail()).isEqualTo("daryl@mail.com");
        assertThat(user.getFirstName()).isEqualTo("Daryl");
        assertThat(user.getLastName()).isEqualTo("Dixon");
    }

    @Test
    public void user_findById_ShouldReturnNullWhenUserDoesNotExist() {
        // GIVEN : Initialiser un userid
        Long userid = 2L;

        given(userRepository.findById(userid)).willReturn(Optional.empty());

        // WHEN : Simuler l'appel findById dans le service
        User user = classUnderTest.findById(userid);

        // THEN : Vérifier que l'appel et que ça renvoie null
        then(userRepository).should().findById(userid);
        assertThat(user).isNull();
    }
}
