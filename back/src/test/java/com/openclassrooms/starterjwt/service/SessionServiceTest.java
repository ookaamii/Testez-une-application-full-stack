package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    SessionRepository sessionRepository;

    @Mock
    UserRepository userRepository;

    @InjectMocks
    private SessionService classUnderTest;


    @BeforeEach
    public void setup() {
        // Ici, Mockito injectera automatiquement les mocks dans classUnderTest, grâce à InjectMocks.
    }

    @Test
    public void session_createSession() {
        // GIVEN : Initialiser les objets nécessaires au test
        Session session = new Session();
        session.setName("Pilate");
        session.setDescription("Super cours de pilate");

        // Pour un save, on peut mettre any pour une instance générique, sans session précise
        given(sessionRepository.save(any(Session.class))).willReturn(session);

        // WHEN : Appeler la méthode create du service
        Session createdSession = classUnderTest.create(session);

        // THEN : Vérifier les résultats
        assertThat(createdSession).isNotNull();
        assertThat(createdSession.getName()).isEqualTo("Pilate");
        assertThat(createdSession.getDescription()).isEqualTo("Super cours de pilate");

        // Vérifier que la méthode save a été appelée une fois avec la bonne instance de session
        verify(sessionRepository).save(session);
    }

    @Test
    public void session_deleteSession() {
        // GIVEN : un ID de session pour la suppression
        Long sessionId = 1L;

        // WHEN : on appelle la méthode delete du service
        classUnderTest.delete(sessionId);

        // THEN : on vérifie que deleteById a été appelée avec l'id spécifié
        then(sessionRepository).should().deleteById(sessionId);
    }

    @Test
    public void session_findAllSession() {
        // GIVEN : Préparer une liste de sessions simulée
        Session session1 = new Session();
        session1.setName("Pilate");
        session1.setDescription("Super cours de pilate");

        Session session2 = new Session();
        session2.setName("Yoga débutant");
        session2.setDescription("Cours de yoga pour débutants");

        List<Session> expectedSessions = Arrays.asList(session1, session2);
        given(sessionRepository.findAll()).willReturn(expectedSessions);

        // WHEN : Appeler la méthode findAll du service
        List<Session> actualSessions = classUnderTest.findAll();

        // THEN : Vérifier que la méthode findAll a été appelée et que le contenu est correct
        then(sessionRepository).should().findAll();
        assertThat(actualSessions).isNotNull();
        assertThat(actualSessions).hasSize(2);  // Vérifie que la liste a deux éléments
        assertThat(actualSessions).containsExactlyElementsOf(expectedSessions);  // Vérifie que le contenu correspond
    }

    @Test
    public void session_getById_ShouldReturnSession_WhenSessionExists() {
        // GIVEN : Initialiser une session
        Long sessionId = 1L;
        Session expectedSession = new Session();
        expectedSession.setId(sessionId);
        expectedSession.setName("Pilate");
        expectedSession.setDescription("Super cours de pilate");

        // Simuler un appel à findById avec un id spécifique. Et retourner un Optional<Session> contenant une session précise
        given(sessionRepository.findById(sessionId)).willReturn(Optional.of(expectedSession));

        // WHEN : Appeler la méthode getById du service
        Session actualSession = classUnderTest.getById(sessionId);

        // THEN : Vérifier que la méthode findById a été appelée et que le contenu est correct
        then(sessionRepository).should().findById(sessionId);
        assertThat(actualSession).isNotNull();
        assertThat(actualSession.getId()).isEqualTo(sessionId);
        assertThat(actualSession.getName()).isEqualTo("Pilate");
        assertThat(actualSession.getDescription()).isEqualTo("Super cours de pilate");
    }

    @Test
    public void session_getById_ShouldReturnNull_WhenSessionDoesNotExist() {
        // GIVEN : Simuler le cas où findById ne trouve pas la session
        Long sessionId = 1L;
        given(sessionRepository.findById(sessionId)).willReturn(Optional.empty());

        // WHEN : Appeler la méthode getById du service
        Session actualSession = classUnderTest.getById(sessionId);

        // THEN : Vérifier que la méthode retourne null lorsqu’il n’y a pas de session pour cet id.
        then(sessionRepository).should().findById(sessionId);
        assertThat(actualSession).isNull();
    }

    @Test
    public void session_updateSession() {
        // GIVEN : Simuler une session 1, avec des données à mettre à jour
        Long sessionId = 1L;

        Session updatedSession = new Session();
        updatedSession.setId(sessionId);
        updatedSession.setName("Nom modifié");
        updatedSession.setDescription("Super description modifiée");

        // Simuler le comportement de save pour retourner la session mise à jour avec l'id défini
        given(sessionRepository.save(any(Session.class))).willReturn(updatedSession);

        // WHEN : Appeler la méthode update du service
        Session result = classUnderTest.update(sessionId, updatedSession);

        // THEN : Vérifier que le résultat contient l'id et les nouvelles données
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(sessionId);
        assertThat(result.getName()).isEqualTo("Nom modifié");
        assertThat(result.getDescription()).isEqualTo("Super description modifiée");

        // Vérifier que save a été appelé avec l'instance ayant l'id mis à jour
        verify(sessionRepository).save(updatedSession);
    }

    @Test
    public void session_participate_ShouldSaveSession_WhenUserAndSessionNotNullAndNotAlreadyParticipate() {
        // GIVEN : Simuler une session et un utilisateur qui existent, où l'user ne participe pas encore
        Long sessionId = 1L;
        Long userId = 1L;

        Session session = new Session();
        session.setId(sessionId);
        session.setName("Pilate");
        session.setDescription("Super cours de pilate");
        session.setUsers(new ArrayList<>());

        User user = new User();
        user.setId(userId);
        user.setFirstName("Jean");
        user.setLastName("Neige");

        // Simuler la récupération de la session et de l'utilisateur
        given(sessionRepository.findById(sessionId)).willReturn(Optional.of(session));
        given(userRepository.findById(userId)).willReturn(Optional.of(user));

        // Simuler le comportement de save pour la session mise à jour
        given(sessionRepository.save(session)).willReturn(session);

        // WHEN : Appeler la méthode participate du service
        classUnderTest.participate(sessionId, userId);

        // THEN : Vérifier que l'utilisateur a été ajouté à la session et que save a été appelé
        assertThat(session.getUsers()).contains(user);
        verify(sessionRepository).save(session);
    }

    @Test
    public void session_participate_ShouldThrowNotFoundException_WhenSessionIsNull() {
        // GIVEN : Un id de session et d'utilisateur
        Long sessionId = 1L;
        Long userId = 1L;

        // Simuler un résultat vide pour session
        given(sessionRepository.findById(sessionId)).willReturn(Optional.empty()); // session non trouvée
        given(userRepository.findById(userId)).willReturn(Optional.of(new User())); // user trouvé, peu importe ici

        // WHEN & THEN : Vérifier que NotFoundException est lancée
        assertThatThrownBy(() -> classUnderTest.participate(sessionId, userId))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    public void session_participate_ShouldThrowNotFoundException_WhenUserIsNull() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 1L;

        // Simuler un résultat vide pour user
        given(userRepository.findById(userId)).willReturn(Optional.empty());
        given(sessionRepository.findById(sessionId)).willReturn(Optional.of(new Session()));

        // WHEN & THEN : Vérifier que NotFoundException est lancée
        assertThatThrownBy(() -> classUnderTest.participate(sessionId, userId))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    public void session_participate_ShouldBadRequestException_WhenUserAlreadyParticipate() {
        // GIVEN : Simuler une session avec l'utilisateur déjà inscrit
        Long sessionId = 1L;
        Long userId = 1L;

        User user = new User();
        user.setId(userId);

        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(List.of(user));

        // Simuler la récupération de la session et de l'utilisateur
        given(sessionRepository.findById(sessionId)).willReturn(Optional.of(session));
        given(userRepository.findById(userId)).willReturn(Optional.of(user));

        // WHEN & THEN : Vérifier que BadRequestException est lancée
        assertThatThrownBy(() -> classUnderTest.participate(sessionId, userId))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    public void session_noLongerParticipate_ShouldSaveUserInSession_WhenUserNotAlreadyParticipate() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 1L;

        User user = new User();
        user.setId(userId);

        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(List.of(user));

        // Simuler la récupération de la session et de l'utilisateur
        given(sessionRepository.findById(sessionId)).willReturn(Optional.of(session));

        // WHEN : Appeler la méthode noLongerParticipate du service
        classUnderTest.noLongerParticipate(sessionId, userId);

        // THEN : Vérifier que l'utilisateur a été supprimé de la session et que save a été appelé
        assertThat(session.getUsers()).doesNotContain(user);
        verify(sessionRepository).save(session);
    }

    @Test
    public void session_noLongerParticipate_ShouldNotFoundException_WhenUserIsNull() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 1L;

        // Simuler une session vide
        given(sessionRepository.findById(sessionId)).willReturn(Optional.empty());

        // WHEN & THEN : Vérifier que NotFoundException est lancée
        assertThatThrownBy(() -> classUnderTest.noLongerParticipate(sessionId, userId))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    public void session_noLongerParticipate_ShouldBadRequestException_WhenUserNotAlreadyParticipate() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 2L; // Utilisateur non présent dans la session

        // Création d'une session avec un utilisateur différent
        User user = new User();
        user.setId(1L); // ID différent de userId

        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(List.of(user)); // La session contient un autre utilisateur

        // Simuler une session où l'utilisateur attendu (qui doit être supprimé de la liste) ne participe pas
        given(sessionRepository.findById(sessionId)).willReturn(Optional.of(session));

        // WHEN & THEN : Vérifier que BadRequestException est lancée
        assertThatThrownBy(() -> classUnderTest.noLongerParticipate(sessionId, userId))
                .isInstanceOf(BadRequestException.class);
    }
}
